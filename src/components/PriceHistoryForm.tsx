
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type PriceHistoryFormProps = {
  isOpen: boolean;
  onClose: () => void;
  prodcode: string;
  onSaved: () => void;
  existingPrice?: {
    effdate: string;
    unitprice: number;
  };
};

export function PriceHistoryForm({ 
  isOpen,
  onClose,
  prodcode,
  existingPrice,
  onSaved
}: PriceHistoryFormProps) {
  const [effdate, setEffdate] = useState(existingPrice?.effdate || "");
  const [unitprice, setUnitprice] = useState(existingPrice?.unitprice?.toString() || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!effdate || !unitprice) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    try {
      const price = {
        prodcode,
        effdate,
        unitprice: parseFloat(unitprice),
      };

      const { error } = existingPrice
        ? await supabase
            .from('pricehist')
            .update(price)
            .eq('prodcode', prodcode)
            .eq('effdate', existingPrice.effdate)
        : await supabase
            .from('pricehist')
            .insert(price);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Price ${existingPrice ? 'updated' : 'added'} successfully`,
      });
      
      onSaved();
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingPrice ? 'Edit Price History' : 'Add Price History'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="effdate" className="text-right">
              Effectivity Date
            </label>
            <Input
              id="effdate"
              type="date"
              value={effdate}
              onChange={(e) => setEffdate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="unitprice" className="text-right">
              Unit Price
            </label>
            <Input
              id="unitprice"
              type="number"
              step="0.01"
              value={unitprice}
              onChange={(e) => setUnitprice(e.target.value)}
              className="col-span-3"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {existingPrice ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
