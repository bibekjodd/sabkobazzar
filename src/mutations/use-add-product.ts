import { backendUrl } from '@/lib/constants';
import { AddProductSchema } from '@/lib/form-schemas';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage, uploadImage } from '@/lib/utils';
import { productKey } from '@/queries/use-product';
import { productsKey } from '@/queries/use-products';
import { profileKey } from '@/queries/use-profile';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { updateProduct } from './use-update-product';

export const addProductKey = ['add-product'];

export const useAddProduct = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: addProductKey,
    mutationFn: addProduct,

    onSuccess(product) {
      toast.success('Added new product successfully');
      queryClient.setQueryData<Product>(productKey(product.id), { ...product });
      const profile = queryClient.getQueryData<UserProfile>(profileKey);
      queryClient.invalidateQueries({ queryKey: productsKey({ owner: profile?.id }) });
    },
    onError(err) {
      toast.error(`Could not add product! ${err.message}`);
    }
  });
};

const addProduct = async ({
  image,
  ...data
}: AddProductSchema & { image: string | null | File }): Promise<Product> => {
  try {
    const uploadImagePromise = image instanceof File ? uploadImage(image) : undefined;
    const addProductPromise = axios
      .post<{
        product: Product;
      }>(
        `${backendUrl}/api/products`,
        { ...data, image: typeof image === 'string' ? image : undefined },
        { withCredentials: true }
      )
      .then((res) => res.data.product);

    const [uploadedImage, addedProduct] = await Promise.all([
      uploadImagePromise,
      addProductPromise
    ]);

    if (uploadedImage) updateProduct({ productId: addedProduct.id, image: uploadedImage });
    return { ...addedProduct, image: uploadedImage || addedProduct.image };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
