import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Download, ExternalLink, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { useQuote } from '@/contexts/QuoteContext';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchParentProduct, fetchParentProductBySku } from '@/utils/parentProductHelpers';
import { ParentProduct, ProductVariant } from '@/utils/variantHelpers';
import { formatPrice } from '@/utils/productHelpers';

export default function ProductDetail() {
  const { handle, sku } = useParams<{ handle?: string; sku?: string }>();
  const [parent, setParent] = useState<ParentProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [lineNotes, setLineNotes] = useState('');
  const { addItem } = useQuote();
  const { toast } = useToast();

  // Fetch parent product and variants
  useEffect(() => {
    const fetchProduct = async () => {
      const identifier = handle || sku;
      if (!identifier) return;

      setLoading(true);
      try {
        let parentData: ParentProduct | null = null;
        
        // Check if identifier is a parent slug (contains underscore) or SKU
        if (identifier.includes('_')) {
          // It's a parent slug
          parentData = await fetchParentProduct(identifier);
        } else {
          // It's likely a SKU, fetch by SKU
          parentData = await fetchParentProductBySku(identifier);
        }

        if (parentData) {
          setParent(parentData);
          setSelectedVariant(parentData.defaultVariant);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle, sku]);

  // Variant selection logic
  const selectVariant = (sizeChoice?: string, colorChoice?: string) => {
    if (!parent) return;

    const eq = (a: string | null | undefined, b: string | undefined) =>
      a?.toLowerCase() === b?.toLowerCase();

    const currentSize = sizeChoice || selectedVariant?.size;
    const currentColor = colorChoice || selectedVariant?.color;

    let variant = parent.variants.find(
      (v) =>
        eq(v.size, currentSize) &&
        eq(v.color, currentColor)
    );

    if (!variant && currentSize) {
      variant = parent.variants.find((v) => eq(v.size, currentSize));
    }

    if (!variant && currentColor) {
      variant = parent.variants.find((v) => eq(v.color, currentColor));
    }

    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleAddToQuote = () => {
    if (!selectedVariant || !parent) return;

    const unitPrice = selectedVariant.priceDiscounted || selectedVariant.priceRrp || undefined;

    addItem({
      id: selectedVariant.sku,
      productId: selectedVariant.sku,
      productName: parent.baseName,
      brandName: parent.brand,
      smSku: selectedVariant.sku,
      primaryImageUrl: selectedVariant.imageUrl || undefined,
      unitPrice,
      quantity,
      lineNotes,
      variantSize: selectedVariant.size,
      variantColor: selectedVariant.color,
    });

    toast({
      title: 'Added to quote',
      description: `${quantity}x ${parent.baseName}${selectedVariant.size ? ` (${selectedVariant.size})` : ''} has been added to your quote.`,
    });

    setQuantity(1);
    setLineNotes('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-12 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!parent || !selectedVariant) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Card className="p-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/products">Back to Products</Link>
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  const breadcrumbs = [parent.category, parent.subcategory].filter(Boolean);
  const clinicalUseCases = parent.clinicalUseCase
    ?.split('|')
    .map((c) => c.trim())
    .filter(Boolean) || [];

  const displayImage = selectedVariant.imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23C4B5FD" width="400" height="400"/%3E%3Ctext fill="%23ffffff" font-family="sans-serif" font-size="24" text-anchor="middle" x="200" y="200"%3ENo Image%3C/text%3E%3C/svg%3E';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/products">Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((crumb, i) => (
              <span key={i}>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink>{crumb}</BreadcrumbLink>
                </BreadcrumbItem>
              </span>
            ))}
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{parent.baseName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative">
              <img
                src={displayImage}
                alt={`${parent.brand} ${parent.baseName}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {parent.brand && (
              <Badge variant="secondary" className="text-base px-4 py-1">
                {parent.brand}
              </Badge>
            )}
            
            <div>
              <h1 className="text-4xl font-bold mb-2">{parent.baseName}</h1>
              <p className="text-muted-foreground">SKU: {selectedVariant.sku}</p>
              <p className="text-sm text-muted-foreground">{parent.subcategory}</p>
            </div>

            <div className="space-y-2">
              {selectedVariant.priceDiscounted && selectedVariant.priceRrp ? (
                <>
                  <p className="text-4xl font-bold text-primary">
                    {formatPrice(selectedVariant.priceDiscounted)}
                  </p>
                  <p className="text-lg text-muted-foreground line-through">
                    RRP {formatPrice(selectedVariant.priceRrp)}
                  </p>
                </>
              ) : selectedVariant.priceRrp ? (
                <p className="text-4xl font-bold text-primary">
                  {formatPrice(selectedVariant.priceRrp)}
                </p>
              ) : (
                <p className="text-2xl text-muted-foreground">
                  Price on request
                </p>
              )}
            </div>

            {/* Variant Selectors */}
            {parent.uniqueSizes.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <Select
                  value={selectedVariant.size || ''}
                  onValueChange={(value) => selectVariant(value, undefined)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {parent.uniqueSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {parent.uniqueColors.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <Select
                  value={selectedVariant.color || ''}
                  onValueChange={(value) => selectVariant(undefined, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {parent.uniqueColors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Add to Quote Form */}
            <Card className="p-6 space-y-4 bg-gray-50">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-semibold w-16 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (Optional)</label>
                <Textarea
                  placeholder="Add any special requirements or notes..."
                  value={lineNotes}
                  onChange={(e) => setLineNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleAddToQuote}
                className="w-full text-lg py-6"
              >
                Add to Quote
              </Button>
            </Card>
          </div>
        </div>

        {/* Description */}
        {(parent.descriptionLong || parent.description) && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {parent.descriptionLong || parent.description}
            </p>
          </Card>
        )}

        {/* Clinical Use Cases */}
        {clinicalUseCases.length > 0 && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Clinical Use Cases</h2>
            <ul className="space-y-3">
              {clinicalUseCases.map((useCase, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">{useCase}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Specifications */}
        {selectedVariant.specifications && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Specifications</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {Object.entries(JSON.parse(selectedVariant.specifications || '{}')).map(([key, value], index) => (
                    <tr key={key} className={index % 2 === 0 ? 'border-b' : 'border-b bg-gray-50'}>
                      <td className="py-3 px-4 font-medium capitalize">{key.replace(/_/g, ' ')}</td>
                      <td className="py-3 px-4 text-muted-foreground">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
