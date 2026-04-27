import EnhancedQuoteForm from "@/components/EnhancedQuoteForm";
import { useQuote } from "@/contexts/QuoteContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { Clock, Shield, Phone } from "lucide-react";
import EditorialNavigation from "@/components/editorial/EditorialNavigation";

const Quote = () => {
  const { state } = useQuote();
  const hasItems = state.items.length > 0;

  return (
    <div className="min-h-screen bg-violet text-cream">
      <SEO 
        title="Request a Quote"
        description="Get a no-obligation quote for assistive technology and mobility equipment. 24-hour response time with expert support across Australia."
      />
      <EditorialNavigation />
      
      {/* Header Section */}
      <section className="pt-12 pb-12 bg-violet text-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-geist font-light tracking-tight leading-[1.05] text-cream mb-4">
              Request a <span className="italic text-gold">quote</span>
            </h1>
            <p className="text-lg text-cream/85">
              Tell us about your requirements and we'll get back to you with a tailored quote.
            </p>
          </div>
          
          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-sm text-cream/85">
              <Clock className="h-4 w-4 text-gold" />
              <span>Response within 24 hours</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-cream/85">
              <Shield className="h-4 w-4 text-gold" />
              <span>No obligation quote</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-cream/85">
              <Phone className="h-4 w-4 text-gold" />
              <span>Expert support available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-12 bg-cream text-ink">
        <div className="container mx-auto px-4">
          {hasItems ? (
            <div className="max-w-2xl mx-auto">
              <EnhancedQuoteForm />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center bg-cream-alt border border-cream-border rounded-2xl p-10">
              <h2 className="font-geist text-2xl md:text-3xl text-ink mb-3">
                Add products to your quote first
              </h2>
              <p className="text-muted-body mb-6">
                Browse our catalogue and add the items you'd like quoted. Once you have at least one item, return here to send your request.
              </p>
              <Button asChild className="bg-ink text-cream hover:opacity-90">
                <Link to="/products">Browse products</Link>
              </Button>
              <p className="text-sm text-muted-body mt-6">
                Prefer to talk it through? Email or call us using the contacts below.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-cream-alt text-ink">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-body mb-4">
            Prefer to speak with someone directly?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <div>
              <strong>Alex:</strong> alex@supplyministry.com.au | 0452 002 450
            </div>
            <div>
              <strong>David:</strong> david@supplyministry.com.au | 0404 593 090
            </div>
          </div>
          <p className="text-sm text-muted-body mt-4">
            Business Hours: Monday - Friday, 8:30 AM - 5:00 PM AEST
          </p>
        </div>
      </section>
    </div>
  );
};

export default Quote;
