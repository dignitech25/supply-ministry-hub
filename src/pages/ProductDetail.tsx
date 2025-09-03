import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { useQuote } from '@/contexts/QuoteContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description?: string;
  brand_name: string;
  brand_slug: string;
  category_name: string;
  category_slug: string;
  supplier_sku?: string;
  sm_sku: string;
  price_ex_gst?: number;
  featured?: boolean;
}

interface ProductAsset {
  id: string;
  asset_type: string;
  file_url: string;
  file_name?: string;
  is_primary: boolean;
}

interface ProductAttribute {
  id: string;
  attribute_name: string;
  attribute_value: string;
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useQuote();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [assets, setAssets] = useState<ProductAsset[]>([]);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [lineNotes, setLineNotes] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        // Fetch product details
        const { data: productData, error: productError } = await supabase
          .from('public_products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (productError) throw productError;

        // Fetch product assets
        const { data: assetsData, error: assetsError } = await supabase
          .from('product_assets')
          .select('*')
          .eq('product_id', productData.id)
          .order('sort_order');

        if (assetsError) throw assetsError;

        // Fetch product attributes
        const { data: attributesData, error: attributesError } = await supabase
          .from('product_attributes')
          .select('*')
          .eq('product_id', productData.id)
          .order('sort_order');

        if (attributesError) throw attributesError;

        setProduct(productData);
        setAssets(assetsData || []);
        setAttributes(attributesData || []);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToQuote = () => {
    if (!product) return;

    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      brandName: product.brand_name,
      smSku: product.sm_sku,
      primaryImageUrl: images[0]?.file_url,
      unitPrice: product.price_ex_gst,
      quantity,
      lineNotes: lineNotes || undefined,
    });

    toast({
      title: "Added to quote",
      description: `${quantity}x ${product.name} has been added to your quote.`,
    });

    // Reset form
    setQuantity(1);
    setLineNotes('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto animate-pulse">
            <div className="h-4 bg-muted rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
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
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The product you're looking for could not be found.
            </p>
            <Button asChild>
              <Link to="/products">Browse All Products</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const images = assets.filter(asset => asset.asset_type === 'image');
  const pdfs = assets.filter(asset => asset.asset_type === 'pdf');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="pl-0">
              <Link to="/products">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImageIndex]?.file_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image.file_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{product.brand_name}</Badge>
                  {product.featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-muted-foreground">
                  Category: <Link to={`/category/${product.category_slug}`} className="text-primary hover:underline">
                    {product.category_name}
                  </Link>
                </p>
              </div>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">SM SKU:</span>
                  <span>{product.sm_sku}</span>
                </div>
                {product.supplier_sku && (
                  <div className="flex justify-between">
                    <span className="font-medium">Supplier SKU:</span>
                    <span>{product.supplier_sku}</span>
                  </div>
                )}
                {product.price_ex_gst && (
                  <div className="flex justify-between text-lg">
                    <span className="font-medium">Price:</span>
                    <span className="font-bold text-primary">
                      From ${product.price_ex_gst.toFixed(2)} ex GST
                    </span>
                  </div>
                )}
              </div>

              {/* Add to Quote Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add to Quote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Quantity</label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Line Notes (Optional)
                    </label>
                    <Textarea
                      placeholder="Add any specific requirements or notes for this item..."
                      value={lineNotes}
                      onChange={(e) => setLineNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleAddToQuote} className="w-full" size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Quote
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Specifications */}
          {attributes.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attributes.map((attr) => (
                    <div key={attr.id} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{attr.attribute_name}:</span>
                      <span className="text-muted-foreground">{attr.attribute_value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Downloads */}
          {pdfs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pdfs.map((pdf) => (
                    <a
                      key={pdf.id}
                      href={pdf.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{pdf.file_name || 'Download PDF'}</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}