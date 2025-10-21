import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';

interface Product {
  id: string;
  sku: string;
  title: string;
  brand: string;
  product_type: string;
  subtype: string;
  price_rrp?: number;
  price_discounted?: number;
  image_url?: string;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'all');
  const [selectedSubtype, setSelectedSubtype] = useState<string>(searchParams.get('subtype') || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('brand') || 'all');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'recent');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let allProducts: Product[] = [];
      let from = 0;
      const batchSize = 1000;
      
      while (true) {
        const { data, error } = await supabase
          .from('products')
          .select('id, sku, title, brand, product_type, subtype, price_rrp, price_discounted, image_url')
          .order('created_at', { ascending: false })
          .range(from, from + batchSize - 1);

        if (error) throw error;
        if (!data || data.length === 0) break;
        
        allProducts = [...allProducts, ...data];
        
        if (data.length < batchSize) break; // Last batch
        from += batchSize;
      }
      
      setProducts(allProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique filter values
  const filterOptions = useMemo(() => {
    const types = new Set<string>();
    const subtypes = new Set<string>();
    const brands = new Set<string>();

    products.forEach(product => {
      if (product.product_type) types.add(product.product_type);
      if (product.subtype) subtypes.add(product.subtype);
      if (product.brand) brands.add(product.brand);
    });

    return {
      types: Array.from(types).sort(),
      subtypes: Array.from(subtypes).sort(),
      brands: Array.from(brands).sort(),
    };
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = searchTerm === '' || 
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'all' || product.product_type === selectedType;
      const matchesSubtype = selectedSubtype === 'all' || product.subtype === selectedSubtype;
      const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;

      return matchesSearch && matchesType && matchesSubtype && matchesBrand;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.price_discounted || a.price_rrp || 0) - (b.price_discounted || b.price_rrp || 0);
        case 'price-desc':
          return (b.price_discounted || b.price_rrp || 0) - (a.price_discounted || a.price_rrp || 0);
        case 'brand-az':
          return (a.brand || '').localeCompare(b.brand || '');
        default:
          return 0; // Keep original order (recent)
      }
    });

    return filtered;
  }, [products, searchTerm, selectedType, selectedSubtype, selectedBrand, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedSubtype('all');
    setSelectedBrand('all');
    setSortBy('recent');
    setSearchParams({});
  };

  const activeFilterCount = [
    searchTerm !== '',
    selectedType !== 'all',
    selectedSubtype !== 'all',
    selectedBrand !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Product Catalogue</h1>
          <p className="text-muted-foreground text-lg">
            Browse our complete range of assistive technology solutions
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border shadow-sm p-6 mb-8">
          <div className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, brand, or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {filterOptions.types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subtype</label>
                <Select value={selectedSubtype} onValueChange={setSelectedSubtype}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Subtypes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subtypes</SelectItem>
                    {filterOptions.subtypes.map((subtype) => (
                      <SelectItem key={subtype} value={subtype}>
                        {subtype}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {filterOptions.brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="brand-az">Brand: A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters & Clear */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
                <Badge variant="secondary">
                  {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> of{' '}
            <span className="font-semibold text-foreground">{products.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border">
            <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
            {activeFilterCount > 0 && (
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
