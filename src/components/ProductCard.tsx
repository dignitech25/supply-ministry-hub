import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuote } from '@/contexts/QuoteContext';
import { useToast } from '@/hooks/use-toast';
import { formatPrice, getImagePlaceholder, isOnSale } from '@/utils/productHelpers';

interface Product {
  id: string;
  sku: string;
  title: string;
  brand: string;
  product_type?: string;
  price_rrp?: number;
  price_discounted?: number;
  image_url?: string;
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
      id: product.id,
      productId: product.id,
      smSku: product.sku,
      productName: product.title,
      brandName: product.brand,
      quantity: 1,
      unitPrice: product.price_discounted || product.price_rrp || 0,
      lineNotes: '',
    });

    toast({
      title: 'Added to quote',
      description: `${product.title} has been added to your quote.`,
    });
  };

  const displayImage = product.image_url || getImagePlaceholder();
  const onSale = isOnSale(product.price_rrp, product.price_discounted);

  return (
    <Link to={`/products/${product.sku}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] duration-200">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <img
            src={displayImage}
            alt={`${product.brand} ${product.title}`}
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getImagePlaceholder();
            }}
          />
          {onSale && (
            <div className="absolute top-2 right-2 bg-supply-lavender text-white px-3 py-1 rounded-full text-sm font-semibold">
              Sale
            </div>
          )}
        </div>
        
        <div className="p-6 space-y-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h3 className="font-geist font-medium tracking-tight text-ink text-lg line-clamp-2 min-h-[3.5rem]">
              {product.title}
            </h3>
          </div>

          <div className="space-y-1">
            {product.price_discounted && product.price_rrp ? (
              <>
                <p className="text-2xl font-geist font-semibold text-ink">
                  {formatPrice(product.price_discounted)}
                </p>
                <p className="text-sm text-muted-foreground line-through">
                  RRP {formatPrice(product.price_rrp)}
                </p>
              </>
            ) : product.price_rrp ? (
              <p className="text-2xl font-geist font-semibold text-ink">
                {formatPrice(product.price_rrp)}
              </p>
            ) : (
              <p className="text-lg text-muted-foreground">
                Contact for pricing
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
            >
              View Details
            </Button>
            <Button
              size="sm"
              onClick={handleAddToQuote}
              className="bg-supply-lavender hover:bg-supply-lavender-dark text-white"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};
