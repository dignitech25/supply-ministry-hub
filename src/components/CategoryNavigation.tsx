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
    <div className="px-2 py-0 md:px-4 md:py-1">
      {/* Desktop - Category buttons + Shop Now */}
      <div className="hidden md:flex items-center justify-center gap-3 flex-wrap">
        {categories.map((category) => (
          <Button 
            key={category}
            variant="outline" 
            size="sm"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Button>
        ))}
        <Button size="sm" onClick={handleShopNowClick}>
          Shop Now
        </Button>
      </div>

      {/* Mobile - Just Shop Now */}
      <div className="md:hidden flex items-center justify-center py-1">
        <Button onClick={handleShopNowClick}>Shop Now</Button>
      </div>
    </div>
  );
};
