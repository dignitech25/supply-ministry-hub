import React, { useState } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useQuote } from '@/contexts/QuoteContext';
import QuoteForm from './EnhancedQuoteForm';

export const QuoteDrawer: React.FC = () => {
  const { state, removeItem, updateQuantity, updateLineNotes, setDrawerOpen } = useQuote();
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleLineNotesChange = (id: string, notes: string) => {
    updateLineNotes(id, notes);
  };

  if (showQuoteForm) {
    return (
      <Sheet open={state.isOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Request Quote</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <QuoteForm onSuccess={() => setShowQuoteForm(false)} />
            <Button 
              variant="outline" 
              onClick={() => setShowQuoteForm(false)}
              className="w-full mt-4"
            >
              Back to Quote
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={state.isOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Your Quote ({state.items.length} items)</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Your quote is empty</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add products to get started
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      {item.primaryImageUrl && (
                        <img
                          src={item.primaryImageUrl}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-md bg-muted"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight">
                          {item.productName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.brandName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {item.smSku}
                        </p>
                        {item.unitPrice && (
                          <p className="text-sm font-medium">
                            From ${item.unitPrice.toFixed(2)} ex GST
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        className="w-20 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Textarea
                      placeholder="Add line notes (optional)"
                      value={item.lineNotes || ''}
                      onChange={(e) => handleLineNotesChange(item.id, e.target.value)}
                      className="text-sm"
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total Items:</span>
                  <span className="font-medium">
                    {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <Button 
                  onClick={() => setShowQuoteForm(true)}
                  className="w-full"
                  size="lg"
                >
                  Request Quote
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};