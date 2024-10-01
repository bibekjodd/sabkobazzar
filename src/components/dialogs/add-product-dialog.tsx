'use client';
import { productsCategories } from '@/lib/constants';
import { addProductSchema, AddProductSchema } from '@/lib/form-schemas';
import { imageToDataUri } from '@/lib/utils';
import { useAddProduct } from '@/mutations/use-add-product';
import { useUpdateProduct } from '@/mutations/use-update-product';
import { zodResolver } from '@hookform/resolvers/zod';
import { QueryKey, useIsMutating } from '@tanstack/react-query';
import { Image as ImageIcon, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import AutoAnimate from '../utils/auto-animate';
import { FormInput } from '../utils/form-input';

type Props = { children: React.ReactNode } & (
  | { product?: undefined; queryKey?: undefined }
  | { product: Product; queryKey: QueryKey }
);
export default function AddProductDialog({ children, product, queryKey }: Props) {
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
  const isAddingProduct = !!useIsMutating({ mutationKey: ['add-product'] });
  const isUpdatingProduct = !!useIsMutating({ mutationKey: ['update-product', product?.id] });

  const resetAndClose = () => {
    reset();
    unpickImage();
    closeButtonRef.current?.click();
  };

  const onSubmit = (data: AddProductSchema) => {
    const imageFile = imagePickerRef.current?.files ? imagePickerRef.current.files[0] : null;
    if (product) {
      updateProduct(
        { ...data, image: imageFile || product.image, queryKey },
        { onSuccess: resetAndClose }
      );
      return;
    }
    addProduct({ ...data, image: imageFile }, { onSuccess: resetAndClose });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-full flex-col">
        <DialogHeader>
          <DialogTitle className="text-center">
            {product ? 'Update product' : 'Add new Product'}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full flex-grow flex-col space-y-7 overflow-y-auto px-2 pb-2 scrollbar-thin"
        >
          <FormInput
            error={errors.title?.message}
            Icon={null}
            label="Title"
            id="title"
            placeholder="Enter product title..."
            {...register('title')}
          />
          <FormInput
            error={errors.price?.message}
            Icon={null}
            label="Price"
            type="number"
            id="price"
            placeholder="Enter product price..."
            {...register('price')}
          />

          <section className="space-y-1">
            <Label htmlFor="image">Pick an image</Label>
            <div
              onClick={() => !imageUri && imagePickerRef.current?.click()}
              className="relative grid aspect-video place-items-center rounded-lg border"
            >
              {imageUri && (
                <button
                  onClick={unpickImage}
                  className="absolute right-1 top-1 rounded-full bg-white p-1"
                >
                  <X className="size-4" />
                </button>
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
              {!imageUri && <ImageIcon className="size-6" />}
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

          <AutoAnimate className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              {...register('description')}
              id="description"
              placeholder="Product description..."
              rows={6}
              className="scrollbar-thin"
            />
            {errors.description && (
              <p className="text-sm text-rose-500">{errors.description.message}</p>
            )}
          </AutoAnimate>
        </form>

        <DialogFooter>
          <DialogClose asChild ref={closeButtonRef}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            type="submit"
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
