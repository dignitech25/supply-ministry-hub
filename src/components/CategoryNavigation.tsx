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
        className="px-6 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap bg-background text-primary border-2 border-primary hover:bg-primary/10"
      >
        Shop Now
      </Link>
      {FEATURED_CATEGORIES.map(category => (
        <Link
          key={category.name}
          to={`/products?category=${category.slug}`}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90",
            activeCategory === decodeURIComponent(category.slug) && "ring-2 ring-primary ring-offset-2"
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};
