import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { productKey } from '@/queries/use-product';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const interestedKey = (productId: string) => ['interested', productId];

export const useInterested = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: interestedKey(productId),
    mutationFn: (interested: boolean) => updateInterested({ productId, interested }),

    onSuccess(_, interested) {
      const product = queryClient.getQueryData<Product>(['product', productId]);
      if (!product) return;
      const updatedProduct: Product = { ...product, isInterested: interested };
      queryClient.setQueryData<Product>(['product', productId], updatedProduct);
    },
    onError() {
      queryClient.invalidateQueries({ queryKey: productKey(productId) });
    }
  });
};

const updateInterested = async ({
  interested,
  productId
}: {
  interested: boolean;
  productId: string;
}) => {
  try {
    const url = `${backendUrl}/api/products/${productId}/interested`;
    if (interested) {
      return await axios.post(url, undefined, {
        withCredentials: true
      });
    }
    return await axios.delete(url, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
