import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, ExternalLink } from "lucide-react";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import EditorialNavigation from "@/components/editorial/EditorialNavigation";

const SleepChoice = () => {
  return (
    <div className="min-h-screen bg-violet text-cream">
      <SEO 
        title="Sleep Choice Program | 7-Day Risk-Free Bed Trial"
        description="Try before you buy with Sleep Choice's 7-day risk-free trial program. Therapeutic beds and pressure-relieving mattresses for aged care and NDIS clients."
      />
      <EditorialNavigation />
      
      {/* Hero Section */}
      <section className="relative bg-violet text-cream py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <img 
                src="/lovable-uploads/3203fff7-35d5-4c26-814d-17666d297a02.png"
                alt="Sleep Choice - Try Sleep Decide" 
                className="h-20 mx-auto mb-6"
              />
            </div>
            
            <p className="font-geist text-[11px] tracking-[0.18em] uppercase text-cream/60 mb-4">Sleep Choice Program</p>
            <h1 className="text-4xl lg:text-6xl font-geist font-light tracking-tight leading-[1.05] text-cream mb-6 leading-[1.1]">
              Sleep that <span className="italic text-gold">restores</span>.
            </h1>
            
            <p className="text-xl text-cream/75 mb-8 leading-relaxed max-w-3xl mx-auto">
              Take the guesswork out of bed and mattress selection with our risk-free 7-day trial program. 
              Find the perfect sleep solution for your clients with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-cream text-violet hover:opacity-90 transition-opacity text-base px-8 rounded-full"
                asChild
              >
                <a href="https://sleepchoice.com.au" target="_blank" rel="noopener noreferrer">
                  Visit Sleep Choice Website
                  <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base px-8 rounded-full border-cream/30 text-cream hover:bg-cream/10"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-cream text-ink">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-geist font-light tracking-tight leading-[1.05] text-ink text-center mb-12">Risk-free 7-day trial</h2>
            
            <div className="bg-cream-alt rounded-xl p-8 border border-cream-border mb-12">
              <h3 className="text-2xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-6 text-center">How it works</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-ink text-cream rounded-full w-12 h-12 flex items-center justify-center mb-4 font-medium text-xl mx-auto">1</div>
                  <h4 className="font-medium text-ink mb-3">Choose your solution</h4>
                  <p className="text-muted-body">Select from our range of therapeutic beds and pressure-relieving mattresses designed for comfort and support</p>
                </div>
                <div className="text-center">
                  <div className="bg-ink text-cream rounded-full w-12 h-12 flex items-center justify-center mb-4 font-medium text-xl mx-auto">2</div>
                  <h4 className="font-medium text-ink mb-3">7-day trial</h4>
                  <p className="text-muted-body">Your client tries the equipment in their own environment for a full week to ensure it meets their needs</p>
                </div>
                <div className="text-center">
                  <div className="bg-ink text-cream rounded-full w-12 h-12 flex items-center justify-center mb-4 font-medium text-xl mx-auto">3</div>
                  <h4 className="font-medium text-ink mb-3">Keep or return</h4>
                  <p className="text-muted-body">If it's not the perfect fit, we'll arrange free collection and help you find an alternative solution</p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-6">Why choose Sleep Choice?</h3>
                <div className="space-y-4">
                  {[
                    "Risk-free 7-day trial period",
                    "No upfront commitment required",
                    "Free delivery and collection",
                    "Expert guidance from our team",
                    "Wide range of therapeutic options",
                    "Trusted by healthcare professionals"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                      <span className="text-muted-body">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-cream-alt border border-cream-border rounded-xl p-6">
                <h3 className="text-xl font-geist font-light tracking-tight leading-[1.05] text-ink mb-4">Perfect for:</h3>
                <ul className="space-y-3 text-muted-body">
                  <li>• Aged care facilities</li>
                  <li>• Disability support providers</li>
                  <li>• Healthcare professionals</li>
                  <li>• Private clients</li>
                  <li>• Occupational therapists</li>
                  <li>• Case managers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-violet text-cream border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-geist font-light tracking-tight leading-[1.05] mb-6">Ready to try Sleep Choice?</h2>
          <p className="text-lg mb-8 text-cream/80 max-w-2xl mx-auto">
            Visit our Sleep Choice website to explore our full range of therapeutic sleep solutions 
            and start your risk-free 7-day trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-cream text-violet hover:opacity-90 transition-opacity rounded-full px-8"
              asChild
            >
              <a href="https://sleepchoice.com.au" target="_blank" rel="noopener noreferrer">
                Visit Sleep Choice Website
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SleepChoice;