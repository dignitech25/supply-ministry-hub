import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        {/* Desktop Layout - 3 Column Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:items-center h-32">
          {/* Left Navigation */}
          <nav className="flex items-center justify-start space-x-3">
            <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium text-sm">Home</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium text-sm">About</a>
            <a href="#products" className="text-foreground hover:text-primary transition-colors font-medium text-sm">Products</a>
          </nav>

          {/* Centered Logo */}
          <div className="flex items-center justify-center">
            <div>
              <img 
                src="/lovable-uploads/b9a257b9-262f-44b7-ad6e-fad94615bfeb.png"
                alt="Supply Ministry - Connects Care With Solutions"
                className="h-28 w-auto object-contain"
                onError={(e) => {
                  console.log('Logo failed to load:', e.currentTarget.src);
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>

          {/* Right Navigation & CTA */}
          <div className="flex items-center justify-end space-x-4">
            <nav className="flex items-center space-x-3">
              <a href="#sleep-choice" className="text-foreground hover:text-primary transition-colors font-medium text-sm">Sleep Choice</a>
              <a href="#suppliers" className="text-foreground hover:text-primary transition-colors font-medium text-sm">Suppliers</a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-colors font-medium text-sm">Testimonials</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium text-sm">Contact</a>
            </nav>
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              onClick={() => document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Request a Quote
            </Button>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden flex items-center h-28">
          {/* Centered Logo on Mobile */}
          <div className="flex-1 flex items-center justify-center">
            <div>
              <img 
                src="/lovable-uploads/b9a257b9-262f-44b7-ad6e-fad94615bfeb.png" 
                alt="Supply Ministry - Connects Care With Solutions"
                className="h-24 w-auto object-contain"
                onError={(e) => {
                  console.log('Logo failed to load:', e.currentTarget.src);
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="absolute right-6 text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <nav className="py-6 space-y-6 px-2">
              <a href="#home" className="block text-foreground hover:text-primary transition-colors font-medium text-base py-2">Home</a>
              <a href="#about" className="block text-foreground hover:text-primary transition-colors font-medium text-base py-2">About</a>
              <a href="#products" className="block text-foreground hover:text-primary transition-colors font-medium text-base py-2">Products & Solutions</a>
              <a href="#sleep-choice" className="block text-foreground hover:text-primary transition-colors font-medium text-base py-2">Sleep Choice</a>
              <a href="#suppliers" className="block text-foreground hover:text-primary transition-colors font-medium text-base py-2">Suppliers</a>
              <a href="#testimonials" className="block text-foreground hover:text-primary transition-colors font-medium text-base py-2">Testimonials</a>
              <a href="#contact" className="block text-foreground hover:text-primary transition-colors font-medium text-base py-2">Contact</a>
              <div className="pt-6 border-t border-border">
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