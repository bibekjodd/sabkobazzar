import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useProducts = (searchString: string) => {
  return useInfiniteQuery({
    queryKey: ['products', searchString],
    queryFn: ({ pageParam, signal }) => fetchProducts({ searchString, cursor: pageParam, signal }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam(lastPage) {
      return lastPage[lastPage.length - 1]?.addedAt;
    }
  });
};

type Options = {
  searchString: string;
  cursor: string | undefined;
  signal: AbortSignal | undefined;
};
export const fetchProducts = async ({
  searchString,
  cursor,
  signal
}: Options): Promise<Product[]> => {
  cursor ||= new Date().toISOString();
  try {
    if (searchString.length) {
      searchString += `&cursor=${cursor}`;
    } else {
      searchString = `?cursor=${cursor}`;
    }
    const url = `${backendUrl}/api/products${searchString}`;
    const { data } = await axios.get(url, { withCredentials: true, signal });
    return data.products;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
