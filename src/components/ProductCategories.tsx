import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Bed, Home, Shield, Armchair, Package, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  subcategory_count: number;
}

const iconMap: Record<string, any> = {
  "Wheelchairs": User,
  "Mobility Scooters": User,
  "Accessible & Consumables": Package,
  "Bathroom & Toileting": Home,
  "Bedroom & Comfort": Bed,
  "Home & Safety": Shield,
  "Mobility": User,
  "Seating & Chairs": Armchair,
};

const ProductCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch actual categories from products to ensure they match
        const { data: productsData, error: productsError } = await supabase
          .from('products_categorized' as any)
          .select('top_level_category, subcategory') as { 
            data: { top_level_category: string | null; subcategory: string | null }[] | null; 
            error: any 
          };

        if (productsError) throw productsError;

        // Group by top_level_category and count subcategories
        const categoryMap = new Map<string, Set<string>>();
        
        (productsData || []).forEach(product => {
          if (product.top_level_category) {
            if (!categoryMap.has(product.top_level_category)) {
              categoryMap.set(product.top_level_category, new Set());
            }
            if (product.subcategory) {
              categoryMap.get(product.top_level_category)?.add(product.subcategory);
            }
          }
        });

        // Convert to array format
        const categoriesWithCounts = Array.from(categoryMap.entries())
          .map(([name, subcategories]) => ({
            id: name,
            name: name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            description: null,
            subcategory_count: subcategories.size,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section id="products" className="py-20 bg-soft-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Complete Assistive Technology Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Browse our comprehensive range of assistive technology products
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border p-6 animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4" />
                <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-2" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-5/6 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-soft-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Complete Assistive Technology Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Browse our comprehensive range of assistive technology products across {categories.length} categories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => {
            const IconComponent = iconMap[category.name] || Package;
            return (
              <Link key={category.id} to={`/products?category=${encodeURIComponent(category.name)}`}>
                <Card className="bg-card hover:shadow-lg transition-all duration-300 border-border group h-full cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{category.name}</CardTitle>
                    {category.description && (
                      <CardDescription className="text-muted-foreground">
                        {category.description}
                      </CardDescription>
                    )}
                    {category.subcategory_count > 0 && (
                      <Badge variant="secondary" className="mt-2">
                        {category.subcategory_count} subcategories
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      View Products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Contact Expert Section - Single CTA */}
        <div className="text-center bg-card rounded-2xl p-8 border border-border">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Need expert guidance choosing the right solution?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our experienced team can guide you through our complete range and help you find 
            the perfect assistive technology solution for your client's specific needs.
          </p>
          <Button variant="outline" size="lg">
            Speak with Expert
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;