import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const productKey = (productId: string) => ['product', productId];
export const useProduct = (productId: string, queryOptions?: Partial<UseQueryOptions<Product>>) => {
  return useQuery({
    queryKey: productKey(productId),
    queryFn: ({ signal }) => fetchProduct({ productId, signal }),
    ...queryOptions
  });
};

type Options = { productId: string; signal: AbortSignal | undefined };
export const fetchProduct = async ({ productId, signal }: Options): Promise<Product> => {
  try {
    const url = `${backendUrl}/api/products/${productId}`;
    const { data } = await axios.get(url, { withCredentials: true, signal });
    return data.product;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
