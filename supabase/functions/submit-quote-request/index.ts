import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteRequestData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization?: string;
  category: string;
  requirements: string;
  timeline: string;
  source_url?: string;
  user_agent?: string;
}

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
    const quoteData: QuoteRequestData = await req.json();
    
    console.log("Received quote request:", { 
      email: quoteData.email, 
      category: quoteData.category 
    });

    // Create Supabase client with service role key for bypassing RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

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
      throw new Error(`Failed to save quote request: ${insertError.message}`);
    }

    console.log("Quote request saved successfully:", insertedQuote.id);

    // Send email notification using Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    const emailResponse = await resend.emails.send({
      from: "Supply Ministry <notifications@resend.dev>",
      to: ["info@supplyministry.com.au"],
      subject: `New Quote Request from ${quoteData.first_name} ${quoteData.last_name}`,
      html: `
        <h2>New Quote Request Received</h2>
        
        <h3>Contact Information:</h3>
        <p><strong>Name:</strong> ${quoteData.first_name} ${quoteData.last_name}</p>
        <p><strong>Email:</strong> ${quoteData.email}</p>
        <p><strong>Phone:</strong> ${quoteData.phone}</p>
        ${quoteData.organization ? `<p><strong>Organization:</strong> ${quoteData.organization}</p>` : ''}
        
        <h3>Request Details:</h3>
        <p><strong>Category:</strong> ${quoteData.category}</p>
        <p><strong>Timeline:</strong> ${quoteData.timeline}</p>
        
        <h3>Requirements:</h3>
        <p>${quoteData.requirements.replace(/\n/g, '<br>')}</p>
        
        <hr>
        <p><small>Request ID: ${insertedQuote.id}</small></p>
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
        error: error.message || "An unexpected error occurred",
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