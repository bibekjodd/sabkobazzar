import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: ({ signal }) => fetchProduct({ id, signal })
  });
};

type Options = { id: string; signal: AbortSignal | undefined };
export const fetchProduct = async ({ id, signal }: Options): Promise<Product> => {
  try {
    const url = `${backendUrl}/api/products/${id}`;
    const { data } = await axios.get(url, { withCredentials: true, signal });
    return data.product;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
