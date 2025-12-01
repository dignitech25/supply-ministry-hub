import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useQuote } from "@/contexts/QuoteContext";
import { CategoryNavigation } from "./CategoryNavigation";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleDrawer, totalItems } = useQuote();

  return (
    <div className="sticky top-0 z-50 bg-background">
      {/* Promotional Ribbon */}
      <div className="bg-primary text-primary-foreground py-0 text-center font-semibold text-[11px] shadow-md">
        We will beat any quote by 5%
      </div>
      
      {/* Header */}
      <header className="w-full border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 lg:py-5">
            
            {/* Logo */}
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src="/Supply_Ministry_horizontal_no_phrase_updatedA-4.svg" 
                alt="Supply Ministry" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </Link>

            {/* Nav Menu */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-foreground">
              <Link to="/products" className="hover:text-primary transition">Products</Link>
              <Link to="/sleep-choice" className="hover:text-primary transition">Sleep Choice</Link>
              <Link to="/resources" className="hover:text-primary transition">Resources</Link>
              <Link to="/contact" className="hover:text-primary transition">Contact</Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleDrawer}
                className="relative p-2 hover:text-primary transition"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {totalItems}
                  </span>
                )}
              </button>

              <Link 
                to="/quote-confirm"
                className="hidden md:inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition"
              >
                Request a Quote
              </Link>

              {/* Mobile menu toggle */}
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden flex items-center justify-center h-10 w-10"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col space-y-4">
                <Link to="/products" className="text-foreground hover:text-primary transition" onClick={() => setIsOpen(false)}>Products</Link>
                <Link to="/sleep-choice" className="text-foreground hover:text-primary transition" onClick={() => setIsOpen(false)}>Sleep Choice</Link>
                <Link to="/resources" className="text-foreground hover:text-primary transition" onClick={() => setIsOpen(false)}>Resources</Link>
                <Link to="/contact" className="text-foreground hover:text-primary transition" onClick={() => setIsOpen(false)}>Contact</Link>
                <Link 
                  to="/quote-confirm"
                  className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Request a Quote
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Category Navigation Bar */}
      <nav className="bg-background border-b border-border shadow-sm">
        <div className="container mx-auto">
          <div className="py-0">
            <CategoryNavigation />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;