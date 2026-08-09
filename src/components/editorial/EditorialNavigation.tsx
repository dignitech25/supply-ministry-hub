import { Link } from "react-router-dom";
import { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { useQuote } from "@/contexts/QuoteContext";
import { SearchDialog } from "@/components/SearchDialog";
import ProductSearch from "@/components/ProductSearch";

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Suppliers", href: "/#suppliers" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const EditorialNavigation = () => {
  const { totalItems, toggleDrawer } = useQuote();
  const [searchOpen, setSearchOpen] = useState(false);
  const showCart = totalItems > 0;

  return (
    <nav className="bg-cream border-b border-violet/10 h-16 md:h-20 sticky top-0 z-50">
      <div className="h-full px-4 md:px-12 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center shrink-0 min-w-0">
          <img
            src="/Supply_Ministry_logo_new_cropped.png"
            alt="Supply Ministry: Connects Care With Solutions"
            className="h-7 sm:h-9 md:h-12 w-auto"
          />
        </Link>

        {/*
          Search was previously an icon, and only on /products -- so there was no
          way to search from the homepage at all. It is now a persistent field on
          every route, because finding a known product is the main journey.

          The field takes priority over the marketing links at md, which is why
          those move to lg. Below md there is no room for both, so search falls
          back to a one-tap dialog.
        */}
        <div className="hidden md:block flex-1 max-w-sm mx-4">
          <ProductSearch source="header" />
        </div>

        <div className="hidden lg:flex items-center gap-8 shrink-0">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-geist text-base font-medium text-violet/70 hover:text-violet transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search products"
            className="md:hidden p-2 rounded-full text-violet/70 hover:text-violet hover:bg-violet/5 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
          {showCart && (
            <button
              type="button"
              onClick={toggleDrawer}
              aria-label={`Open quote cart (${totalItems} item${totalItems === 1 ? "" : "s"})`}
              className="relative p-2 rounded-full text-violet/70 hover:text-violet hover:bg-violet/5 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-cream text-[10px] font-semibold flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            </button>
          )}
          <Link
            to="/quote"
            className="font-geist text-sm md:text-base font-semibold bg-violet text-cream px-4 py-2 md:px-7 md:py-3 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <span className="md:hidden">Get quote</span>
            <span className="hidden md:inline">Talk to us</span>
          </Link>
        </div>
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </nav>
  );
};

export default EditorialNavigation;
