import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Sparkles } from "lucide-react";
import { CategoryNavigation } from "./CategoryNavigation";
import { SearchDialog } from "./SearchDialog";
import { Button } from "./ui/button";
import { useQuote } from "@/contexts/QuoteContext";
import { Badge } from "./ui/badge";

const Navigation = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, setDrawerOpen } = useQuote();

  return (
    <div className="sticky top-0 z-50 bg-background">
      {/* Promotional Ribbon */}
      <div className="bg-primary text-primary-foreground py-2.5 text-center font-bold text-sm tracking-wide shadow-lg">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4 animate-sparkle" />
          We will beat any quote by 5%
          <Sparkles className="h-4 w-4 animate-sparkle" />
        </span>
      </div>
      
      {/* Header */}
      <header className="w-full border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 lg:py-5">
            {/* Spacer for balance */}
            <div className="w-10 shrink-0" />
            
            {/* Logo - Centered */}
            <Link 
              to="/" 
              className="flex items-center justify-center hover:opacity-80 transition-opacity min-w-0"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img 
                src="/Supply_Ministry_logo.png" 
                alt="Supply Ministry" 
                className="h-12 sm:h-16 md:h-20 w-auto max-w-[70vw] sm:max-w-none object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </Link>
            
            {/* Search & Cart Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Search products"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDrawerOpen(true)}
                className="text-muted-foreground hover:text-foreground relative"
                aria-label="View quote cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
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

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
};

export default Navigation;