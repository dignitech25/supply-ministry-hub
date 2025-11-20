import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-senior-assistive.jpg";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-card py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="lg:pr-8">
          <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Achieve Greater{" "}
            <span className="text-primary">Comfort and Safety</span>
          </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We bring you a wide range of mobility and home modification solutions 
              for your clients across Greater Metropolitan Melbourne.
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                "Trusted supplier relationships",
                "Competitive pricing",
                "Fast 48-hour dispatch",
                "Expert personal service"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8"
                onClick={() => document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Request a Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Products
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Trusted by leading healthcare providers</p>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">2000+</p>
                  <p className="text-sm text-muted-foreground">Products Available</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">48hrs</p>
                  <p className="text-sm text-muted-foreground">Quick Dispatch</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">15+</p>
                  <p className="text-sm text-muted-foreground">Years Experience</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image - Expanded for Desktop */}
          <div className="lg:pl-8">
            <div className="relative">
              <img
                src={heroImage}
                alt="Smiling senior woman using assistive technology with confidence"
                className="rounded-2xl shadow-xl w-full h-[400px] lg:h-[600px] object-cover"
              />
              {/* Purple overlay for text contrast */}
              <div className="absolute inset-0 bg-primary/10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;