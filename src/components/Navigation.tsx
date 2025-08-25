import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        {/* Desktop Layout - 3 Column Grid */}
        <div className="hidden md:grid md:grid-cols-3 md:items-center h-32">
          {/* Left Navigation */}
          <nav className="flex items-center justify-start space-x-3">
            <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium text-xs">Home</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium text-xs">About</a>
            <a href="#products" className="text-foreground hover:text-primary transition-colors font-medium text-xs">Products</a>
            <a href="#quick-ship" className="text-foreground hover:text-primary transition-colors font-medium text-xs">Quick Ship</a>
          </nav>

          {/* Centered Logo - MASSIVE SIZE */}
          <div className="flex items-center justify-center">
            <div className="bg-white/10 rounded-lg p-3 shadow-md">
              <img 
                src="/lovable-uploads/3275b48c-3032-4c7a-acc5-22d9564590c2.png" 
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
            <nav className="flex items-center space-x-4">
              <a href="#sleep-choice" className="text-foreground hover:text-primary transition-colors font-medium text-xs">Sleep Choice</a>
              <a href="#suppliers" className="text-foreground hover:text-primary transition-colors font-medium text-xs">Suppliers</a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-colors font-medium text-xs">Testimonials</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium text-xs">Contact</a>
            </nav>
            <div className="flex items-center text-foreground bg-muted/30 rounded-full px-4 py-2">
              <Phone className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-semibold">1300 786 711</span>
            </div>
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
        <div className="md:hidden flex items-center h-28">
          {/* Centered Logo on Mobile - MASSIVE SIZE */}
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white/10 rounded-lg p-3 shadow-md">
              <img 
                src="/lovable-uploads/3275b48c-3032-4c7a-acc5-22d9564590c2.png" 
                alt="Supply Ministry - Connects Care With Solutions" 
                className="h-22 w-auto object-contain"
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
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <nav className="py-6 space-y-6 px-2">
              <a href="#home" className="block text-foreground hover:text-primary transition-colors font-medium text-base py-2">Home</a>
              <a href="#about" className="block text-foreground hover:text-primary transition-colors font-medium text-base py-2">About</a>
              <a href="#products" className="block text-foreground hover:text-primary transition-colors font-medium text-base py-2">Products & Solutions</a>
              <a href="#quick-ship" className="block text-foreground hover:text-primary transition-colors font-medium text-base py-2">Quick Ship</a>
              <a href="#sleep-choice" className="block text-foreground hover:text-primary transition-colors font-medium text-base py-2">Sleep Choice</a>
              <a href="#suppliers" className="block text-foreground hover:text-primary transition-colors font-medium text-base py-2">Suppliers</a>
              <a href="#testimonials" className="block text-foreground hover:text-primary transition-colors font-medium text-base py-2">Testimonials</a>
              <a href="#contact" className="block text-foreground hover:text-primary transition-colors font-medium text-base py-2">Contact</a>
              <div className="pt-6 border-t border-border">
                <div className="flex items-center text-foreground bg-muted/30 rounded-full px-4 py-3 mb-4">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-semibold">1300 786 711</span>
                </div>
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