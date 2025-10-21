import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Download, ExternalLink, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import {
  formatPrice,
  parseClinicalUseCases,
  parseSpecifications,
  cleanDescription,
  getImagePlaceholder,
  isOnSale,
} from '@/utils/productHelpers';

interface ProductDetail {
  id: string;
  sku: string;
  title: string;
  description?: string;
  product_type?: string;
  subtype?: string;
  specifications?: any;
  clinical_use_case?: string;
  funding_context?: string;
  price_rrp?: number;
  price_discounted?: number;
  brand?: string;
  size?: string;
  color?: string;
  image_url?: string;
  brochure_url?: string;
  url?: string;
}

export default function ProductDetail() {
  const { sku } = useParams<{ sku: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [lineNotes, setLineNotes] = useState('');
  const { addItem } = useQuote();
  const { toast } = useToast();

  useEffect(() => {
    if (sku) {
      fetchProduct();
    }
  }, [sku]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('sku', sku)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToQuote = () => {
    if (!product) return;

    addItem({
      id: product.id,
      productId: product.id,
      smSku: product.sku,
      productName: product.title,
      brandName: product.brand || '',
      quantity,
      unitPrice: product.price_discounted || product.price_rrp || 0,
      lineNotes: lineNotes,
    });

    toast({
      title: 'Added to quote',
      description: `${quantity}x ${product.title} has been added to your quote.`,
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

  if (!product) {
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

  const displayImage = product.image_url || getImagePlaceholder();
  const clinicalUseCases = parseClinicalUseCases(product.clinical_use_case);
  const specifications = parseSpecifications(product.specifications);
  const onSale = isOnSale(product.price_rrp, product.price_discounted);

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
            {product.product_type && (
              <>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/products?type=${product.product_type}`}>
                      {product.product_type}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{product.title}</BreadcrumbPage>
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
                alt={`${product.brand} ${product.title}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getImagePlaceholder();
                }}
              />
              {onSale && (
                <Badge className="absolute top-4 right-4 bg-supply-lavender text-white text-lg px-4 py-2">
                  Sale
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {product.brand && (
              <Badge variant="secondary" className="text-base px-4 py-1 bg-supply-lavender/20 text-supply-lavender-dark">
                {product.brand}
              </Badge>
            )}
            
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
              <p className="text-muted-foreground">SKU: {product.sku}</p>
            </div>

            <div className="space-y-2">
              {product.price_discounted ? (
                <>
                  <p className="text-4xl font-bold text-supply-lavender">
                    {formatPrice(product.price_discounted)}
                  </p>
                  {product.price_rrp && onSale && (
                    <p className="text-xl text-muted-foreground line-through">
                      RRP: {formatPrice(product.price_rrp)}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-4xl font-bold text-foreground">
                  {formatPrice(product.price_rrp)}
                </p>
              )}
            </div>

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
                className="w-full bg-supply-lavender hover:bg-supply-lavender-dark text-white text-lg py-6"
              >
                Add to Quote
              </Button>
            </Card>

            {product.size && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Size:</span> {product.size}
              </p>
            )}
            {product.color && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Color:</span> {product.color}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {cleanDescription(product.description)}
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
                  <span className="h-2 w-2 rounded-full bg-supply-lavender mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">{useCase}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Specifications */}
        {specifications.length > 0 && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Specifications</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {specifications.map((spec, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray-50' : ''}
                    >
                      <td className="py-3 px-4 font-medium">{spec.key}</td>
                      <td className="py-3 px-4 text-muted-foreground">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Funding Context */}
        {product.funding_context && (
          <Card className="p-8 mb-8 bg-blue-50 border-blue-200">
            <h2 className="text-2xl font-bold mb-4">Funding Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              {cleanDescription(product.funding_context)}
            </p>
          </Card>
        )}

        {/* Downloads & Links */}
        <div className="grid md:grid-cols-2 gap-6">
          {product.brochure_url && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Product Resources</h3>
              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <a
                  href={product.brochure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Brochure
                </a>
              </Button>
            </Card>
          )}

          {product.url && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">External Links</h3>
              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Supplier Website
                </a>
              </Button>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
