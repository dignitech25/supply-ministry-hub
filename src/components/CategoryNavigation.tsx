import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const FEATURED_CATEGORIES = [
  { name: "Bedroom and Comfort", slug: "Bedroom%20and%20Comfort" },
  { name: "Mobility", slug: "Mobility" },
  { name: "Seating and Chairs", slug: "Seating%20and%20Chairs" }
];

export const CategoryNavigation = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get('category');

  return (
    <div className="flex items-center justify-center gap-2 px-4">
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
      {FEATURED_CATEGORIES.map(category => (
        <Link
          key={category.name}
          to={`/products?category=${category.slug}`}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
            activeCategory === decodeURIComponent(category.slug)
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
