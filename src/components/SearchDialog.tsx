import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, getImagePlaceholder } from "@/utils/productHelpers";

interface SearchResult {
  sku: string;
  title: string;
  brand: string | null;
  image_url: string | null;
  price_rrp: number | null;
  product_type: string | null;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const searchProducts = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products_categorized")
        .select("sku, title, brand, image_url, price_rrp, product_type")
        .or(`title.ilike.%${query}%,sku.ilike.%${query}%,brand.ilike.%${query}%`)
        .limit(8);

      if (error) throw error;
      setResults(data || []);
      setSelectedIndex(-1);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchProducts]);

  const handleResultClick = (sku: string) => {
    navigate(`/products/${sku}`);
    onOpenChange(false);
    setSearchQuery("");
    setResults([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = results.length + (searchQuery.trim().length >= 2 ? 1 : 0);
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      if (selectedIndex < results.length) {
        handleResultClick(results[selectedIndex].sku);
      } else if (selectedIndex === results.length) {
        handleSearch(e as unknown as React.FormEvent);
      }
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      onOpenChange(false);
      setSearchQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  };

  const handleClose = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setSearchQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by product name, SKU, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-10"
              autoFocus
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
            )}
          </div>
        </form>

        {/* Results List */}
        {results.length > 0 && (
          <div ref={resultsRef} className="border-t border-border max-h-[400px] overflow-y-auto">
            {results.map((product, index) => (
              <button
                key={product.sku}
                onClick={() => handleResultClick(product.sku)}
                className={`w-full flex items-center gap-3 p-3 transition-colors text-left border-b border-border last:border-b-0 ${
                  selectedIndex === index ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                <img
                  src={product.image_url || getImagePlaceholder()}
                  alt={product.title || "Product"}
                  className="w-12 h-12 object-contain rounded bg-muted flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = getImagePlaceholder();
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {product.brand} • {product.sku}
                  </p>
                </div>
                <div className="text-sm font-semibold text-primary flex-shrink-0">
                  {formatPrice(product.price_rrp)}
                </div>
              </button>
            ))}
            
            {searchQuery.trim().length >= 2 && (
              <button
                onClick={handleSearch}
                className={`w-full p-3 text-sm text-primary transition-colors text-center font-medium ${
                  selectedIndex === results.length ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                View all results for "{searchQuery}"
              </button>
            )}
          </div>
        )}

        {/* No Results */}
        {!isLoading && searchQuery.trim().length >= 2 && results.length === 0 && (
          <div className="border-t border-border p-6 text-center text-muted-foreground">
            <p className="text-sm">No products found for "{searchQuery}"</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
