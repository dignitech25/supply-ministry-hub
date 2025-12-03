import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuote } from "@/contexts/QuoteContext";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, getImagePlaceholder, isOnSale } from "@/utils/productHelpers";

// Curated SKUs - easy to update
const FEATURED_SKUS = [
  'PR10DX-4B',   // Pride Pathrider 10 Deluxe Scooter (Mobility)
  'CR5435',      // Configura Advance Manual Chair (Seating)
  'WAF705350',   // ASPIRE Vogue Carbon Fibre Walker (Walker)
  'IC333SQSA',   // Icare IC333 Homecare HiLo Bed (Bedroom)
];

const FeaturedProducts = () => {
  const { addItem } = useQuote();
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('sku', FEATURED_SKUS);
      
      if (error) throw error;
      
      // Maintain curated order
      return FEATURED_SKUS
        .map(sku => data?.find(p => p.sku === sku))
        .filter(Boolean);
    },
  });

  const handleAddToQuote = (product: any) => {
    addItem({
      id: product.id,
      productId: product.id,
      productName: product.title || 'Product',
      brandName: product.brand || '',
      smSku: product.sku,
      primaryImageUrl: product.image_url,
      unitPrice: product.price_discounted || product.price_rrp,
      quantity: 1,
    });
    
    toast({
      title: "Added to quote",
      description: `${product.title} has been added to your quote request.`,
    });
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-24 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hand-picked solutions from our extensive catalogue
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products?.map((product: any, index: number) => (
            <Card 
              key={product.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-muted overflow-hidden">
                <img
                  src={product.image_url || getImagePlaceholder()}
                  alt={product.title || 'Product'}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getImagePlaceholder();
                  }}
                />
                {isOnSale(product.price_rrp, product.price_discounted) && (
                  <span className="absolute top-2 right-2 bg-supply-lavender text-foreground text-xs font-semibold px-2 py-1 rounded">
                    Sale
                  </span>
                )}
              </div>

              <CardContent className="p-4">
                {/* Brand */}
                {product.brand && (
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {product.brand}
                  </p>
                )}

                {/* Title */}
                <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.5rem] mb-2">
                  {product.title || 'Product'}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  {isOnSale(product.price_rrp, product.price_discounted) ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(product.price_discounted)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.price_rrp)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price_rrp)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link to={`/products/${product.sku}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => handleAddToQuote(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Button
            variant="outline"
            size="lg"
            asChild
          >
            <Link to="/products" className="inline-flex items-center gap-2">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
