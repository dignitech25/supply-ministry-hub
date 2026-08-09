import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductSearch from "@/components/ProductSearch";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Mobile search surface.
 *
 * This used to hold its own search implementation that queried raw variant
 * rows, so "bed" could return eight rows that were all the same product in
 * different sizes, and it never recorded what anyone searched for. It now wraps
 * the same family-level component the header uses, so there is one search
 * behaviour to reason about and one place to fix.
 */
export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[520px] gap-0 p-4">
      <DialogHeader className="pb-3">
        <DialogTitle className="font-geist text-lg font-medium">Search products</DialogTitle>
      </DialogHeader>
      <ProductSearch
        source="mobile"
        variant="dialog"
        autoFocus
        onNavigate={() => onOpenChange(false)}
      />
    </DialogContent>
  </Dialog>
);

export default SearchDialog;
