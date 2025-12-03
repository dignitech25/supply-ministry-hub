import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import BrandTrustStrip from "@/components/BrandTrustStrip";
import FeaturedProducts from "@/components/FeaturedProducts";
import ProductCategoryCards from "@/components/ProductCategoryCards";
import AboutSection from "@/components/AboutSection";
import FloatingQuoteButton from "@/components/FloatingQuoteButton";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <BrandTrustStrip />
      <FeaturedProducts />
      <ProductCategoryCards />
      <AboutSection />
      <FloatingQuoteButton />
      
      {/* Sleep Choice Program - with CTA to external site */}
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

      {/* Testimonials */}
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
              <div 
                key={index} 
                className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                
                {/* Quote with decorative marks */}
                <div className="relative">
                  <span className="absolute -top-2 -left-2 text-4xl text-primary/20 font-serif">"</span>
                  <p className="text-muted-foreground mb-4 italic relative z-10">{testimonial.quote}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="font-semibold text-foreground">{testimonial.company}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Single Bottom CTA */}
      <section id="contact" className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Contact our experienced team today to discuss your assistive technology needs. 
            We're here to help you find the perfect solutions for your clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              to="/quote"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Request a Quote
            </Link>
          </div>
          <div className="text-sm opacity-75 space-y-2">
            <p><strong>Alex:</strong> alex@supplyministry.com.au | 0452 002 450</p>
            <p><strong>David:</strong> david@supplyministry.com.au | 0404 593 090</p>
            <p>Business Hours: Monday - Friday, 8:30 AM - 5:00 PM AEST</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Supply Ministry</h3>
              <p className="text-sm opacity-80 mb-4">Connecting care with solutions across Australia</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#about" className="hover:opacity-100">About Us</a></li>
                <li><a href="/products" className="hover:opacity-100">Products</a></li>
                <li><a href="#sleep-choice" className="hover:opacity-100">Sleep Choice</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="/resources" className="hover:opacity-100">Resource Library</a></li>
                <li><a href="/resources#blog" className="hover:opacity-100">Supply Line Blog</a></li>
                <li><a href="/resources#faq" className="hover:opacity-100">FAQ</a></li>
                <li><a href="/resources#ndis" className="hover:opacity-100">NDIS Information</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><strong>Alex:</strong> alex@supplyministry.com.au</li>
                <li>Mobile: 0452 002 450</li>
                <li><strong>David:</strong> david@supplyministry.com.au</li>
                <li>Mobile: 0404 593 090</li>
                <li>Mon-Fri: 8:30 AM - 5:00 PM AEST</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm opacity-60">
            <p>&copy; 2024 Supply Ministry. All rights reserved. | <a href="/terms" className="hover:opacity-100">Terms & Conditions</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;