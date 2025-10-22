import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuote } from "@/contexts/QuoteContext";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, FileText, Minus, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductVariant {
  sku: string;
  handle: string;
  title: string;
  brand: string;
  description_long: string;
  description_short: string;
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

const ProductDetailNew = () => {
  const { handle } = useParams<{ handle: string }>();
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [lineNotes, setLineNotes] = useState("");
  const { addItem } = useQuote();
  const { toast } = useToast();

  // Fetch all variants for this handle
  useEffect(() => {
    const fetchVariants = async () => {
      if (!handle) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("product_catagorized")
        .select("*")
        .eq("handle", handle)
        .order("size_normalized", { ascending: true, nullsFirst: false });

      if (error) {
        console.error("Error fetching variants:", error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setVariants(data);
        setSelectedVariant(data[0]);
      }
      setLoading(false);
    };

    fetchVariants();
  }, [handle]);

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
      brandName: selectedVariant.brand || "",
      smSku: selectedVariant.sku,
      primaryImageUrl: selectedVariant.image_url || undefined,
      unitPrice,
      quantity,
      lineNotes,
    });

    toast({
      title: "Added to quote",
      description: `${selectedVariant.title} has been added to your quote.`,
    });

    setQuantity(1);
    setLineNotes("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedVariant) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Product not found.</p>
        </div>
      </div>
    );
  }

  const breadcrumbs = selectedVariant.category_path?.split(">").map((s) => s.trim()) || [];
  const displayPrice =
    selectedVariant.price_discounted && selectedVariant.price_discounted.trim() !== ""
      ? `$${selectedVariant.price_discounted}`
      : selectedVariant.price_rrp
      ? `$${selectedVariant.price_rrp}`
      : "Price on request";

  const clinicalUseCases = selectedVariant.clinical_use_case
    ?.split("|")
    .map((c) => c.trim())
    .filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/shop" className="hover:text-foreground">
            Shop
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              <span>{crumb}</span>
            </span>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              {selectedVariant.image_url ? (
                <img
                  src={selectedVariant.image_url}
                  alt={selectedVariant.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{selectedVariant.brand}</p>
              <h1 className="text-3xl font-bold mb-2">{selectedVariant.title}</h1>
              <p className="text-sm text-muted-foreground mb-4">{selectedVariant.subcategory}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <p className="text-2xl font-bold text-primary">{displayPrice}</p>
                {selectedVariant.is_consumable === "Y" && (
                  <Badge variant="secondary">Consumable</Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground">SKU: {selectedVariant.sku}</p>
            </div>

            {/* Variant Selectors */}
            {sizes.length > 1 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Size</label>
                <Select
                  value={selectedVariant.size_normalized || selectedVariant.size || ""}
                  onValueChange={(value) => selectVariant(value, undefined)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
              <div>
                <label className="text-sm font-medium mb-2 block">Color</label>
                <Select
                  value={selectedVariant.color_normalized || ""}
                  onValueChange={(value) => selectVariant(undefined, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color} value={color!}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
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
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
              <Input
                placeholder="Add any special requirements..."
                value={lineNotes}
                onChange={(e) => setLineNotes(e.target.value)}
              />
            </div>

            <Button onClick={handleAddToQuote} size="lg" className="w-full">
              Add to Quote
            </Button>
          </div>
        </div>

        {/* Description */}
        {(selectedVariant.description_long || selectedVariant.description_short) && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {selectedVariant.description_long || selectedVariant.description_short}
            </p>
          </div>
        )}

        {/* Clinical Use Cases */}
        {clinicalUseCases.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Clinical Use Cases</h2>
            <ul className="list-disc list-inside space-y-2">
              {clinicalUseCases.map((useCase, i) => (
                <li key={i} className="text-muted-foreground">
                  {useCase}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specifications */}
        {(selectedVariant.spec_length_mm ||
          selectedVariant.spec_width_mm ||
          selectedVariant.spec_height_mm ||
          selectedVariant.spec_weight_kg ||
          selectedVariant.spec_dimensions_text) && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              {selectedVariant.spec_dimensions_text && (
                <div>
                  <p className="text-sm font-medium">Dimensions</p>
                  <p className="text-muted-foreground">{selectedVariant.spec_dimensions_text}</p>
                </div>
              )}
              {selectedVariant.spec_length_mm && (
                <div>
                  <p className="text-sm font-medium">Length</p>
                  <p className="text-muted-foreground">{selectedVariant.spec_length_mm} mm</p>
                </div>
              )}
              {selectedVariant.spec_width_mm && (
                <div>
                  <p className="text-sm font-medium">Width</p>
                  <p className="text-muted-foreground">{selectedVariant.spec_width_mm} mm</p>
                </div>
              )}
              {selectedVariant.spec_height_mm && (
                <div>
                  <p className="text-sm font-medium">Height</p>
                  <p className="text-muted-foreground">{selectedVariant.spec_height_mm} mm</p>
                </div>
              )}
              {selectedVariant.spec_weight_kg && (
                <div>
                  <p className="text-sm font-medium">Weight</p>
                  <p className="text-muted-foreground">{selectedVariant.spec_weight_kg} kg</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailNew;
