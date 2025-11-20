import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const CategoryNavigation = () => {
  const categories = [
    "Mobility",
    "Bedroom & Comfort",
    "Seating & Chairs",
    "Bathroom & Toileting",
    "Accessible & Consumables",
    "Home & Safety"
  ];

  return (
    <div className="px-4 py-2">
      {/* Desktop - Category buttons + Shop Now */}
      <div className="hidden md:flex items-center justify-center gap-3 flex-wrap">
        {categories.map((category) => (
          <Link key={category} to={`/products?category=${encodeURIComponent(category)}`}>
            <Button variant="outline" size="sm">
              {category}
            </Button>
          </Link>
        ))}
        <Link to="/products">
          <Button size="sm">Shop Now</Button>
        </Link>
      </div>

      {/* Mobile - Just Shop Now */}
      <div className="md:hidden flex items-center justify-center">
        <Link to="/products">
          <Button>Shop Now</Button>
        </Link>
      </div>
    </div>
  );
};
