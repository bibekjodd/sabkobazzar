import { backendUrl } from '@/lib/constants';
import { AddProductSchema } from '@/lib/form-schemas';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage, uploadImage } from '@/lib/utils';
import { productKey } from '@/queries/use-product';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const updateProductKey = (productId: string) => ['update-product', productId];

export const useUpdateProduct = (productId: string) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: updateProductKey(productId),
    mutationFn: (
      data: Partial<AddProductSchema> & {
        image: string | File | null;
      }
    ) => updateProduct({ ...data, productId }),

    onSuccess(product) {
      toast.success('Updated product successfully....');
      queryClient.setQueryData<Product>(productKey(product.id), { ...product });
    },
    onError(err) {
      toast.error(`Could not update product! ${err.message}`);
      queryClient.invalidateQueries({ queryKey: productKey(productId) });
    }
  });
};

export const updateProduct = async ({
  image,
  productId,
  ...data
}: Partial<AddProductSchema> & {
  productId: string;
  image?: string | File | null;
}): Promise<Product> => {
  try {
    const uploadImagePromise = image instanceof File ? uploadImage(image) : undefined;
    const updateProductPromise = axios
      .put<{ product: Product }>(
        `${backendUrl}/api/products/${productId}`,
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
    if (uploadedImage) updateProduct({ productId, image: uploadedImage });
    return { ...updatedProduct, image: uploadedImage || updatedProduct.image };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
