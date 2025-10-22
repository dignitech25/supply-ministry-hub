import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface CategoryData {
  type: string;
  count: number;
}

const ProductCategories = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('product_type');

      if (error) throw error;

      // Count products per type
      const typeCounts = data?.reduce((acc: Record<string, number>, product) => {
        if (product.product_type) {
          acc[product.product_type] = (acc[product.product_type] || 0) + 1;
        }
        return acc;
      }, {});

      // Convert to array and sort by count
      const categoryArray = Object.entries(typeCounts || {})
        .map(([type, count]) => ({ type, count: count as number }))
        .sort((a, b) => b.count - a.count);

      setCategories(categoryArray);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProducts = (type: string) => {
    navigate(`/products?type=${encodeURIComponent(type)}`);
  };

  const handleBuyNow = () => {
    navigate('/products');
  };
  return (
    <section id="products" className="py-20 bg-soft-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Complete Assistive Technology Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Browse our comprehensive range of assistive technology products, 
            sourced from leading manufacturers across Australia.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border p-6 animate-pulse">
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-10 bg-muted rounded mt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {categories.map((category) => (
              <Card key={category.type} className="bg-card hover:shadow-lg transition-all duration-300 border-border group">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl text-foreground">{category.type}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {category.count} {category.count === 1 ? 'product' : 'products'} available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() => handleViewProducts(category.type)}
                  >
                    View Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Single Buy Now CTA */}
        <div className="text-center bg-card rounded-2xl p-8 border border-border">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Ready to explore our full catalogue?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Browse our complete range of assistive technology solutions with advanced filtering 
            and search capabilities to find exactly what you need.
          </p>
          <Button size="lg" onClick={handleBuyNow}>
            Buy Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;