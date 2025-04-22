import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PriceHistoryForm } from "@/components/PriceHistoryForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type PriceHistory = {
  effdate: string;
  unitprice: number;
};

type ViewProductDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  product: {
    prodcode: string;
    description: string;
    unit: string;
  };
  onProductUpdated: () => void;
};

export function ViewProductDialog({ isOpen, onClose, product, onProductUpdated }: ViewProductDialogProps) {
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [showAddPrice, setShowAddPrice] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<PriceHistory | null>(null);
  const [priceToDelete, setPriceToDelete] = useState<PriceHistory | null>(null);

  const fetchPriceHistory = async () => {
    const { data, error } = await supabase
      .from('pricehist')
      .select('*')
      .eq('prodcode', product.prodcode)
      .order('effdate', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch price history",
      });
      return;
    }

    setPriceHistory(data || []);
  };

  const handleDelete = async (price: PriceHistory) => {
    try {
      const { error } = await supabase
        .from('pricehist')
        .delete()
        .eq('prodcode', product.prodcode)
        .eq('effdate', price.effdate);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Price deleted successfully",
      });
      
      fetchPriceHistory();
      onProductUpdated();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPriceHistory();
    }
  }, [isOpen, product.prodcode]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>View Product</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Product code</span>
            <span className="col-span-3">{product.prodcode}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Description</span>
            <span className="col-span-3">{product.description}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Unit</span>
            <span className="col-span-3">{product.unit}</span>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Price History</h3>
              <Button 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setShowAddPrice(true)}
              >
                <Plus className="h-4 w-4" /> Add Price
              </Button>
            </div>
            
            <div className="border rounded-lg">
              <div className="grid grid-cols-4 gap-4 p-2 bg-muted font-medium text-sm">
                <div className="col-span-2">Effectivity Date</div>
                <div>Unit Price</div>
                <div className="text-right">Actions</div>
              </div>
              {priceHistory.map((price) => (
                <div key={price.effdate} className="grid grid-cols-4 gap-4 p-2 border-t">
                  <div className="col-span-2">
                    {format(new Date(price.effdate), "dd-MMM-yyyy")}
                  </div>
                  <div>${price.unitprice.toFixed(2)}</div>
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-blue-500"
                      onClick={() => setSelectedPrice(price)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => setPriceToDelete(price)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>

      {showAddPrice && (
        <PriceHistoryForm
          isOpen={true}
          onClose={() => setShowAddPrice(false)}
          prodcode={product.prodcode}
          onSaved={() => {
            fetchPriceHistory();
            onProductUpdated();
            setShowAddPrice(false);
          }}
        />
      )}

      {selectedPrice && (
        <PriceHistoryForm
          isOpen={true}
          onClose={() => setSelectedPrice(null)}
          prodcode={product.prodcode}
          existingPrice={selectedPrice}
          onSaved={() => {
            fetchPriceHistory();
            onProductUpdated();
            setSelectedPrice(null);
          }}
        />
      )}

      <AlertDialog open={!!priceToDelete} onOpenChange={() => setPriceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the price history entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (priceToDelete) {
                  handleDelete(priceToDelete);
                  setPriceToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
