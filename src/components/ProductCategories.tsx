import { Button } from "@/components/ui/button";

const ProductCategories = () => {
  return (
    <section className="py-20 bg-soft-gray">
      <div className="container mx-auto px-4">
        <div className="text-center bg-card rounded-2xl p-8 md:p-12 border border-border max-w-4xl mx-auto shadow-sm">
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Need expert guidance choosing the right solution?
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our experienced team can guide you through our complete range and help you find 
            the perfect assistive technology solution for your client's specific needs.
          </p>
          <Button 
            size="lg" 
            className="bg-ink text-cream hover:opacity-90 transition-colors"
            onClick={() => document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Speak with Expert
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;