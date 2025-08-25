import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/8b8891df-f694-415b-acab-b469a45766cb.png" 
              alt="Supply Ministry Logo" 
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">Supply Ministry</h1>
              <p className="text-xs text-muted-foreground">Connects Care With Solutions</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <a href="#home" className="text-muted-foreground hover:text-primary transition-colors font-medium">Home</a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors font-medium">About</a>
            <a href="#products" className="text-muted-foreground hover:text-primary transition-colors font-medium">Products & Solutions</a>
            <a href="#quick-ship" className="text-muted-foreground hover:text-primary transition-colors font-medium">Quick Ship & Promotions</a>
            <a href="#sleep-choice" className="text-muted-foreground hover:text-primary transition-colors font-medium">Sleep Choice</a>
            <a href="#suppliers" className="text-muted-foreground hover:text-primary transition-colors font-medium">Suppliers</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors font-medium">Testimonials</a>
            <a href="#quote-form" className="text-muted-foreground hover:text-primary transition-colors font-medium">Request a Quote</a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors font-medium">Contact</a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center text-muted-foreground">
              <Phone className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">1300 786 711</span>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Request a Quote
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-border">
            <nav className="py-4 space-y-4">
              <a href="#home" className="block text-muted-foreground hover:text-primary transition-colors font-medium">Home</a>
              <a href="#about" className="block text-muted-foreground hover:text-primary transition-colors font-medium">About</a>
              <a href="#products" className="block text-muted-foreground hover:text-primary transition-colors font-medium">Products & Solutions</a>
              <a href="#quick-ship" className="block text-muted-foreground hover:text-primary transition-colors font-medium">Quick Ship & Promotions</a>
              <a href="#sleep-choice" className="block text-muted-foreground hover:text-primary transition-colors font-medium">Sleep Choice</a>
              <a href="#suppliers" className="block text-muted-foreground hover:text-primary transition-colors font-medium">Suppliers</a>
              <a href="#testimonials" className="block text-muted-foreground hover:text-primary transition-colors font-medium">Testimonials</a>
              <a href="#quote-form" className="block text-muted-foreground hover:text-primary transition-colors font-medium">Request a Quote</a>
              <a href="#contact" className="block text-muted-foreground hover:text-primary transition-colors font-medium">Contact</a>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center text-muted-foreground mb-3">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">1300 786 711</span>
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => {
                    setIsOpen(false);
                    document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Request a Quote
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;