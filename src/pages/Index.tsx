import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ProductCategories from "@/components/ProductCategories";
import AboutSection from "@/components/AboutSection";
import QuoteForm from "@/components/QuoteForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ProductCategories />
      <AboutSection />
      
      {/* Quote Form Section */}
      <section id="quote-form" className="py-20 bg-soft-gray">
        <div className="container mx-auto px-4">
          <QuoteForm />
        </div>
      </section>
      
      {/* Quick Ship Program */}
      <section id="quick-ship" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Quick Ship Program</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Need it fast? Our Quick Ship items are dispatched within 48 hours, 
            ensuring your clients get their equipment when they need it most.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">48</span>
              </div>
              <h3 className="font-semibold mb-2">Hour Dispatch</h3>
              <p className="text-muted-foreground text-sm">Orders placed by 2PM ship same day</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">200+</span>
              </div>
              <h3 className="font-semibold mb-2">Available Products</h3>
              <p className="text-muted-foreground text-sm">Most popular items in stock</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">✓</span>
              </div>
              <h3 className="font-semibold mb-2">Same Price</h3>
              <p className="text-muted-foreground text-sm">No rush charges or hidden fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sleep Choice Program */}
      <section id="sleep-choice" className="py-20 bg-soft-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Sleep Choice Program</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Take the guesswork out of bed and mattress selection with our risk-free 7-day trial program.
            </p>
            <div className="bg-card rounded-xl p-8 border border-border">
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
          </div>
        </div>
      </section>

      {/* Suppliers Section */}
      <section id="suppliers" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Trusted Supplier Partners</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            We've built strong relationships with Australia's leading assistive technology manufacturers 
            to bring you competitive pricing and reliable supply chains.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center max-w-4xl mx-auto">
            {['Novis', 'Avante', 'Aidacare', 'Forté Healthcare', 'icare Medical Group'].map((supplier, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-foreground">{supplier}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-soft-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground">Trusted by leading healthcare providers across Australia</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                company: "Si Care Solutions",
                quote: "Supply Ministry has transformed how we source assistive technology. Their quick dispatch program means our clients get what they need when they need it.",
                role: "Operations Manager"
              },
              {
                company: "Jewish Care",
                quote: "The personal service and expert advice we receive from Supply Ministry is unmatched. They truly understand our clients' needs.",
                role: "Occupational Therapist"
              },
              {
                company: "Renew Living",
                quote: "From mobility aids to home modifications, Supply Ministry consistently delivers quality products and exceptional service.",
                role: "Support Coordinator"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border">
                <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.company}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Contact our experienced team today to discuss your assistive technology needs. 
            We're here to help you find the perfect solutions for your clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-background/90 transition-colors">
              Request a Quote
            </button>
            <button className="border border-primary-foreground text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors">
              Call 1300 786 711
            </button>
          </div>
          <div className="text-sm opacity-75">
            <p>Email: enquiries@supplyministry.com.au</p>
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
              <p className="text-sm opacity-80">ABN: [Your ABN Here]</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#about" className="hover:opacity-100">About Us</a></li>
                <li><a href="#products" className="hover:opacity-100">Products</a></li>
                <li><a href="#quick-ship" className="hover:opacity-100">Quick Ship</a></li>
                <li><a href="#sleep-choice" className="hover:opacity-100">Sleep Choice</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Resource Library</a></li>
                <li><a href="#" className="hover:opacity-100">Supply Line Blog</a></li>
                <li><a href="#" className="hover:opacity-100">FAQ</a></li>
                <li><a href="#" className="hover:opacity-100">NDIS Information</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Phone: 1300 786 711</li>
                <li>Email: enquiries@supplyministry.com.au</li>
                <li>Mon-Fri: 8:30 AM - 5:00 PM AEST</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm opacity-60">
            <p>&copy; 2024 Supply Ministry. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;