import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

// Zod validation schema for quote notification
const quoteRequestSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().min(8).max(20),
  organization: z.string().max(200).optional(),
  category: z.string().min(1).max(100),
  requirements: z.string().min(1).max(5000),
  timeline: z.string().min(1).max(100),
  created_at: z.string(),
});

type QuoteRequest = z.infer<typeof quoteRequestSchema>;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input
    const rawData = await req.json();
    const validationResult = quoteRequestSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid quote notification data',
          success: false 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
    
    const quoteData = validationResult.data;

    console.log("Sending quote notification email for:", quoteData.id);

    const emailResponse = await resend.emails.send({
      from: "Supply Ministry Quotes <onboarding@resend.dev>",
      to: ["david@supplyministry.com.au"],
      subject: `New Quote Request from ${quoteData.first_name} ${quoteData.last_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            New Quote Request
          </h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #0066cc; margin-top: 0;">Contact Information</h2>
            <p><strong>Name:</strong> ${escapeHtml(quoteData.first_name)} ${escapeHtml(quoteData.last_name)}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(quoteData.email)}">${escapeHtml(quoteData.email)}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${escapeHtml(quoteData.phone)}">${escapeHtml(quoteData.phone)}</a></p>
            ${quoteData.organization ? `<p><strong>Organization:</strong> ${escapeHtml(quoteData.organization)}</p>` : ''}
          </div>

          <div style="background-color: #fff; border: 1px solid #dee2e6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #0066cc; margin-top: 0;">Quote Details</h2>
            <p><strong>Product Category:</strong> ${escapeHtml(quoteData.category)}</p>
            <p><strong>Timeline:</strong> ${escapeHtml(quoteData.timeline)}</p>
            
            <h3 style="color: #666; margin-top: 20px;">Requirements:</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #0066cc; margin: 10px 0;">
              ${escapeHtml(quoteData.requirements).replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="margin-top: 30px; padding: 15px; background-color: #e3f2fd; border-radius: 8px;">
            <p style="margin: 0; color: #0066cc; font-size: 14px;">
              <strong>Quote ID:</strong> ${escapeHtml(quoteData.id)}<br>
              <strong>Submitted:</strong> ${new Date(quoteData.created_at).toLocaleString('en-AU', { 
                timeZone: 'Australia/Sydney',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            <p>This email was automatically generated from your Supply Ministry quote form.</p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-quote-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Unable to process request. Please try again.",
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);