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

interface ProductVariant {
  sku: string;
  handle: string;
  title: string;
  brand: string;
  description_long: string | null;
  description_short: string | null;
  image_url: string | null;
  price_discounted: string | null;
  price_rrp: number | null;
  size_normalized: string | null;
  size: string | null;
  color_normalized: string | null;
  clinical_use_case: string | null;
  category_path: string | null;
  is_consumable: string | null;
  top_level_category: string;
  subcategory: string;
  spec_length_mm: string | null;
  spec_width_mm: string | null;
  spec_height_mm: string | null;
  spec_weight_kg: string | null;
  spec_dimensions_text: string | null;
}

export default function ProductDetail() {
  const { handle, sku } = useParams<{ handle?: string; sku?: string }>();
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [lineNotes, setLineNotes] = useState('');
  const { addItem } = useQuote();
  const { toast } = useToast();

  // Fetch all variants for this handle
  useEffect(() => {
    const fetchVariants = async () => {
      const identifier = handle || sku;
      if (!identifier) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('products_categorized' as any)
        .select('*')
        .eq(handle ? 'handle' : 'sku', identifier)
        .order('size_normalized', { ascending: true, nullsFirst: false }) as { data: any[] | null; error: any };

      if (error) {
        console.error('Error fetching variants:', error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setVariants(data as ProductVariant[]);
        setSelectedVariant(data[0] as ProductVariant);
      }
      setLoading(false);
    };

    fetchVariants();
  }, [handle, sku]);

  // Extract unique sizes and colors
  const sizes = Array.from(
    new Set(
      variants
        .map((v) => v.size_normalized || v.size)
        .filter(Boolean)
    )
  );

  const colors = Array.from(
    new Set(
      variants
        .map((v) => v.color_normalized)
        .filter(Boolean)
    )
  );

  // Variant selection logic
  const selectVariant = (sizeChoice?: string, colorChoice?: string) => {
    const eq = (a: string | null | undefined, b: string | undefined) =>
      a?.toLowerCase() === b?.toLowerCase();

    const currentSize = sizeChoice || (selectedVariant?.size_normalized || selectedVariant?.size);
    const currentColor = colorChoice || selectedVariant?.color_normalized;

    let variant = variants.find(
      (v) =>
        eq(v.size_normalized || v.size, currentSize) &&
        eq(v.color_normalized, currentColor)
    );

    if (!variant && currentSize) {
      variant = variants.find((v) => eq(v.size_normalized || v.size, currentSize));
    }

    if (!variant && currentColor) {
      variant = variants.find((v) => eq(v.color_normalized, currentColor));
    }

    setSelectedVariant(variant || variants[0]);
  };

  const handleAddToQuote = () => {
    if (!selectedVariant) return;

    const unitPrice = selectedVariant.price_discounted 
      ? parseFloat(selectedVariant.price_discounted) 
      : selectedVariant.price_rrp || undefined;

    addItem({
      id: selectedVariant.sku,
      productId: selectedVariant.sku,
      productName: selectedVariant.title,
      brandName: selectedVariant.brand || '',
      smSku: selectedVariant.sku,
      primaryImageUrl: selectedVariant.image_url || undefined,
      unitPrice,
      quantity,
      lineNotes,
    });

    toast({
      title: 'Added to quote',
      description: `${quantity}x ${selectedVariant.title} has been added to your quote.`,
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

  if (!selectedVariant) {
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

  const breadcrumbs = selectedVariant.category_path?.split('>').map((s) => s.trim()) || [];
  const displayPrice =
    selectedVariant.price_discounted && selectedVariant.price_discounted.trim() !== ''
      ? `$${selectedVariant.price_discounted}`
      : selectedVariant.price_rrp
      ? `$${selectedVariant.price_rrp}`
      : 'Price on request';

  const clinicalUseCases = selectedVariant.clinical_use_case
    ?.split('|')
    .map((c) => c.trim())
    .filter(Boolean) || [];

  const displayImage = selectedVariant.image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23C4B5FD" width="400" height="400"/%3E%3Ctext fill="%23ffffff" font-family="sans-serif" font-size="24" text-anchor="middle" x="200" y="200"%3ENo Image%3C/text%3E%3C/svg%3E';

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
              <BreadcrumbPage>{selectedVariant.title}</BreadcrumbPage>
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
                alt={`${selectedVariant.brand} ${selectedVariant.title}`}
                className="w-full h-full object-cover"
              />
              {selectedVariant.is_consumable === 'Y' && (
                <Badge className="absolute top-4 right-4">
                  Consumable
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {selectedVariant.brand && (
              <Badge variant="secondary" className="text-base px-4 py-1">
                {selectedVariant.brand}
              </Badge>
            )}
            
            <div>
              <h1 className="text-4xl font-bold mb-2">{selectedVariant.title}</h1>
              <p className="text-muted-foreground">SKU: {selectedVariant.sku}</p>
              <p className="text-sm text-muted-foreground">{selectedVariant.subcategory}</p>
            </div>

            <div className="space-y-2">
              <p className="text-4xl font-bold text-primary">
                {displayPrice}
              </p>
            </div>

            {/* Variant Selectors */}
            {sizes.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <Select
                  value={selectedVariant.size_normalized || selectedVariant.size || ''}
                  onValueChange={(value) => selectVariant(value, undefined)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {sizes.map((size) => (
                      <SelectItem key={size} value={size!}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {colors.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <Select
                  value={selectedVariant.color_normalized || ''}
                  onValueChange={(value) => selectVariant(undefined, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {colors.map((color) => (
                      <SelectItem key={color} value={color!}>
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
        {(selectedVariant.description_long || selectedVariant.description_short) && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {selectedVariant.description_long || selectedVariant.description_short}
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
        {(selectedVariant.spec_length_mm ||
          selectedVariant.spec_width_mm ||
          selectedVariant.spec_height_mm ||
          selectedVariant.spec_weight_kg ||
          selectedVariant.spec_dimensions_text) && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Specifications</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {selectedVariant.spec_dimensions_text && (
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Dimensions</td>
                      <td className="py-3 px-4 text-muted-foreground">{selectedVariant.spec_dimensions_text}</td>
                    </tr>
                  )}
                  {selectedVariant.spec_length_mm && (
                    <tr className="border-b bg-gray-50">
                      <td className="py-3 px-4 font-medium">Length</td>
                      <td className="py-3 px-4 text-muted-foreground">{selectedVariant.spec_length_mm} mm</td>
                    </tr>
                  )}
                  {selectedVariant.spec_width_mm && (
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Width</td>
                      <td className="py-3 px-4 text-muted-foreground">{selectedVariant.spec_width_mm} mm</td>
                    </tr>
                  )}
                  {selectedVariant.spec_height_mm && (
                    <tr className="border-b bg-gray-50">
                      <td className="py-3 px-4 font-medium">Height</td>
                      <td className="py-3 px-4 text-muted-foreground">{selectedVariant.spec_height_mm} mm</td>
                    </tr>
                  )}
                  {selectedVariant.spec_weight_kg && (
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Weight</td>
                      <td className="py-3 px-4 text-muted-foreground">{selectedVariant.spec_weight_kg} kg</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
