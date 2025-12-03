import Navigation from "@/components/Navigation";
import QuoteForm from "@/components/QuoteForm";
import { Clock, Shield, Phone } from "lucide-react";

const Quote = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="pt-8 pb-12 bg-soft-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Request a Quote
            </h1>
            <p className="text-lg text-muted-foreground">
              Tell us about your requirements and we'll get back to you with a tailored quote.
            </p>
          </div>
          
          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-orange-500" />
              <span>Response within 24 hours</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-orange-500" />
              <span>No obligation quote</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-orange-500" />
              <span>Expert support available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <QuoteForm />
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-soft-gray">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">
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
          <p className="text-sm text-muted-foreground mt-4">
            Business Hours: Monday - Friday, 8:30 AM - 5:00 PM AEST
          </p>
        </div>
      </section>
    </div>
  );
};

export default Quote;
