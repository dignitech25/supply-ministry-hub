import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CategoryNavigation = () => {
  const navigate = useNavigate();
  
  const categories = [
    "Mobility",
    "Bedroom & Comfort",
    "Seating & Chairs",
    "Bathroom & Toileting",
    "Accessible & Consumables",
    "Home & Safety"
  ];

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const handleShopNowClick = () => {
    navigate('/products');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      {/* Desktop - Category buttons + Shop Now */}
      <div className="hidden md:flex items-center justify-center gap-2 py-3 flex-wrap">
        {categories.map((category) => (
          <Button 
            key={category}
            variant="ghost" 
            size="sm"
            onClick={() => handleCategoryClick(category)}
            className="text-sm font-medium text-foreground hover:text-primary hover:bg-muted/50 transition"
          >
            {category}
          </Button>
        ))}
        <Link
          to="/support-at-home"
          className="text-sm font-medium text-foreground hover:text-primary transition"
        >
          Support at Home
        </Link>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col items-center gap-2 py-2">
        <Button 
          onClick={handleShopNowClick}
          className="bg-orange-500 text-white px-6 py-2.5 rounded-md hover:bg-orange-600 transition-colors font-semibold w-full max-w-xs"
        >
          Shop Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Link
          to="/support-at-home"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition"
        >
          Support at Home
        </Link>
      </div>
    </div>
  );
};
