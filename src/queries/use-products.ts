import { SearchProductsParams } from '@/components/filter-products';
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
    owner: filterOptions.owner || null,
    sort: filterOptions.sort || null
  } satisfies Required<KeyOptions>
];
export const useProducts = (options: KeyOptions) => {
  return useInfiniteQuery({
    queryKey: productsKey(options),
    queryFn: ({ pageParam, signal }) => fetchProducts({ ...options, cursor: pageParam, signal }),

    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.cursor
  });
};

type Options = KeyOptions & {
  cursor: string | undefined;
  signal: AbortSignal | undefined;
};
type Result = { cursor: string | undefined; products: Product[] };
export const fetchProducts = async ({ signal, ...options }: Options): Promise<Result> => {
  try {
    const url = new URL(`${backendUrl}/api/products${getSearchString(options)}`);
    const { data } = await axios.get<Result>(url.href, { withCredentials: true, signal });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
