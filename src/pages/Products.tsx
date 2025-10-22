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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'all');
  const [selectedSubtype, setSelectedSubtype] = useState<string>(searchParams.get('subtype') || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('brand') || 'all');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'recent');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [totalCount, setTotalCount] = useState(0);
  const [filterOptions, setFilterOptions] = useState({ types: [], subtypes: [], brands: [] });
  
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

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, selectedType, selectedSubtype, selectedBrand, sortBy, currentPage]);

  // Update URL params when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedType !== 'all') params.type = selectedType;
    if (selectedSubtype !== 'all') params.subtype = selectedSubtype;
    if (selectedBrand !== 'all') params.brand = selectedBrand;
    if (sortBy !== 'recent') params.sort = sortBy;
    if (currentPage > 1) params.page = currentPage.toString();
    setSearchParams(params);
  }, [debouncedSearch, selectedType, selectedSubtype, selectedBrand, sortBy, currentPage]);

  const fetchFilterOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('product_type, subtype, brand');

      if (error) throw error;
      
      const types = new Set<string>();
      const subtypes = new Set<string>();
      const brands = new Set<string>();

      data?.forEach(product => {
        if (product.product_type) types.add(product.product_type);
        if (product.subtype) subtypes.add(product.subtype);
        if (product.brand) brands.add(product.brand);
      });

      setFilterOptions({
        types: Array.from(types).sort(),
        subtypes: Array.from(subtypes).sort(),
        brands: Array.from(brands).sort(),
      });
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('id, sku, title, brand, product_type, subtype, price_rrp, price_discounted, image_url', { count: 'exact' });

      // Search filter
      if (debouncedSearch) {
        query = query.or(`title.ilike.%${debouncedSearch}%,brand.ilike.%${debouncedSearch}%,sku.ilike.%${debouncedSearch}%`);
      }

      // Type filter
      if (selectedType !== 'all') {
        query = query.eq('product_type', selectedType);
      }

      // Subtype filter
      if (selectedSubtype !== 'all') {
        query = query.eq('subtype', selectedSubtype);
      }

      // Brand filter
      if (selectedBrand !== 'all') {
        query = query.eq('brand', selectedBrand);
      }

      // Sorting
      switch (sortBy) {
        case 'price-asc':
          query = query.order('price_discounted', { ascending: true, nullsFirst: false })
                       .order('price_rrp', { ascending: true, nullsFirst: false });
          break;
        case 'price-desc':
          query = query.order('price_discounted', { ascending: false, nullsFirst: false })
                       .order('price_rrp', { ascending: false, nullsFirst: false });
          break;
        case 'brand-az':
          query = query.order('brand', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Pagination
      const from = (currentPage - 1) * productsPerPage;
      const to = from + productsPerPage - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;
      
      setProducts(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedType('all');
    setSelectedSubtype('all');
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
                <ProductCard key={product.id} product={product} />
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
