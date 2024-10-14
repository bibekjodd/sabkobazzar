import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useInterested = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['interested', productId],
    mutationFn: (interested: boolean) => updateInterested({ productId, interested }),

    onSuccess(_, interested) {
      const product = queryClient.getQueryData<Product>(['product', productId]);
      if (!product) return;
      const updatedProduct: Product = { ...product, isInterested: interested };
      queryClient.setQueryData<Product>(['product', productId], updatedProduct);
    },
    onError() {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    }
  });
};

const updateInterested = ({
  interested,
  productId
}: {
  interested: boolean;
  productId: string;
}) => {
  try {
    const url = `${backendUrl}/api/products/${productId}/interested`;
    if (interested) {
      return axios.post(url, undefined, {
        withCredentials: true
      });
    }
    return axios.delete(url, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
