import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  slug: string;
}

export const CategoryNavigation = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get('category');

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('products_categorized' as any)
        .select('top_level_category')
        .not('top_level_category', 'is', null);
      
      const unique = Array.from(new Set(
        (data || []).map((p: any) => p.top_level_category).filter(Boolean)
      )) as string[];
      
      setCategories(
        unique.map(name => ({
          name,
          slug: encodeURIComponent(name)
        })).sort((a, b) => a.name.localeCompare(b.name))
      );
    };
    
    fetchCategories();
  }, []);

  return (
    <div className="flex items-center justify-center gap-1 overflow-x-auto scrollbar-hide px-4">
      <Link
        to="/products"
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
          !activeCategory
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        All Products
      </Link>
      {categories.map(category => (
        <Link
          key={category.name}
          to={`/products?category=${category.slug}`}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
            activeCategory === category.name
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};
