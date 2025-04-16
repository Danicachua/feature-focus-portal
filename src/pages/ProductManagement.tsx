import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ViewProductDialog } from "@/components/ViewProductDialog";
import { ProductForm } from "@/components/ProductForm";
import { toast } from "@/hooks/use-toast";
import { Search, Plus, Trash2 } from "lucide-react";

type Product = {
  prodcode: string;
  description: string;
  unit: string;
  current_price?: number;
};

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data: productsData, error: productsError } = await supabase
        .from('product')
        .select('*');

      if (productsError) throw productsError;

      const productsWithPrices = await Promise.all(
        productsData.map(async (product) => {
          const { data: priceData } = await supabase
            .from('pricehist')
            .select('unitprice, effdate')
            .eq('prodcode', product.prodcode)
            .order('effdate', { ascending: false })
            .limit(1)
            .single();

          return {
            ...product,
            current_price: priceData?.unitprice || 0,
          };
        })
      );

      setProducts(productsWithPrices);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    setShowAddProduct(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleDeleteProduct = async (prodcode: string) => {
    try {
      const { error: priceHistError } = await supabase
        .from('pricehist')
        .delete()
        .eq('prodcode', prodcode);

      if (priceHistError) throw priceHistError;

      const { error: productError } = await supabase
        .from('product')
        .delete()
        .eq('prodcode', prodcode);

      if (productError) throw productError;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      fetchProducts();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  const handleCloseAddProduct = () => {
    setShowAddProduct(false);
  };

  const filteredProducts = products.filter((product) =>
    Object.values(product).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Product Management System</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Product"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={handleAddProduct}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Current Price</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.prodcode}>
                <TableCell>{product.prodcode}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>${product.current_price?.toFixed(2)}</TableCell>
                <TableCell className="space-x-2">
                  <Button 
                    variant="link" 
                    className="text-blue-500 p-0"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="link" 
                    className="text-red-500 p-0"
                    onClick={() => handleDeleteProduct(product.prodcode)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedProduct && (
        <ViewProductDialog
          isOpen={true}
          onClose={handleCloseDialog}
          product={selectedProduct}
          onProductUpdated={fetchProducts}
        />
      )}

      {showAddProduct && (
        <ProductForm
          isOpen={true}
          onClose={handleCloseAddProduct}
          onSaved={fetchProducts}
        />
      )}
    </div>
  );
}
