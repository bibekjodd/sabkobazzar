import { SearchProductsParams } from '@/components/layouts/products-filter-sidebar';
import { backendUrl } from '@/lib/constants';
import { extractErrorMessage, getSearchString } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

type KeyOptions = Partial<SearchProductsParams> & { owner?: string | null };
export const productsKey = (filterOptions: KeyOptions) => [
  'products',
  {
    title: filterOptions.title || null,
    category: filterOptions.category || null,
    pricegte: filterOptions.pricegte || null,
    pricelte: filterOptions.pricelte || null,
    owner: filterOptions.owner || null
  } satisfies Required<KeyOptions>
];
export const useProducts = (options: KeyOptions) => {
  return useInfiniteQuery({
    queryKey: productsKey(options),
    queryFn: ({ pageParam, signal }) => fetchProducts({ ...options, cursor: pageParam, signal }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam(lastPage) {
      return lastPage[lastPage.length - 1]?.addedAt;
    }
  });
};

type Options = KeyOptions & {
  cursor: string | undefined;
  signal: AbortSignal | undefined;
};
export const fetchProducts = async ({ signal, ...options }: Options): Promise<Product[]> => {
  try {
    const url = new URL(`${backendUrl}/api/products?${getSearchString(options)}`);
    const { data } = await axios.get(url.href, { withCredentials: true, signal });
    return data.products;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
