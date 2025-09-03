import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuote } from '@/contexts/QuoteContext';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  brand_name: string;
  brand_slug: string;
  sm_sku: string;
  primary_image_url?: string;
  price_ex_gst?: number;
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useQuote();
  const { toast } = useToast();

  const handleAddToQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      brandName: product.brand_name,
      smSku: product.sm_sku,
      primaryImageUrl: product.primary_image_url,
      unitPrice: product.price_ex_gst,
    });

    toast({
      title: "Added to quote",
      description: `${product.name} has been added to your quote.`,
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <Link to={`/product/${product.slug}`}>
        <CardContent className="p-4">
          <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
            {product.primary_image_url ? (
              <img
                src={product.primary_image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <span className="text-sm">No Image</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {product.featured && (
              <Badge variant="secondary" className="text-xs">
                Featured
              </Badge>
            )}
            
            <h3 className="font-medium text-sm leading-tight line-clamp-2">
              {product.name}
            </h3>
            
            <p className="text-sm text-muted-foreground">
              {product.brand_name}
            </p>
            
            <p className="text-xs text-muted-foreground">
              SKU: {product.sm_sku}
            </p>
            
            {product.price_ex_gst && (
              <p className="text-sm font-medium text-primary">
                From ${product.price_ex_gst.toFixed(2)} ex GST
              </p>
            )}
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToQuote}
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to Quote
        </Button>
      </CardFooter>
    </Card>
  );
};