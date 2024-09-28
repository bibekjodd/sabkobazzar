import { backendUrl } from '@/lib/constants';
import { AddProductSchema } from '@/lib/form-schemas';
import { extractErrorMessage, uploadImage } from '@/lib/utils';
import { InfiniteData, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-product', id],
    mutationFn: (
      data: Partial<AddProductSchema> & {
        image: string | File | null;
        queryKey: QueryKey | undefined;
      }
    ) => updateProduct({ ...data, id }),
    onMutate() {
      toast.dismiss();
      toast.loading('Updating product...');
    },
    onSuccess(product, { queryKey }) {
      toast.dismiss();
      toast.success('Updated product successfully....');
      queryClient.setQueryData<Product>(['product', product.id], { ...product });
      if (!queryKey) return;

      const productsData = queryClient.getQueryData<InfiniteData<Product[]>>(queryKey);
      if (!productsData) return;
      const updatedPages: Product[][] = productsData.pages.map((page) =>
        page.map((currentProduct) => {
          if (currentProduct.id !== product.id) return currentProduct;
          return product;
        })
      );
      queryClient.setQueryData<InfiniteData<Product[]>>(queryKey, (data) => {
        if (!data) return undefined;
        return { ...data, pages: updatedPages };
      });
    },
    onError(err) {
      toast.dismiss();
      toast.error(`Could not update product! ${err.message}`);
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    }
  });
};

export const updateProduct = async ({
  image,
  id,
  ...data
}: Partial<AddProductSchema> & { id: string; image?: string | File | null }): Promise<Product> => {
  try {
    const uploadImagePromise = image instanceof File ? uploadImage(image) : undefined;
    const updateProductPromise = axios
      .put<{ product: Product }>(
        `${backendUrl}/api/products/${id}`,
        { ...data, image: typeof image === 'string' ? image : undefined },
        {
          withCredentials: true
        }
      )
      .then((res) => res.data.product);
    const [uploadedImage, updatedProduct] = await Promise.all([
      uploadImagePromise,
      updateProductPromise
    ]);
    uploadedImage && updateProduct({ id, image: uploadedImage });
    return { ...updatedProduct, image: uploadedImage || updatedProduct.image };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
