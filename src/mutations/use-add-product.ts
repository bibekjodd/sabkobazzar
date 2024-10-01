import { backendUrl } from '@/lib/constants';
import { AddProductSchema } from '@/lib/form-schemas';
import { extractErrorMessage, uploadImage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { updateProduct } from './use-update-product';

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['add-product'],
    mutationFn: addProduct,
    onMutate() {
      toast.dismiss();
      toast.loading('Adding new product...');
    },
    onSuccess(product) {
      toast.dismiss();
      toast.success('Added new product successfully');
      queryClient.setQueryData<Product>(['product', product.id], { ...product });
    },
    onError(err) {
      toast.dismiss();
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

    uploadedImage && updateProduct({ id: addedProduct.id, image: uploadedImage });
    return { ...addedProduct, image: uploadedImage || addedProduct.image };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
