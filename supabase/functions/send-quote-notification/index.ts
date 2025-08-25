import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization?: string;
  category: string;
  requirements: string;
  timeline: string;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const quoteData: QuoteRequest = await req.json();

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
            <p><strong>Name:</strong> ${quoteData.first_name} ${quoteData.last_name}</p>
            <p><strong>Email:</strong> <a href="mailto:${quoteData.email}">${quoteData.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${quoteData.phone}">${quoteData.phone}</a></p>
            ${quoteData.organization ? `<p><strong>Organization:</strong> ${quoteData.organization}</p>` : ''}
          </div>

          <div style="background-color: #fff; border: 1px solid #dee2e6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #0066cc; margin-top: 0;">Quote Details</h2>
            <p><strong>Product Category:</strong> ${quoteData.category}</p>
            <p><strong>Timeline:</strong> ${quoteData.timeline}</p>
            
            <h3 style="color: #666; margin-top: 20px;">Requirements:</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #0066cc; margin: 10px 0;">
              ${quoteData.requirements.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="margin-top: 30px; padding: 15px; background-color: #e3f2fd; border-radius: 8px;">
            <p style="margin: 0; color: #0066cc; font-size: 14px;">
              <strong>Quote ID:</strong> ${quoteData.id}<br>
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
        error: error.message,
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