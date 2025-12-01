import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
        <Button 
          size="sm" 
          onClick={handleShopNowClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition ml-2"
        >
          Shop Now
        </Button>
      </div>

      {/* Mobile - Just Shop Now */}
      <div className="md:hidden flex items-center justify-center py-2">
        <Button 
          onClick={handleShopNowClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition w-full max-w-xs"
        >
          Shop Now
        </Button>
      </div>
    </div>
  );
};
