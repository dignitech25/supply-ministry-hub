import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams, Link } from 'react-router-dom';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

import { formatPrice } from '@/utils/productHelpers';

interface DisplayProduct {
  slug: string;
  baseName: string;
  brand: string;
  category: string;
  subcategory: string;
  imageUrl: string | null;
  fromPrice: number | null;
  variantCount: number;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(searchParams.get('subcategory') || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('brand') || 'all');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'recent');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [totalCount, setTotalCount] = useState(0);
  const [filterOptions, setFilterOptions] = useState({ categories: [], subcategories: [], brands: [] });
  
  const productsPerPage = 24;
  const totalPages = Math.ceil(totalCount / productsPerPage);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch filter options once on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory || selectedCategory === 'all') {
        setFilterOptions(prev => ({ ...prev, subcategories: [] }));
        setSelectedSubcategory('all');
        return;
      }

      const { data } = await supabase
        .from('products_categorized' as any)
        .select('subcategory')
        .eq('top_level_category', selectedCategory)
        .not('subcategory', 'is', null) as { data: any[] | null };

      const uniqueSubcategories = Array.from(
        new Set((data || []).map(p => p.subcategory).filter(Boolean))
      ) as string[];

      setFilterOptions(prev => ({ ...prev, subcategories: uniqueSubcategories.sort() }));
    };

    fetchSubcategories();
  }, [selectedCategory]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, selectedCategory, selectedSubcategory, selectedBrand, sortBy, currentPage]);

  // Update URL params when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (selectedSubcategory !== 'all') params.subcategory = selectedSubcategory;
    if (selectedBrand !== 'all') params.brand = selectedBrand;
    if (sortBy !== 'recent') params.sort = sortBy;
    if (currentPage > 1) params.page = currentPage.toString();
    setSearchParams(params);
  }, [debouncedSearch, selectedCategory, selectedSubcategory, selectedBrand, sortBy, currentPage]);

  const fetchFilterOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('products_categorized' as any)
        .select('top_level_category, brand') as { data: any[] | null; error: any };
      
      if (error) throw error;
      
      const categories = new Set<string>();
      const brands = new Set<string>();

      (data || []).forEach(product => {
        if (product.top_level_category) categories.add(product.top_level_category);
        if (product.brand) brands.add(product.brand);
      });

      setFilterOptions({
        categories: Array.from(categories).sort(),
        subcategories: [],
        brands: Array.from(brands).sort(),
      });
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Build query with filters
      let query = supabase
        .from('products_categorized' as any)
        .select('*');
      
      // Apply all filters
      if (debouncedSearch) {
        query = query.or(`title.ilike.%${debouncedSearch}%,brand.ilike.%${debouncedSearch}%,description_long.ilike.%${debouncedSearch}%,sku.ilike.%${debouncedSearch}%`);
      }
      if (selectedCategory !== 'all') {
        query = query.eq('top_level_category', selectedCategory);
      }
      if (selectedSubcategory !== 'all') {
        query = query.eq('subcategory', selectedSubcategory);
      }
      if (selectedBrand !== 'all') {
        query = query.eq('brand', selectedBrand);
      }

      // Fetch all data with high limit
      query = query.limit(10000);

      const { data, error } = await query as { data: any[] | null; error: any };
      
      if (error) {
        console.error('Fetch error:', error);
        throw error;
      }

      const allData = data || [];
      console.log(`✅ Fetched ${allData.length} total products`);
      
      // Convert each SKU to display format (no grouping)
      let displayProducts: DisplayProduct[] = allData.map(product => ({
        slug: product.sku,
        baseName: product.title || 'Untitled Product',
        brand: product.brand || 'Unknown',
        category: product.top_level_category || '',
        subcategory: product.subcategory || '',
        imageUrl: product.image_url || null,
        fromPrice: product.price_discounted || product.price_rrp || null,
        variantCount: 1,
      }));
      
      // Apply sorting
      switch (sortBy) {
        case 'brand-az':
          displayProducts.sort((a, b) => a.brand.localeCompare(b.brand));
          break;
        case 'price-low':
          displayProducts.sort((a, b) => (a.fromPrice || Infinity) - (b.fromPrice || Infinity));
          break;
        case 'price-high':
          displayProducts.sort((a, b) => (b.fromPrice || 0) - (a.fromPrice || 0));
          break;
        default:
          displayProducts.sort((a, b) => a.brand.localeCompare(b.brand) || a.baseName.localeCompare(b.baseName));
      }
      
      console.log(`Displaying ${displayProducts.length} individual products`);
      
      // Apply pagination
      const from_page = (currentPage - 1) * productsPerPage;
      const to_page = from_page + productsPerPage;
      setProducts(displayProducts.slice(from_page, to_page));
      setTotalCount(displayProducts.length);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedBrand('all');
    setSortBy('recent');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = [
    searchTerm !== '',
    selectedCategory !== 'all',
    selectedSubcategory !== 'all',
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
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="all">All Categories</SelectItem>
                    {filterOptions.categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory !== 'all' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subcategory</label>
                  <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Subcategories" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="all">All Subcategories</SelectItem>
                      {filterOptions.subcategories.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
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
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="brand-az">Brand: A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
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
            Showing <span className="font-semibold text-foreground">
              {loading ? '...' : `${products.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1}-${Math.min(currentPage * productsPerPage, totalCount)}`}
            </span> of{' '}
            <span className="font-semibold text-foreground">{loading ? '...' : totalCount}</span> products
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
        ) : products.length === 0 ? (
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {products.map((product) => (
                <Link key={product.slug} to={`/product/${product.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="aspect-square bg-muted relative">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.baseName}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No Image
                        </div>
                      )}
                      {product.variantCount > 1 && (
                        <Badge className="absolute top-2 right-2">
                          {product.variantCount} variants
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                      <h3 className="font-semibold mb-1 line-clamp-2">{product.baseName}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{product.subcategory}</p>
                      <div className="space-y-1">
                        {product.fromPrice !== null ? (
                          <>
                            <p className="text-lg font-bold text-primary">
                              {product.variantCount > 1 ? 'From ' : ''}{formatPrice(product.fromPrice)}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Price on request
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = page === 1 || 
                                    page === totalPages || 
                                    (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                    const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                    if (showEllipsisBefore || showEllipsisAfter) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </main>
    </div>
  );
}
