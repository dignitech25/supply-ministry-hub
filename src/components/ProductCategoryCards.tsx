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
  },
  {
    name: "Bedroom & Comfort",
    slug: "Bedroom & Comfort",
    icon: Bed,
  },
  {
    name: "Seating & Chairs",
    slug: "Seating & Chairs",
    icon: Armchair,
  },
  {
    name: "Bathroom & Toileting",
    slug: "Bathroom & Toileting",
    icon: Bath,
  },
  {
    name: "Accessible & Consumables",
    slug: "Accessible & Consumables",
    icon: Package,
  },
  {
    name: "Home & Safety",
    slug: "Home & Safety",
    icon: Home,
  },
];

const ProductCategoryCards = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-geist text-[11px] tracking-[0.18em] uppercase text-muted-body mb-4">Categories</p>
          <h2 className="font-geist font-light tracking-tight leading-[1.05] text-5xl md:text-6xl text-ink mb-4">
            Explore our complete <span className="italic text-gold">range</span>
          </h2>
          <p className="text-lg text-muted-body max-w-2xl mx-auto">
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
                <Card className="h-full bg-cream-alt border-cream-border transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-ink/20 animate-fade-in">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="bg-ink/5 group-hover:bg-gold/20 rounded-full p-4 mb-4 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-ink group-hover:text-ink" />
                    </div>
                    <h3 className="font-geist text-xl text-ink mb-2">
                      {category.name}
                    </h3>
                    <p className="text-muted-body text-sm">
                      Explore range
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="bg-cream-alt rounded-2xl p-8 border border-cream-border max-w-3xl mx-auto">
            <h3 className="font-geist font-light tracking-tight leading-[1.05] text-2xl md:text-3xl text-ink mb-4">
              Need expert <span className="italic text-gold">guidance</span>?
            </h3>
            <p className="text-lg text-muted-body mb-6">
              Our experienced team can help you find the perfect assistive technology solution for your client's specific needs.
            </p>
            <button 
              className="bg-ink text-cream px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
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
