import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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
    .from('quotes')
    .select('*', { count: 'exact', head: true })
    .eq('requester_email', email)
    .gte('created_at', tenMinutesAgo.toISOString());

  if (emailCount && emailCount > 0) {
    return { allowed: false, reason: 'Please wait before submitting another quote.' };
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

interface QuotePayload {
  requester_type: string;
  requester_name: string;
  requester_organisation?: string;
  requester_email: string;
  requester_phone?: string;
  client_name: string;
  client_ndis_number?: string;
  funding_type: string;
  delivery_address: string;
  clinical_context?: string;
  urgency: string;
  items: Array<{
    sku: string;
    title: string;
    size?: string;
    colour?: string;
    quantity: number;
    unit_price?: string;
    price_source?: string;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: QuotePayload = await req.json();
    console.log("Received quote payload:", payload);

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    
    // Check rate limits
    const rateLimitCheck = await checkRateLimits(
      supabase,
      clientIp,
      payload.requester_email,
      'submit-quote-with-email'
    );

    if (!rateLimitCheck.allowed) {
      console.log('Rate limit exceeded:', { clientIp, email: payload.requester_email });
      return new Response(
        JSON.stringify({ 
          success: false,
          error: rateLimitCheck.reason 
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Record this request for rate limiting
    await recordRateLimit(supabase, clientIp, 'ip', 'submit-quote-with-email');

    // Call the RPC function to create quote with items
    const { data: rpcResult, error: rpcError } = await supabase
      .rpc('create_quote_with_items', { p_payload: payload });

    if (rpcError) {
      console.error("RPC Error:", rpcError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Unable to create quote. Please try again.' 
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    console.log("Quote created:", rpcResult);

    const quoteNumber = rpcResult[0]?.ref_code;
    
    if (!quoteNumber) {
      throw new Error("No quote reference returned from RPC");
    }

    // Prepare email content with HTML escaping for security
    const itemsList = payload.items.map(item => 
      `• ${escapeHtml(item.title)} [${escapeHtml(item.sku)}] ${escapeHtml(item.size)} ${escapeHtml(item.colour)} x${item.quantity} @ $${escapeHtml(item.unit_price)}`
    ).join('<br/>');

    const emailHtml = `
      <p>Hi ${escapeHtml(payload.requester_name)},</p>
      
      <p>Thank you for your quote request. Your reference number is <strong>${escapeHtml(quoteNumber)}</strong>.</p>
      
      <p>Our team will review and confirm pricing shortly.</p>
      
      <p>
        <strong>Requester Type:</strong> ${escapeHtml(payload.requester_type)}<br/>
        ${payload.requester_organisation ? `<strong>Organisation:</strong> ${escapeHtml(payload.requester_organisation)}<br/>` : ''}
        <strong>Client:</strong> ${escapeHtml(payload.client_name)}<br/>
        ${payload.client_ndis_number ? `<strong>NDIS Number:</strong> ${escapeHtml(payload.client_ndis_number)}<br/>` : ''}
        <strong>Funding:</strong> ${escapeHtml(payload.funding_type)}<br/>
        <strong>Delivery Address:</strong> ${escapeHtml(payload.delivery_address)}<br/>
        <strong>Urgency:</strong> ${escapeHtml(payload.urgency)}<br/>
        ${payload.clinical_context ? `<strong>Clinical Context:</strong> ${escapeHtml(payload.clinical_context)}<br/>` : ''}
      </p>
      
      <p><strong>Items:</strong><br/>${itemsList}</p>
      
      <p><em>Prices are indicative only and subject to Supply Ministry review. Freight, installation, and site requirements may affect the final price.</em></p>
      
      <p>
        Kind regards,<br/>
        Supply Ministry Team<br/>
        <a href='https://supplyministry.com.au'>supplyministry.com.au</a>
      </p>
    `;

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Supply Ministry <no-reply@supplyministry.com.au>",
      to: [
        payload.requester_email,
        "david@supplyministry.com.au",
        "alex@supplyministry.com.au"
      ],
      subject: `Quote request received – ${quoteNumber}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        quoteNumber,
        emailId: emailResponse.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in submit-quote-with-email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Unable to process request. Please try again.' 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
