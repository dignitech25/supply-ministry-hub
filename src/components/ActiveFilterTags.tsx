import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface ActiveFilter {
  type: 'search' | 'category' | 'subcategory' | 'brand';
  label: string;
  value: string;
}

interface ActiveFilterTagsProps {
  filters: ActiveFilter[];
  onRemoveFilter: (type: string, value: string) => void;
  onClearAll: () => void;
}

export function ActiveFilterTags({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFilterTagsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="mb-6 pb-4 border-b">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>
        {filters.map((filter, index) => (
          <Badge
            key={`${filter.type}-${filter.value}-${index}`}
            variant="secondary"
            className="pl-3 pr-1 py-1 flex items-center gap-1"
          >
            <span className="text-xs">
              {filter.type === 'search' ? `"${filter.label}"` : filter.label}
            </span>
            <button
              onClick={() => onRemoveFilter(filter.type, filter.value)}
              className="ml-1 rounded-full hover:bg-muted p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7 text-xs"
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}
