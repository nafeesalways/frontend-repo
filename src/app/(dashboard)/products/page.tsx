'use client';

import { useGetProductsQuery, useDeleteProductMutation } from '@/redux/api/baseApi';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ProductModal } from '@/components/products/ProductModal'; 

export default function ProductsPage() {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6 px-2 sm:px-0"> {/* add padding in small screen*/}
      
     
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Products</h2>
        
        {/* Add Product Modal */}
        <div className="w-full sm:w-auto">
          <ProductModal mode="add" />
        </div>
      </div>

      {isLoading ? (
         <div className="flex justify-center p-10">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      ) : (
        // Responsive Table Container
        <div className="rounded-md border overflow-hidden">
          {/* add overflow-x-auto for scrolling in mobile device */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px] sm:w-auto">Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
           
                  <TableHead className="hidden sm:table-cell">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No products found. Add your first product!
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium whitespace-nowrap">{product.name}</TableCell>
                      <TableCell className="whitespace-nowrap">{product.category}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell className="hidden sm:table-cell">{product.stock}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Edit Modal */}
                          <ProductModal mode="edit" product={product} />

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive h-8 w-8"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
