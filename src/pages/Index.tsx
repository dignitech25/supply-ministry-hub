import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import EditorialNavigation from "@/components/editorial/EditorialNavigation";
import EditorialHero from "@/components/editorial/EditorialHero";
import SupplierStrip from "@/components/editorial/SupplierStrip";
import TrustBar from "@/components/editorial/TrustBar";
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
    <div className="min-h-screen bg-violet text-cream">
      <SEO 
        title="Assistive Technology & Mobility Aids | Supply Ministry"
        description="Australia's trusted assistive technology provider. Mobility aids, therapeutic equipment and pressure care. 48-hour quote turnaround."
        jsonLd={[organizationSchema, localBusinessSchema, faqPageSchema]}
      />
      <EditorialNavigation />
      <main id="main-content">
        <EditorialHero />
        <SupplierStrip />
        <TrustBar />
        
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
          <section id="sleep-choice" className="py-20 bg-cream text-ink">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <p className="font-geist text-[11px] tracking-[0.18em] uppercase text-muted-body mb-4">Trial Program</p>
                <h2 className="font-geist font-light tracking-tight leading-[1.05] text-5xl md:text-6xl text-ink mb-6">Sleep <span className="italic text-gold">Choice</span></h2>
                <p className="text-lg text-muted-body mb-8 max-w-2xl mx-auto">
                  Take the guesswork out of bed and mattress selection with our risk-free 7-day trial program.
                </p>
                <div className="bg-cream-alt rounded-xl p-8 border border-cream-border mb-8">
                  <h3 className="font-geist font-light tracking-tight leading-[1.05] text-2xl text-ink mb-6">How It Works</h3>
                  <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div>
                      <div className="bg-ink text-cream rounded-full w-8 h-8 flex items-center justify-center mb-3 font-medium">1</div>
                      <h4 className="font-geist text-lg text-ink mb-2">Choose Your Solution</h4>
                      <p className="text-muted-body text-sm">Select from our range of therapeutic beds and pressure-relieving mattresses</p>
                    </div>
                    <div>
                      <div className="bg-ink text-cream rounded-full w-8 h-8 flex items-center justify-center mb-3 font-medium">2</div>
                      <h4 className="font-geist text-lg text-ink mb-2">7-Day Trial</h4>
                      <p className="text-muted-body text-sm">Your client tries the equipment in their own environment for a full week</p>
                    </div>
                    <div>
                      <div className="bg-ink text-cream rounded-full w-8 h-8 flex items-center justify-center mb-3 font-medium">3</div>
                      <h4 className="font-geist text-lg text-ink mb-2">Keep or Return</h4>
                      <p className="text-muted-body text-sm">If it's not the perfect fit, we'll arrange free collection and try something else</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-ink text-cream hover:opacity-90 rounded-full"
                    asChild
                  >
                    <a href="https://sleepchoice.com.au" target="_blank" rel="noopener noreferrer">
                      Visit Sleep Choice Website
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border border-ink/20 text-ink hover:bg-ink hover:text-cream rounded-full"
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
          <section id="testimonials" className="py-20 bg-violet text-cream">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <p className="font-geist text-[11px] tracking-[0.18em] uppercase text-cream/60 mb-4">Testimonials</p>
                <h2 className="font-geist font-light tracking-tight leading-[1.05] text-5xl md:text-6xl text-cream mb-4">What our clients <span className="italic text-gold">say</span></h2>
                <p className="text-lg text-cream/75">Trusted by leading healthcare providers across Australia</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                  {
                    company: "Disability Support Provider",
                    quote: "Supply Ministry has transformed how we source assistive technology. Their fast quote turnaround means our clients get sorted without the usual procurement delays.",
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
                      className="bg-cream rounded-xl p-6 border border-cream-border hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                        ))}
                      </div>
                      <div className="relative">
                        <span className="absolute -top-2 -left-2 text-5xl text-gold/30 font-geist">"</span>
                        <p className="text-muted-body mb-4 italic relative z-10 leading-relaxed">{testimonial.quote}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-cream-border">
                        <p className="font-geist text-ink">{testimonial.company}</p>
                        <p className="text-sm text-muted-body">{testimonial.role}</p>
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


        <section id="contact" className="py-24 bg-violet text-cream relative overflow-hidden border-t border-white/10">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="container mx-auto px-4 text-center relative z-10">
            <p className="font-geist text-[11px] tracking-[0.18em] uppercase text-cream/60 mb-4">Let's Talk</p>
            <h2 className="font-geist font-light tracking-tight leading-[1.05] text-5xl md:text-6xl mb-5">Ready to get <span className="italic text-gold">started</span>?</h2>
            <p className="text-lg mb-10 text-cream/75 max-w-xl mx-auto leading-relaxed">
              Reach out to our team to discuss your assistive technology needs. We'll help find the perfect solutions for your clients.
            </p>
            <Link 
              to="/quote"
              className="inline-block bg-cream text-violet px-10 py-4 rounded-full font-medium text-lg hover:opacity-90 transition-all duration-200 mb-14"
            >
              Request a Quote
            </Link>
            <div className="grid sm:grid-cols-2 gap-8 max-w-md mx-auto text-center">
              <div>
                <p className="font-geist text-xl mb-2">Alex</p>
                <a href="mailto:alex@supplyministry.com.au" className="block text-sm text-cream/70 hover:text-cream transition-colors mb-1">alex@supplyministry.com.au</a>
                <a href="tel:+61452002450" className="block text-2xl font-geist tracking-tight hover:text-gold transition-colors">0452 002 450</a>
              </div>
              <div>
                <p className="font-geist text-xl mb-2">David</p>
                <a href="mailto:david@supplyministry.com.au" className="block text-sm text-cream/70 hover:text-cream transition-colors mb-1">david@supplyministry.com.au</a>
                <a href="tel:+61404593090" className="block text-2xl font-geist tracking-tight hover:text-gold transition-colors">0404 593 090</a>
              </div>
            </div>
            <p className="text-xs text-cream/50 mt-10 tracking-wide">Monday – Friday · 8:30 AM – 5:00 PM AEST</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
