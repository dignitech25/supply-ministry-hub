import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-senior-assistive.jpg";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { useRef } from "react";

const HeroSection = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsVisible = useInView(statsRef);
  
  const productsCount = useCountUp(2000, 2000, isStatsVisible);
  const hoursCount = useCountUp(48, 1500, isStatsVisible);
  const yearsCount = useCountUp(15, 1800, isStatsVisible);

  return (
    <section className="relative bg-gradient-card py-20 lg:py-32 overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="lg:pr-8">
          <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-6 leading-tight animate-fade-in-up">
            Achieve Greater{" "}
            <span className="text-primary">Comfort and Safety</span>
          </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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
                <div 
                  key={index} 
                  className="flex items-center space-x-3 animate-fade-in-up"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <Button 
                size="lg" 
                className="bg-orange-500 text-white hover:bg-orange-600 transition-all hover:scale-105 text-lg px-8"
                onClick={() => document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Request a Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 hover:scale-105 transition-transform"
                asChild
              >
                <a href="/products">
                  View Products
                </a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div ref={statsRef} className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Trusted by leading healthcare providers</p>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary tabular-nums">
                    {productsCount}+
                  </p>
                  <p className="text-sm text-muted-foreground">Products Available</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary tabular-nums">
                    {hoursCount}hrs
                  </p>
                  <p className="text-sm text-muted-foreground">Quick Dispatch</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary tabular-nums">
                    {yearsCount}+
                  </p>
                  <p className="text-sm text-muted-foreground">Years Experience</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image - Expanded for Desktop */}
          <div className="lg:pl-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="relative group">
              <img
                src={heroImage}
                alt="Smiling senior woman using assistive technology with confidence"
                className="rounded-2xl shadow-xl w-full h-[400px] lg:h-[600px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;