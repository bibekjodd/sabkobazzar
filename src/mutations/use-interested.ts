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
    if (interested) {
      return axios.post(`${backendUrl}/api/interests/${productId}`, undefined, {
        withCredentials: true
      });
    }
    return axios.delete(`${backendUrl}/api/interests/${productId}`, { withCredentials: true });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
