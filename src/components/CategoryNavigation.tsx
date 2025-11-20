import { Link } from "react-router-dom";

export const CategoryNavigation = () => {
  return (
    <div className="flex items-center justify-center px-4">
      <Link
        to="/products"
        className="px-8 py-2.5 text-sm font-semibold rounded-md transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Shop Now
      </Link>
    </div>
  );
};
