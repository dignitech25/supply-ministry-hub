import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
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
import SEO from '@/components/SEO';
import EditorialNavigation from '@/components/editorial/EditorialNavigation';
import { supabase } from '@/integrations/supabase/client';
import { useQuote } from '@/contexts/QuoteContext';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchParentProduct, fetchParentProductBySku, fetchParentProductByHandle } from '@/utils/parentProductHelpers';
import { ParentProduct, ProductVariant } from '@/utils/variantHelpers';
import { formatPrice } from '@/utils/productHelpers';
import ProductSEOContent, { hasProductSEOContent, getProductFAQs } from '@/components/ProductSEOContent';
import Footer from '@/components/Footer';
import { createBreadcrumbSchema } from '@/components/SEO';

const SITE_URL = 'https://www.supplyministry.com.au';

export default function ProductDetail() {
  const { handle, sku } = useParams<{ handle?: string; sku?: string }>();
  const location = useLocation();
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
        } else if (identifier.includes('-')) {
          // It's likely a hyphenated handle from the database
          parentData = await fetchParentProductByHandle(identifier);
        }
        
        // If not found by handle, try by SKU
        if (!parentData) {
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

  // Build JSON-LD schemas
  const buildProductSchema = () => {
    if (!parent || !selectedVariant) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": parent.baseName,
      "description": parent.description || parent.descriptionLong,
      "sku": selectedVariant.sku,
      "brand": parent.brand ? {
        "@type": "Brand",
        "name": parent.brand
      } : undefined,
      "image": selectedVariant.imageUrl,
      "category": parent.subcategory || parent.category,
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": parent.fromPrice || undefined,
        "highPrice": parent.variants.reduce((max, v) => {
          const price = v.priceDiscounted || v.priceRrp || 0;
          return price > max ? price : max;
        }, 0) || undefined,
        "priceCurrency": "AUD",
        "availability": "https://schema.org/InStock",
        "offerCount": parent.variants.length
      }
    };
  };

  const buildBreadcrumbSchema = () => {
    if (!parent) return null;
    
    const items = [
      { name: "Home", url: SITE_URL },
      { name: "Products", url: `${SITE_URL}/products` }
    ];
    
    if (parent.category) {
      items.push({ 
        name: parent.category, 
        url: `${SITE_URL}/products?category=${encodeURIComponent(parent.category)}` 
      });
    }
    
    if (parent.subcategory) {
      items.push({ 
        name: parent.subcategory, 
        url: `${SITE_URL}/products?category=${encodeURIComponent(parent.category || '')}&subcategory=${encodeURIComponent(parent.subcategory)}` 
      });
    }
    
    items.push({ name: parent.baseName, url: `${SITE_URL}${location.pathname}` });
    
    return createBreadcrumbSchema(items);
  };

  const buildFAQSchema = () => {
    if (!parent) return null;
    
    const faqs = getProductFAQs(parent.slug);
    if (faqs.length === 0) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  };

  // Combine all schemas
  const getJsonLdSchemas = () => {
    const schemas = [];
    const productSchema = buildProductSchema();
    const breadcrumbSchema = buildBreadcrumbSchema();
    const faqSchema = buildFAQSchema();
    
    if (productSchema) schemas.push(productSchema);
    if (breadcrumbSchema) schemas.push(breadcrumbSchema);
    if (faqSchema) schemas.push(faqSchema);
    
    return schemas.length > 0 ? schemas : undefined;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <EditorialNavigation />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-cream-image rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-cream-image rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-12 bg-cream-image rounded w-3/4"></div>
                <div className="h-6 bg-cream-image rounded w-1/2"></div>
                <div className="h-20 bg-cream-image rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!parent || !selectedVariant) {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <EditorialNavigation />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Card className="p-16 text-center bg-cream-alt border-cream-border">
            <h1 className="text-3xl md:text-4xl font-fraunces font-light text-ink mb-4">
              Product not <span className="italic text-gold">found</span>
            </h1>
            <p className="text-muted-body mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild className="bg-ink text-cream hover:opacity-90 rounded-full">
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
    <div className="min-h-screen bg-cream text-ink">
      <SEO 
        title={`${parent.baseName}${parent.brand ? ` by ${parent.brand}` : ''}`}
        description={parent.description?.slice(0, 155) || `Shop ${parent.baseName} from Supply Ministry. Quality assistive technology with fast dispatch and expert support.`}
        image={selectedVariant.imageUrl || undefined}
        jsonLd={getJsonLdSchemas()}
      />
      <EditorialNavigation />
      
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
              <React.Fragment key={i}>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link 
                      to={i === 0 
                        ? `/products?category=${encodeURIComponent(parent.category || '')}`
                        : `/products?category=${encodeURIComponent(parent.category || '')}&subcategory=${encodeURIComponent(parent.subcategory || '')}`
                      }
                    >
                      {crumb}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
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
            <div className="aspect-square rounded-xl overflow-hidden bg-cream-image relative">
              <img
                src={displayImage}
                alt={`${parent.brand || ''} ${parent.baseName} – ${parent.category || 'assistive technology'} from Supply Ministry`.trim()}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {parent.brand && (
              <Badge variant="secondary" className="text-base px-4 py-1 bg-cream-alt text-ink border border-cream-border hover:bg-cream-alt">
                {parent.brand}
              </Badge>
            )}
            
            <div>
              <h1 className="text-4xl md:text-5xl font-geist font-medium tracking-tight text-ink mb-2 leading-[1.1]">{parent.baseName}</h1>
              <p className="text-muted-body">SKU: {selectedVariant.sku}</p>
              <p className="text-sm text-muted-body">{parent.subcategory}</p>
            </div>

            <div className="space-y-2">
              {selectedVariant.priceDiscounted && selectedVariant.priceRrp ? (
                <>
                  <p className="text-4xl font-geist font-semibold text-ink">
                    {formatPrice(selectedVariant.priceDiscounted)}
                  </p>
                  <p className="text-lg text-muted-body line-through">
                    RRP {formatPrice(selectedVariant.priceRrp)}
                  </p>
                </>
              ) : selectedVariant.priceRrp ? (
                <p className="text-4xl font-geist font-semibold text-ink">
                  {formatPrice(selectedVariant.priceRrp)}
                </p>
              ) : (
                <p className="text-2xl text-muted-body">
                  Price on request
                </p>
              )}
            </div>

            {/* Variant Selectors */}
            {parent.uniqueSizes.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Size</label>
                <Select
                  value={selectedVariant.size || ''}
                  onValueChange={(value) => selectVariant(value, undefined)}
                >
                  <SelectTrigger className="bg-cream-alt border-cream-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cream border-cream-border z-50">
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
                <label className="text-sm font-medium text-ink">Color</label>
                <Select
                  value={selectedVariant.color || ''}
                  onValueChange={(value) => selectVariant(undefined, value)}
                >
                  <SelectTrigger className="bg-cream-alt border-cream-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cream border-cream-border z-50">
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
            <Card className="p-6 space-y-4 bg-cream-alt border-cream-border">
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-ink/20 text-ink hover:bg-ink hover:text-cream"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-medium text-ink w-16 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-ink/20 text-ink hover:bg-ink hover:text-cream"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Notes (Optional)</label>
                <Textarea
                  placeholder="Add any special requirements or notes..."
                  value={lineNotes}
                  onChange={(e) => setLineNotes(e.target.value)}
                  rows={3}
                  className="bg-cream border-cream-border"
                />
              </div>

              <Button
                onClick={handleAddToQuote}
                className="w-full text-base py-6 bg-ink text-cream hover:opacity-90 rounded-full"
              >
                Add to Quote
              </Button>
            </Card>
          </div>
        </div>

        {/* Description */}
        {(parent.descriptionLong || parent.description) && (
          <Card className="p-8 mb-8 bg-cream-alt border-cream-border">
            <h2 className="text-2xl md:text-3xl font-fraunces font-light text-ink mb-4">Description</h2>
            <p className="text-muted-body leading-relaxed whitespace-pre-line">
              {parent.descriptionLong || parent.description}
            </p>
          </Card>
        )}

        {/* Clinical Use Cases */}
        {clinicalUseCases.length > 0 && (
          <Card className="p-8 mb-8 bg-cream-alt border-cream-border">
            <h2 className="text-2xl md:text-3xl font-fraunces font-light text-ink mb-4">Clinical Use Cases</h2>
            <ul className="space-y-3">
              {clinicalUseCases.map((useCase, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span className="text-muted-body leading-relaxed">{useCase}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Specifications */}
        {selectedVariant.specifications && (
          <Card className="p-8 mb-8 bg-cream-alt border-cream-border">
            <h2 className="text-2xl md:text-3xl font-fraunces font-light text-ink mb-4">Specifications</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {Object.entries(JSON.parse(selectedVariant.specifications || '{}')).map(([key, value], index) => (
                    <tr key={key} className={index % 2 === 0 ? 'border-b border-cream-border' : 'border-b border-cream-border bg-cream'}>
                      <td className="py-3 px-4 font-medium capitalize text-ink">{key.replace(/_/g, ' ')}</td>
                      <td className="py-3 px-4 text-muted-body">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* SEO Content Sections (for products with enhanced content) */}
        <ProductSEOContent productSlug={parent.slug} />
      </main>

      {/* Footer (shown when SEO content is present) */}
      {hasProductSEOContent(parent.slug) && <Footer />}
    </div>
  );
}
