
import { format } from "date-fns";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

  const handleDelete = async (effdate: string) => {
    const { error } = await supabase
      .from('pricehist')
      .delete()
      .eq('prodcode', product.prodcode)
      .eq('effdate', effdate);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete price",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Price deleted successfully",
    });
    
    fetchPriceHistory();
    onProductUpdated();
  };

  // Fetch price history when dialog opens
  useState(() => {
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
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Price
              </Button>
            </div>
            
            <div className="border rounded-lg">
              <div className="grid grid-cols-4 gap-4 p-2 bg-muted font-medium text-sm">
                <div className="col-span-2">Effectivity Date</div>
                <div>Unit Price</div>
                <div>Actions</div>
              </div>
              {priceHistory.map((price) => (
                <div key={price.effdate} className="grid grid-cols-4 gap-4 p-2 border-t">
                  <div className="col-span-2">
                    {format(new Date(price.effdate), "dd-MMM-yyyy")}
                  </div>
                  <div>${price.unitprice.toFixed(2)}</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(price.effdate)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
