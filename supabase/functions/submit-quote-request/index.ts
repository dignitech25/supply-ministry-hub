import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_IP_PER_HOUR = 5;
const RATE_LIMIT_EMAIL_MINUTES = 10;

// Check rate limits for IP and email
async function checkRateLimits(
  supabase: any,
  clientIp: string,
  email: string,
  endpoint: string
): Promise<{ allowed: boolean; reason?: string }> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const tenMinutesAgo = new Date(now.getTime() - RATE_LIMIT_EMAIL_MINUTES * 60 * 1000);

  // Check IP-based rate limit (5 per hour)
  const { data: ipLimits } = await supabase
    .from('rate_limits')
    .select('request_count')
    .eq('identifier', clientIp)
    .eq('identifier_type', 'ip')
    .eq('endpoint', endpoint)
    .gte('window_start', oneHourAgo.toISOString())
    .order('window_start', { ascending: false })
    .limit(1)
    .single();

  if (ipLimits && ipLimits.request_count >= RATE_LIMIT_IP_PER_HOUR) {
    return { allowed: false, reason: 'Too many requests from this IP. Please try again later.' };
  }

  // Check email-based rate limit (once per 10 minutes)
  const { count: emailCount } = await supabase
    .from('quote_requests')
    .select('*', { count: 'exact', head: true })
    .eq('email', email)
    .gte('created_at', tenMinutesAgo.toISOString());

  if (emailCount && emailCount > 0) {
    return { allowed: false, reason: 'Please wait before submitting another quote request.' };
  }

  return { allowed: true };
}

// Record rate limit attempt
async function recordRateLimit(
  supabase: any,
  identifier: string,
  identifierType: string,
  endpoint: string
): Promise<void> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  // Try to increment existing record
  const { data: existing } = await supabase
    .from('rate_limits')
    .select('id, request_count')
    .eq('identifier', identifier)
    .eq('identifier_type', identifierType)
    .eq('endpoint', endpoint)
    .gte('window_start', oneHourAgo.toISOString())
    .order('window_start', { ascending: false })
    .limit(1)
    .single();

  if (existing) {
    await supabase
      .from('rate_limits')
      .update({ 
        request_count: existing.request_count + 1,
        updated_at: now.toISOString()
      })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('rate_limits')
      .insert({
        identifier,
        identifier_type: identifierType,
        endpoint,
        request_count: 1,
        window_start: now.toISOString()
      });
  }
}

// HTML escape function to prevent XSS in email content
const escapeHtml = (str: string | undefined | null): string => {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m] || m));
};

// Zod validation schema for quote request
const quoteRequestSchema = z.object({
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().min(8).max(20),
  organization: z.string().max(200).optional(),
  category: z.string().min(1).max(100),
  requirements: z.string().min(10).max(5000),
  timeline: z.string().min(1).max(100),
  source_url: z.string().url().max(500).optional(),
  user_agent: z.string().max(500).optional(),
});

type QuoteRequestData = z.infer<typeof quoteRequestSchema>;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { 
        status: 405, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }

  try {
    // Parse and validate input
    const rawData = await req.json();
    const validationResult = quoteRequestSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input data. Please check your submission and try again.',
          success: false 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
    
    const quoteData = validationResult.data;
    
    console.log("Received validated quote request:", { 
      email: quoteData.email, 
      category: quoteData.category 
    });

    // Create Supabase client with service role key for bypassing RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    
    // Check rate limits
    const rateLimitCheck = await checkRateLimits(
      supabase,
      clientIp,
      quoteData.email,
      'submit-quote-request'
    );

    if (!rateLimitCheck.allowed) {
      console.log('Rate limit exceeded:', { clientIp, email: quoteData.email });
      return new Response(
        JSON.stringify({ 
          error: rateLimitCheck.reason,
          success: false 
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    // Record this request for rate limiting
    await recordRateLimit(supabase, clientIp, 'ip', 'submit-quote-request');

    // Insert quote request into database
    const { data: insertedQuote, error: insertError } = await supabase
      .from("quote_requests")
      .insert({
        first_name: quoteData.first_name,
        last_name: quoteData.last_name,
        email: quoteData.email,
        phone: quoteData.phone,
        organization: quoteData.organization || null,
        category: quoteData.category,
        requirements: quoteData.requirements,
        timeline: quoteData.timeline,
        source_url: quoteData.source_url || null,
        user_agent: quoteData.user_agent || null,
        status: 'new'
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return new Response(
        JSON.stringify({ 
          error: "Unable to save quote request. Please try again.",
          success: false 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    console.log("Quote request saved successfully:", insertedQuote.id);

    // Send email notification using Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    const emailResponse = await resend.emails.send({
      from: "Supply Ministry <notifications@resend.dev>",
      to: ["info@supplyministry.com.au"],
      subject: `New Quote Request from ${escapeHtml(quoteData.first_name)} ${escapeHtml(quoteData.last_name)}`,
      html: `
        <h2>New Quote Request Received</h2>
        
        <h3>Contact Information:</h3>
        <p><strong>Name:</strong> ${escapeHtml(quoteData.first_name)} ${escapeHtml(quoteData.last_name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(quoteData.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(quoteData.phone)}</p>
        ${quoteData.organization ? `<p><strong>Organization:</strong> ${escapeHtml(quoteData.organization)}</p>` : ''}
        
        <h3>Request Details:</h3>
        <p><strong>Category:</strong> ${escapeHtml(quoteData.category)}</p>
        <p><strong>Timeline:</strong> ${escapeHtml(quoteData.timeline)}</p>
        
        <h3>Requirements:</h3>
        <p>${escapeHtml(quoteData.requirements).replace(/\n/g, '<br>')}</p>
        
        <hr>
        <p><small>Request ID: ${escapeHtml(insertedQuote.id)}</small></p>
        <p><small>Submitted: ${new Date(insertedQuote.created_at).toLocaleString()}</small></p>
      `,
    });

    console.log("Email notification sent:", emailResponse.id);

    return new Response(
      JSON.stringify({
        success: true,
        quote: {
          id: insertedQuote.id,
          created_at: insertedQuote.created_at,
          status: insertedQuote.status
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in submit-quote-request function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Unable to process request. Please try again.",
        success: false 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);