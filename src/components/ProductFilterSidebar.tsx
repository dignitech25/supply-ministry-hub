import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ProductFilterSidebarProps {
  // Search
  searchTerm: string;
  onSearchChange: (value: string) => void;
  
  // Categories (checkboxes)
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  
  // Subcategories (checkboxes, conditionally shown)
  subcategories: string[];
  selectedSubcategories: string[];
  onSubcategoryToggle: (subcategory: string) => void;
  
  // Brands (checkboxes)
  brands: string[];
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;
  
  // Sort
  sortBy: string;
  onSortChange: (value: string) => void;
  
  // Clear all
  onClearAll: () => void;
  activeFilterCount: number;
}

export function ProductFilterSidebar({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategories,
  onCategoryToggle,
  subcategories,
  selectedSubcategories,
  onSubcategoryToggle,
  brands,
  selectedBrands,
  onBrandToggle,
  sortBy,
  onSortChange,
  onClearAll,
  activeFilterCount,
}: ProductFilterSidebarProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [subcategoriesOpen, setSubcategoriesOpen] = useState(true);
  const [brandsOpen, setBrandsOpen] = useState(true);

  return (
    <div className="bg-card rounded-xl border shadow-sm p-4 sticky top-4 max-h-[calc(100vh-2rem)]">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2">Filters</h3>
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClearAll}
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All ({activeFilterCount})
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-6 pr-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categories */}
            <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                <label className="text-sm font-medium">Categories</label>
                <ChevronDown className={`h-4 w-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-2 mt-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => onCategoryToggle(category)}
                      />
                      <label
                        htmlFor={`cat-${category}`}
                        className="text-sm leading-none cursor-pointer flex-1"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Subcategories (conditionally shown) */}
            {subcategories.length > 0 && (
              <Collapsible open={subcategoriesOpen} onOpenChange={setSubcategoriesOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                  <label className="text-sm font-medium">Subcategories</label>
                  <ChevronDown className={`h-4 w-4 transition-transform ${subcategoriesOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 mt-2">
                    {subcategories.map((subcategory) => (
                      <div key={subcategory} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sub-${subcategory}`}
                          checked={selectedSubcategories.includes(subcategory)}
                          onCheckedChange={() => onSubcategoryToggle(subcategory)}
                        />
                        <label
                          htmlFor={`sub-${subcategory}`}
                          className="text-sm leading-none cursor-pointer flex-1"
                        >
                          {subcategory}
                        </label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Brands */}
            <Collapsible open={brandsOpen} onOpenChange={setBrandsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                <label className="text-sm font-medium">Brands</label>
                <ChevronDown className={`h-4 w-4 transition-transform ${brandsOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-2 mt-2">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => onBrandToggle(brand)}
                      />
                      <label
                        htmlFor={`brand-${brand}`}
                        className="text-sm leading-none cursor-pointer flex-1"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={onSortChange}>
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
        </ScrollArea>
      </div>
    </div>
  );
}
