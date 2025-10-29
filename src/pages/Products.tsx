import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Navigation from '@/components/Navigation';
import { ProductFilterSidebar } from '@/components/ProductFilterSidebar';
import { ActiveFilterTags, ActiveFilter } from '@/components/ActiveFilterTags';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams, Link } from 'react-router-dom';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';

import { formatPrice } from '@/utils/productHelpers';
import { groupIntoParents } from '@/utils/variantHelpers';

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
  const isMobile = useIsMobile();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category')?.split(',').filter(Boolean) || []
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    searchParams.get('subcategory')?.split(',').filter(Boolean) || []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brand')?.split(',').filter(Boolean) || []
  );
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

  // Fetch subcategories when categories change
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategories.length === 0) {
        setFilterOptions(prev => ({ ...prev, subcategories: [] }));
        setSelectedSubcategories([]);
        return;
      }

      const { data } = await supabase
        .from('products_categorized' as any)
        .select('subcategory')
        .in('top_level_category', selectedCategories)
        .not('subcategory', 'is', null) as { data: any[] | null };

      const uniqueSubcategories = Array.from(
        new Set((data || []).map(p => p.subcategory).filter(Boolean))
      ) as string[];

      setFilterOptions(prev => ({ ...prev, subcategories: uniqueSubcategories.sort() }));
    };

    fetchSubcategories();
  }, [selectedCategories]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, selectedCategories, selectedSubcategories, selectedBrands, sortBy, currentPage]);

  // Update URL params when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedCategories.length > 0) params.category = selectedCategories.join(',');
    if (selectedSubcategories.length > 0) params.subcategory = selectedSubcategories.join(',');
    if (selectedBrands.length > 0) params.brand = selectedBrands.join(',');
    if (sortBy !== 'recent') params.sort = sortBy;
    if (currentPage > 1) params.page = currentPage.toString();
    setSearchParams(params);
  }, [debouncedSearch, selectedCategories, selectedSubcategories, selectedBrands, sortBy, currentPage]);

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
      if (selectedCategories.length > 0) {
        query = query.in('top_level_category', selectedCategories);
      }
      if (selectedSubcategories.length > 0) {
        query = query.in('subcategory', selectedSubcategories);
      }
      if (selectedBrands.length > 0) {
        query = query.in('brand', selectedBrands);
      }

      // Fetch all data in batches (PostgREST has 1000 row limit per request)
      let allData: any[] = [];
      const batchSize = 1000;
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const batchQuery = query.range(offset, offset + batchSize - 1);
        const { data, error } = await batchQuery as { data: any[] | null; error: any };
        
        if (error) {
          console.error('Fetch error:', error);
          throw error;
        }

        if (data && data.length > 0) {
          allData = [...allData, ...data];
          hasMore = data.length === batchSize;
          offset += batchSize;
        } else {
          hasMore = false;
        }
      }

      console.log(`✅ Fetched ${allData.length} total variants`);
      
      // Group variants into parent products
      const parentMap = groupIntoParents(allData);
      let displayProducts: DisplayProduct[] = Array.from(parentMap.values()).map(parent => ({
        slug: parent.slug,
        baseName: parent.baseName,
        brand: parent.brand,
        category: parent.category || '',
        subcategory: parent.subcategory || '',
        imageUrl: parent.defaultVariant.imageUrl || null,
        fromPrice: parent.fromPrice,
        variantCount: parent.variants.length,
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
      
      console.log(`Displaying ${displayProducts.length} parent products (from ${allData.length} variants)`);
      
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

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcategory) 
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    );
    setCurrentPage(1);
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handleRemoveFilter = (type: string, value: string) => {
    switch(type) {
      case 'search':
        setSearchTerm('');
        setDebouncedSearch('');
        break;
      case 'category':
        setSelectedCategories(prev => prev.filter(c => c !== value));
        break;
      case 'subcategory':
        setSelectedSubcategories(prev => prev.filter(s => s !== value));
        break;
      case 'brand':
        setSelectedBrands(prev => prev.filter(b => b !== value));
        break;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedBrands([]);
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
    selectedCategories.length > 0,
    selectedSubcategories.length > 0,
    selectedBrands.length > 0,
  ].filter(Boolean).length;

  // Build active filters array for display
  const activeFilters: ActiveFilter[] = [
    ...(searchTerm ? [{ type: 'search' as const, label: searchTerm, value: searchTerm }] : []),
    ...selectedCategories.map(cat => ({ type: 'category' as const, label: cat, value: cat })),
    ...selectedSubcategories.map(sub => ({ type: 'subcategory' as const, label: sub, value: sub })),
    ...selectedBrands.map(brand => ({ type: 'brand' as const, label: brand, value: brand })),
  ];

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

        {/* Mobile Filter Button */}
        {isMobile && (
          <div className="mb-4">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <ProductFilterSidebar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  categories={filterOptions.categories}
                  selectedCategories={selectedCategories}
                  onCategoryToggle={handleCategoryToggle}
                  subcategories={filterOptions.subcategories}
                  selectedSubcategories={selectedSubcategories}
                  onSubcategoryToggle={handleSubcategoryToggle}
                  brands={filterOptions.brands}
                  selectedBrands={selectedBrands}
                  onBrandToggle={handleBrandToggle}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  onClearAll={handleClearFilters}
                  activeFilterCount={activeFilterCount}
                />
              </SheetContent>
            </Sheet>
          </div>
        )}

        {/* Two-column layout: Sidebar + Content */}
        <div className="flex gap-6">
          {/* Left Sidebar - Desktop only */}
          {!isMobile && (
            <aside className="w-64 flex-shrink-0">
              <ProductFilterSidebar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categories={filterOptions.categories}
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
                subcategories={filterOptions.subcategories}
                selectedSubcategories={selectedSubcategories}
                onSubcategoryToggle={handleSubcategoryToggle}
                brands={filterOptions.brands}
                selectedBrands={selectedBrands}
                onBrandToggle={handleBrandToggle}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onClearAll={handleClearFilters}
                activeFilterCount={activeFilterCount}
              />
            </aside>
          )}

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            {/* Active Filter Tags */}
            <ActiveFilterTags
              filters={activeFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearFilters}
            />

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
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
