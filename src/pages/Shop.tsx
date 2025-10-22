import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface GroupedProduct {
  handle: string;
  title: string;
  brand: string;
  subcategory: string;
  top_level_category: string;
  image_url: string | null;
  display_price: string | null;
  variant_count: number;
}

interface FilterOptions {
  categories: string[];
  subcategories: string[];
}

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    subcategories: [],
  });

  const searchTerm = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";
  const selectedSubcategory = searchParams.get("subcategory") || "";

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      const { data: categories } = await supabase
        .from("product_catagorized")
        .select("top_level_category")
        .not("top_level_category", "is", null)
        .order("top_level_category");

      const uniqueCategories = Array.from(
        new Set(categories?.map((p) => p.top_level_category).filter(Boolean))
      ) as string[];

      setFilterOptions((prev) => ({ ...prev, categories: uniqueCategories }));
    };

    fetchFilterOptions();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory) {
        setFilterOptions((prev) => ({ ...prev, subcategories: [] }));
        return;
      }

      const { data } = await supabase
        .from("product_catagorized")
        .select("subcategory")
        .eq("top_level_category", selectedCategory)
        .not("subcategory", "is", null);

      const uniqueSubcategories = Array.from(
        new Set(data?.map((p) => p.subcategory).filter(Boolean))
      ) as string[];

      setFilterOptions((prev) => ({ ...prev, subcategories: uniqueSubcategories }));
    };

    fetchSubcategories();
  }, [selectedCategory]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      let query = supabase
        .from("product_catagorized")
        .select("handle, title, brand, subcategory, top_level_category, image_url, price_discounted, price_rrp");

      if (selectedCategory) {
        query = query.eq("top_level_category", selectedCategory);
      }

      if (selectedSubcategory) {
        query = query.eq("subcategory", selectedSubcategory);
      }

      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,description_long.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
        return;
      }

      // Group by handle
      const grouped = data?.reduce((acc, product) => {
        const key = product.handle;
        if (!acc[key]) {
          acc[key] = {
            handle: product.handle,
            title: product.title,
            brand: product.brand,
            subcategory: product.subcategory,
            top_level_category: product.top_level_category,
            image_url: product.image_url,
            display_price: product.price_discounted || product.price_rrp?.toString() || null,
            variant_count: 0,
          };
        }
        acc[key].variant_count += 1;
        return acc;
      }, {} as Record<string, GroupedProduct>);

      setProducts(Object.values(grouped || {}));
      setLoading(false);
    };

    fetchProducts();
  }, [searchTerm, selectedCategory, selectedSubcategory]);

  const updateSearchParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset subcategory when category changes
    if (key === "category") {
      newParams.delete("subcategory");
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Shop Products</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <aside className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => updateSearchParam("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={(value) => updateSearchParam("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {filterOptions.categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategory && (
              <div>
                <label className="text-sm font-medium mb-2 block">Subcategory</label>
                <Select value={selectedSubcategory} onValueChange={(value) => updateSearchParam("subcategory", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Subcategories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Subcategories</SelectItem>
                    {filterOptions.subcategories.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(searchTerm || selectedCategory || selectedSubcategory) && (
              <button
                onClick={() => setSearchParams({})}
                className="text-sm text-primary hover:underline"
              >
                Clear all filters
              </button>
            )}
          </aside>

          {/* Product Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link key={product.handle} to={`/product/${product.handle}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="aspect-square bg-muted relative">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            No Image
                          </div>
                        )}
                        {product.variant_count > 1 && (
                          <span className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                            {product.variant_count} variants
                          </span>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                        <h3 className="font-semibold mb-1 line-clamp-2">{product.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{product.subcategory}</p>
                        <p className="text-lg font-bold text-primary">
                          {product.display_price ? `$${product.display_price}` : "Price on request"}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
