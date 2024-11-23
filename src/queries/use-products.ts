import { SearchProductsParams } from '@/components/filter-products';
import { backendUrl } from '@/lib/constants';
import { extractErrorMessage, getSearchString } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export type KeyOptions = Partial<SearchProductsParams> & { owner?: string | null };
export const productsKey = (filterOptions: KeyOptions) => [
  'products',
  {
    title: filterOptions.title,
    category: filterOptions.category === 'all' ? undefined : filterOptions.category,
    pricegte: filterOptions.pricegte,
    pricelte: filterOptions.pricelte,
    owner: filterOptions.owner,
    sort: filterOptions.sort
  } satisfies Partial<Required<KeyOptions>>
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
