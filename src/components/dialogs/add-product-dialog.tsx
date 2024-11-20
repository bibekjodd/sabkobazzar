'use client';

import { productsCategories } from '@/lib/constants';
import { addProductSchema, AddProductSchema } from '@/lib/form-schemas';
import { imageToDataUri } from '@/lib/utils';
import { addProductKey, useAddProduct } from '@/mutations/use-add-product';
import { updateProductKey, useUpdateProduct } from '@/mutations/use-update-product';
import { zodResolver } from '@hookform/resolvers/zod';
import { AutoAnimate } from '@jodd/auto-animate';
import { useIsMutating } from '@tanstack/react-query';
import { Image as ImageIcon, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

type Props = { children: React.ReactNode; product?: Product };
export default function AddProductDialog({ children, product }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(product?.image || null);
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const pickImage = async () => {
    if (!imagePickerRef.current?.files) return;

    const imageUri = await imageToDataUri(imagePickerRef.current.files[0]);
    setImageUri(imageUri);
  };

  const unpickImage = () => {
    setImageUri(null);
    if (!imagePickerRef.current) return;
    imagePickerRef.current.value = '';
  };

  const {
    formState: { errors },
    handleSubmit,
    register,
    control,
    reset
  } = useForm<AddProductSchema>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      category: 'electronics',
      description: product?.description || undefined,
      price: product?.price,
      title: product?.title
    }
  });
  const { mutate: addProduct } = useAddProduct();
  const { mutate: updateProduct } = useUpdateProduct(product?.id || '');
  const isAddingProduct = !!useIsMutating({ mutationKey: addProductKey });
  const isUpdatingProduct = !!useIsMutating({ mutationKey: updateProductKey(product?.id || '') });

  const resetAndClose = () => {
    reset();
    unpickImage();
    closeButtonRef.current?.click();
  };

  const onSubmit = (data: AddProductSchema) => {
    const imageFile = imagePickerRef.current?.files ? imagePickerRef.current.files[0] : null;
    if (product) {
      updateProduct({ ...data, image: imageFile || product.image }, { onSuccess: resetAndClose });
      return;
    }
    addProduct({ ...data, image: imageFile }, { onSuccess: resetAndClose });
  };

  return (
    <Dialog
      onOpenChange={() => {
        setImageUri(product?.image || null);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col px-0">
        <DialogHeader className="px-6">
          <DialogTitle className="text-center">
            {product ? 'Update product' : 'Add new Product'}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />
        <ScrollArea className="mx-1 flex h-full flex-grow flex-col px-5">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex h-full flex-col space-y-7 px-1 py-2 pb-6"
          >
            <Input
              label="Title"
              id="title"
              placeholder="Enter product title..."
              {...register('title')}
              error={errors.title?.message}
            />
            <Input
              error={errors.price?.message}
              label="Price"
              type="number"
              id="price"
              placeholder="Enter product price..."
              {...register('price')}
            />

            <AutoAnimate className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                {...register('description')}
                id="description"
                placeholder="Product description..."
                rows={10}
                className="scrollbar-thin"
              />
              {errors.description && (
                <p className="text-sm text-rose-500">{errors.description.message}</p>
              )}
            </AutoAnimate>

            <section className="space-y-1">
              <Label htmlFor="image">Pick an image</Label>
              <div
                onClick={() => !imageUri && imagePickerRef.current?.click()}
                className="relative grid aspect-video place-items-center rounded-lg border"
              >
                {imageUri && (
                  <div
                    onClick={unpickImage}
                    className="absolute right-1 top-1 cursor-pointer rounded-full bg-primary/90 p-1 text-black hover:brightness-75"
                  >
                    <X className="size-3.5" />
                  </div>
                )}
                <input
                  type="file"
                  hidden
                  id="image"
                  accept="image/*"
                  className="hidden"
                  ref={imagePickerRef}
                  onChange={pickImage}
                />
                {!imageUri && (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="size-8" />
                    <p className="p-4 text-sm">
                      Provide 16:9 aspect ratio image for better compatibility
                    </p>
                  </div>
                )}
                {imageUri && (
                  <img
                    src={imageUri}
                    alt="selected image"
                    className="aspect-video w-full rounded-lg object-contain"
                  />
                )}
              </div>
            </section>

            <section className="space-y-1">
              <Label htmlFor="category">Choose a category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value === 'all' ? 'others' : value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>

                    <SelectContent>
                      {productsCategories
                        .filter((category) => category.value !== 'all')
                        .map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </section>
          </form>
        </ScrollArea>

        <DialogFooter className="px-6">
          <DialogClose ref={closeButtonRef} className="hidden">
            Close
          </DialogClose>

          <Button
            type="submit"
            className="w-full"
            variant="secondary"
            onClick={handleSubmit(onSubmit)}
            disabled={isAddingProduct || isUpdatingProduct}
            loading={isAddingProduct || isUpdatingProduct}
          >
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
