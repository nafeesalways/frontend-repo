
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAddProductMutation, useUpdateProductMutation } from '@/redux/api/baseApi';
import type { Product } from '@/redux/api/baseApi';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription, 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Plus, Edit } from 'lucide-react';

interface ProductFormData {
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
}

interface ProductModalProps {
  mode?: 'add' | 'edit';
  product?: Product;
}

export function ProductModal({ mode = 'add', product }: ProductModalProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: product ? {
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    } : {},
  });

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();


  useEffect(() => {
    if (open && mode === 'edit' && product) {
      reset({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
      });
    }
  }, [open, mode, product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      const payload = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        status: 'active' as const
      };

      if (mode === 'edit' && product) {
        await updateProduct({ id: product.id, ...payload }).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await addProduct(payload).unwrap();
        toast.success('Product added successfully!');
      }

      setOpen(false);
      reset();
    } catch (error) {
      toast.error(`Failed to ${mode === 'edit' ? 'update' : 'add'} product`);
    }
  };


  const TriggerButton = mode === 'add' ? (
    <Button>
      <Plus className="mr-2 h-4 w-4" /> Add Product
    </Button>
  ) : (
    <Button variant="ghost" size="icon">
      <Edit className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {TriggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? 'Update the product details below.' 
              : 'Fill in the details below to add a new product to your inventory.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name', { required: true })} />
            {errors.name && <span className="text-xs text-red-500">Name is required</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register('category', { required: true })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" {...register('price', { required: true, min: 0 })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" {...register('stock', { required: true, min: 0 })} />
            </div>
          </div>

          <Button type="submit" disabled={isAdding || isUpdating}>
            {(isAdding || isUpdating) ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              mode === 'edit' ? 'Update Product' : 'Save Product'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
