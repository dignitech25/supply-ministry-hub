import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";
import { useQuote } from "@/contexts/QuoteContext";
import { SearchDialog } from "./SearchDialog";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { toggleDrawer, totalItems } = useQuote();

  return (
    <>
      {/* Promotional Ribbon */}
      <div className="bg-primary text-primary-foreground sticky top-0 z-50 py-2 text-center font-semibold text-sm shadow-md">
        We will beat any quote by 5%
      </div>
      
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6">
          {/* Desktop Layout */}
          <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/a33417e9-34da-4d88-a5ac-bbd147fd89aa.png" 
              alt="Supply Ministry"
              className="h-[75px] w-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </Link>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="h-5 w-5" />
            </Button>
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

          {/* Mobile Icons + Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="h-5 w-5" />
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
            <button
              className="text-foreground p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="py-4">
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/account"
                  className="text-left text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Account
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
      </header>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default Navigation;