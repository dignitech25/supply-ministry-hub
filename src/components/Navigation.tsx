import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        {/* Desktop Horizontal Navigation */}
        <div className="hidden lg:flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/a33417e9-34da-4d88-a5ac-bbd147fd89aa.png" 
              alt="Supply Ministry - Connects Care With Solutions"
              className="h-[75px] w-auto object-contain"
              onError={(e) => {
                console.log('Logo failed to load:', e.currentTarget.src);
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-6">
            <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium text-sm">Home</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium text-sm">About</a>
            <a href="#products" className="text-foreground hover:text-primary transition-colors font-medium text-sm">Products & Solutions</a>
            <a href="#quick-ship" className="text-foreground hover:text-primary transition-colors font-medium text-sm">Quick Ship & Promotions</a>
            <a href="/sleep-choice" className="text-foreground hover:text-primary transition-colors font-medium text-sm">Sleep Choice</a>
            <a href="#suppliers" className="text-foreground hover:text-primary transition-colors font-medium text-sm">Suppliers</a>
            <a href="#testimonials" className="text-foreground hover:text-primary transition-colors font-medium text-sm">Testimonials</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium text-sm">Contact</a>
          </nav>

          {/* Desktop CTA */}
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            onClick={() => document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Request a Quote
          </Button>
        </div>

        {/* Mobile Layout - Hamburger Menu */}
        <div className="lg:hidden flex items-center h-20">
          {/* Centered Logo on Mobile */}
          <div className="flex-1 flex items-center justify-center">
            <div>
                <img 
                  src="/lovable-uploads/a33417e9-34da-4d88-a5ac-bbd147fd89aa.png" 
                  alt="Supply Ministry - Connects Care With Solutions"
                  className="h-[68px] w-auto object-contain"
                onError={(e) => {
                  console.log('Logo failed to load:', e.currentTarget.src);
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="absolute right-6 text-foreground p-2 lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 border-t border-border bg-background/95 backdrop-blur-sm shadow-lg z-40">
            <nav className="py-4 px-6">
              <div className="space-y-1">
                <a 
                  href="#home" 
                  className="block text-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium text-base py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="#about" 
                  className="block text-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium text-base py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </a>
                <a 
                  href="#products" 
                  className="block text-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium text-base py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Products & Solutions
                </a>
                <a 
                  href="#quick-ship" 
                  className="block text-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium text-base py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Quick Ship & Promotions
                </a>
                <a 
                  href="/sleep-choice" 
                  className="block text-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium text-base py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Sleep Choice
                </a>
                <a 
                  href="#suppliers" 
                  className="block text-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium text-base py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Suppliers
                </a>
                <a 
                  href="#testimonials" 
                  className="block text-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium text-base py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Testimonials
                </a>
                <a 
                  href="#contact" 
                  className="block text-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium text-base py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </a>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Button 
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
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