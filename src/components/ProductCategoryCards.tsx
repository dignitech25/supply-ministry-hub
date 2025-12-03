import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Move, 
  Bed, 
  Armchair, 
  Bath, 
  Package, 
  Home 
} from "lucide-react";

const categories = [
  {
    name: "Mobility",
    slug: "Mobility",
    icon: Move,
    count: "500+",
  },
  {
    name: "Bedroom & Comfort",
    slug: "Bedroom & Comfort",
    icon: Bed,
    count: "300+",
  },
  {
    name: "Seating & Chairs",
    slug: "Seating & Chairs",
    icon: Armchair,
    count: "250+",
  },
  {
    name: "Bathroom & Toileting",
    slug: "Bathroom & Toileting",
    icon: Bath,
    count: "400+",
  },
  {
    name: "Accessible & Consumables",
    slug: "Accessible & Consumables",
    icon: Package,
    count: "350+",
  },
  {
    name: "Home & Safety",
    slug: "Home & Safety",
    icon: Home,
    count: "200+",
  },
];

const ProductCategoryCards = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-soft-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Explore Our Complete Range
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our extensive catalogue of mobility aids, home modifications, and assistive technology solutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {categories.map((category, index) => {
            const Icon = category.icon;
            
            return (
              <Link
                key={category.slug}
                to={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 animate-fade-in">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="bg-orange-500/10 group-hover:bg-orange-500/20 rounded-full p-4 mb-4 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {category.count} products
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="bg-card rounded-2xl p-8 border border-border max-w-3xl mx-auto shadow-sm">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Need Expert Guidance?
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Our experienced team can help you find the perfect assistive technology solution for your client's specific needs.
            </p>
            <button 
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              onClick={() => navigate('/quote')}
            >
              Speak with an Expert
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCategoryCards;
