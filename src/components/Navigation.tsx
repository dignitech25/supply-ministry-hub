import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, ShoppingCart } from "lucide-react";
import { useQuote } from "@/contexts/QuoteContext";
import { CategoryNavigation } from "./CategoryNavigation";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleDrawer, totalItems } = useQuote();

  return (
    <>
      {/* Promotional Ribbon */}
      <div className="bg-primary text-primary-foreground sticky top-0 z-50 py-0 text-center font-semibold text-[11px] shadow-md">
        We will beat any quote by 5%
      </div>
      
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-[20px] z-40">
        <div className="container mx-auto px-2 py-1 md:px-6 md:py-0">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col items-center gap-1">
            {/* Logo - Full width on mobile */}
            <Link to="/" className="hover:opacity-80 transition-opacity w-full flex justify-center">
              <img 
                src="/Supply_Ministry_horizontal_no_phrase_updatedA-4.svg" 
                alt="Supply Ministry"
                className="w-[85%] h-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </Link>
            
            {/* Utility Icons - Below logo on mobile */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link to="/account">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleDrawer}
                className="text-muted-foreground hover:text-foreground relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid grid-cols-3 items-center gap-2">
            {/* Left spacer */}
            <div></div>
            
            {/* Logo - Centered */}
            <Link to="/" className="flex justify-center hover:opacity-80 transition-opacity">
              <img 
                src="/Supply_Ministry_horizontal_no_phrase_updatedA-4.svg" 
                alt="Supply Ministry"
                className="w-[380px] lg:w-[420px] h-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </Link>

            {/* Utility Icons - Right */}
            <div className="flex items-center gap-2 justify-end">
              <Button 
                variant="ghost" 
                size="icon"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link to="/account">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleDrawer}
                className="text-muted-foreground hover:text-foreground relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Category Navigation */}
      <nav className="bg-background border-b border-border sticky top-[107px] md:top-[144px] lg:top-[160px] z-40 shadow-sm">
        <div className="container mx-auto">
          <div className="py-0">
            <CategoryNavigation />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;