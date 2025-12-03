import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { CategoryNavigation } from "./CategoryNavigation";
import { SearchDialog } from "./SearchDialog";
import { Button } from "./ui/button";

const Navigation = () => {
  const [searchOpen, setSearchOpen] = useState(false);

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
            {/* Spacer for balance */}
            <div className="w-10" />
            
            {/* Logo - Centered */}
            <Link 
              to="/" 
              className="flex items-center hover:opacity-80 transition-opacity"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img 
                src="/Supply_Ministry_horizontal_no_phrase_updatedA-4.svg" 
                alt="Supply Ministry" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </Link>
            
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </Button>
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