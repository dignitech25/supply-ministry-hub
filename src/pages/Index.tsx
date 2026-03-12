import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import BrandTrustStrip from "@/components/BrandTrustStrip";
import Footer from "@/components/Footer";
import SEO, { organizationSchema, localBusinessSchema } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

// Lazy-load below-fold heavy components
const FeaturedProducts = lazy(() => import("@/components/FeaturedProducts"));
const ProductCategoryCards = lazy(() => import("@/components/ProductCategoryCards"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const AnimatedSection = lazy(() => import("@/components/AnimatedSection"));
const FloatingSmartCTA = lazy(() => import("@/components/FloatingSmartCTA"));
const FAQSection = lazy(() => import("@/components/FAQSection").then(m => ({ default: m.default })));

// Need faqPageSchema eagerly for SEO
import { faqPageSchema } from "@/components/FAQSection";

const SectionFallback = () => <div className="py-20" />;

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Assistive Technology & Mobility Aids | Supply Ministry"
        description="Australia's trusted assistive technology provider. Mobility aids, therapeutic equipment & pressure care. 48-hour dispatch."
        jsonLd={[organizationSchema, localBusinessSchema, faqPageSchema]}
      />
      <Navigation />
      <main id="main-content">
        <HeroSection />
        
        <BrandTrustStrip />
        
        <Suspense fallback={<SectionFallback />}>
          <AnimatedSection delay={0.1}>
            <FeaturedProducts />
          </AnimatedSection>
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <AnimatedSection delay={0.1}>
            <ProductCategoryCards />
          </AnimatedSection>
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <AnimatedSection delay={0.1}>
            <AboutSection />
          </AnimatedSection>
        </Suspense>
        
        <Suspense fallback={null}>
          <FloatingSmartCTA />
        </Suspense>
        
        {/* Sleep Choice Program */}
        <Suspense fallback={<SectionFallback />}>
        <AnimatedSection>
          <section id="sleep-choice" className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Sleep Choice Program</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Take the guesswork out of bed and mattress selection with our risk-free 7-day trial program.
                </p>
                <div className="bg-card rounded-xl p-8 border border-border mb-8">
                  <h3 className="text-2xl font-semibold mb-4">How It Works</h3>
                  <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div>
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mb-3 font-bold">1</div>
                      <h4 className="font-semibold mb-2">Choose Your Solution</h4>
                      <p className="text-muted-foreground text-sm">Select from our range of therapeutic beds and pressure-relieving mattresses</p>
                    </div>
                    <div>
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mb-3 font-bold">2</div>
                      <h4 className="font-semibold mb-2">7-Day Trial</h4>
                      <p className="text-muted-foreground text-sm">Your client tries the equipment in their own environment for a full week</p>
                    </div>
                    <div>
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mb-3 font-bold">3</div>
                      <h4 className="font-semibold mb-2">Keep or Return</h4>
                      <p className="text-muted-foreground text-sm">If it's not the perfect fit, we'll arrange free collection and try something else</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                    asChild
                  >
                    <a href="https://sleepchoice.com.au" target="_blank" rel="noopener noreferrer">
                      Visit Sleep Choice Website
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    asChild
                  >
                    <a href="/sleep-choice">
                      Learn More
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
        </Suspense>

        {/* Testimonials */}
        <Suspense fallback={<SectionFallback />}>
        <AnimatedSection>
          <section id="testimonials" className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
                <p className="text-xl text-muted-foreground">Trusted by leading healthcare providers across Australia</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                  {
                    company: "Disability Support Provider",
                    quote: "Supply Ministry has transformed how we source assistive technology. Their quick dispatch program means our clients get what they need when they need it.",
                    role: "Operations Manager",
                    rating: 5
                  },
                  {
                    company: "Aged Care Facility",
                    quote: "The personal service and expert advice we receive from Supply Ministry is unmatched. They truly understand our clients' needs.",
                    role: "Occupational Therapist",
                    rating: 5
                  },
                  {
                    company: "Community Services Organization",
                    quote: "From mobility aids to home modifications, Supply Ministry consistently delivers quality products and exceptional service.",
                    role: "Support Coordinator",
                    rating: 5
                  }
                ].map((testimonial, index) => (
                  <AnimatedSection key={index} delay={index * 0.15}>
                    <div 
                      className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-orange-500 text-orange-500" />
                        ))}
                      </div>
                      <div className="relative">
                        <span className="absolute -top-2 -left-2 text-4xl text-primary/20 font-serif">"</span>
                        <p className="text-muted-foreground mb-4 italic relative z-10">{testimonial.quote}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="font-semibold text-foreground">{testimonial.company}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
        <AnimatedSection>
          <FAQSection />
        </AnimatedSection>
        </Suspense>


        <section id="contact" className="py-24 bg-gradient-to-br from-primary to-primary/85 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="container mx-auto px-4 text-center relative z-10">
            <p className="text-sm font-medium tracking-widest uppercase opacity-70 mb-4">Let's Talk</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">Ready to Get Started?</h2>
            <p className="text-lg mb-10 opacity-80 max-w-xl mx-auto leading-relaxed">
              Reach out to our team to discuss your assistive technology needs. We'll help find the perfect solutions for your clients.
            </p>
            <Link 
              to="/quote"
              className="inline-block bg-orange-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-orange-600 hover:scale-105 transition-all duration-200 shadow-lg shadow-orange-500/25 mb-14"
            >
              Request a Quote
            </Link>
            <div className="grid sm:grid-cols-2 gap-8 max-w-md mx-auto text-center">
              <div>
                <p className="font-bold text-xl mb-2">Alex</p>
                <a href="mailto:alex@supplyministry.com.au" className="block text-sm opacity-80 hover:opacity-100 transition-opacity mb-1">alex@supplyministry.com.au</a>
                <a href="tel:+61452002450" className="block text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">0452 002 450</a>
              </div>
              <div>
                <p className="font-bold text-xl mb-2">David</p>
                <a href="mailto:david@supplyministry.com.au" className="block text-sm opacity-80 hover:opacity-100 transition-opacity mb-1">david@supplyministry.com.au</a>
                <a href="tel:+61404593090" className="block text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">0404 593 090</a>
              </div>
            </div>
            <p className="text-xs opacity-40 mt-10 tracking-wide">Monday – Friday · 8:30 AM – 5:00 PM AEST</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
