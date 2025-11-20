import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, ShoppingCart } from "lucide-react";
import { useQuote } from "@/contexts/QuoteContext";
import { InlineSearch } from "./InlineSearch";
import { CategoryNavigation } from "./CategoryNavigation";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleDrawer, totalItems } = useQuote();

  return (
    <>
      {/* Promotional Ribbon */}
      <div className="bg-primary text-primary-foreground sticky top-0 z-50 py-2 text-center font-semibold text-sm shadow-md">
        We will beat any quote by 5%
      </div>
      
      {/* Search-Centric Header */}
      <header className="bg-background border-b border-border sticky top-[36px] z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 mx-auto md:mx-0 hover:opacity-80 transition-opacity">
              <img 
                src="/Supply_Ministry.svg?v=3" 
                alt="Supply Ministry"
                className="h-[40px] sm:h-[45px] md:h-[55px] lg:h-[65px] w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </Link>

            {/* Prominent Search Bar */}
            <div className="flex-1 max-w-2xl mx-auto w-full">
              <InlineSearch />
            </div>

            {/* Utility Icons */}
            <div className="flex items-center gap-2 justify-center md:justify-end flex-shrink-0">
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
      <nav className="bg-background border-b border-border sticky top-[120px] z-30 shadow-sm">
        <div className="container mx-auto">
          <div className="py-3">
            <CategoryNavigation />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;