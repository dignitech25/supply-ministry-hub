import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ShoppingCart } from "lucide-react";
import { useQuote } from "@/contexts/QuoteContext";

const BuildQuoteButton = () => {
  const { toggleDrawer, totalItems } = useQuote();
  
  return (
    <Button 
      onClick={toggleDrawer}
      className="bg-primary hover:bg-primary/90 text-primary-foreground relative"
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      Build a Quote
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Button>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        {/* Desktop Layout */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/a33417e9-34da-4d88-a5ac-bbd147fd89aa.png" 
              alt="Supply Ministry"
              className="h-[75px] w-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('hero')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </button>
              <a
                href="/products"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Products
              </a>
              <button 
                onClick={() => scrollToSection('partners')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Partners
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </button>
            </nav>
            <BuildQuoteButton />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="py-4">
              <nav className="flex flex-col space-y-4 pt-4 border-t">
                <button 
                  onClick={() => {
                    scrollToSection('hero');
                    setIsOpen(false);
                  }}
                  className="text-left text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => {
                    scrollToSection('about');
                    setIsOpen(false);
                  }}
                  className="text-left text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </button>
                <a
                  href="/products"
                  className="text-left text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Products
                </a>
                <button 
                  onClick={() => {
                    scrollToSection('partners');
                    setIsOpen(false);
                  }}
                  className="text-left text-muted-foreground hover:text-foreground transition-colors"
                >
                  Partners
                </button>
                <button 
                  onClick={() => {
                    scrollToSection('contact');
                    setIsOpen(false);
                  }}
                  className="text-left text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </button>
                <div className="pt-4">
                  <BuildQuoteButton />
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;