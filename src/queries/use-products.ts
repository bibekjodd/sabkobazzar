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
    queryFn: ({ pageParam, signal }) => fetchProducts({ ...options, pageParam, signal }),

    initialPageParam: undefined as PageParam | undefined,
    getNextPageParam(lastPage) {
      const lastResult = lastPage.at(lastPage.length - 1);
      if (!lastResult) return undefined;

      let cursor: string | undefined = undefined;
      if (options.sort === 'added_at_asc' || options.sort === 'added_at_desc' || !options.sort)
        cursor = lastResult.addedAt;
      else if (options.sort === 'price_asc' || options.sort === 'price_desc')
        cursor = String(lastResult.price);
      else if (options.sort === 'title_asc' || options.sort === 'title_desc')
        cursor = lastResult.title;

      return { cursor, cursorId: lastResult.id };
    }
  });
};

type PageParam = { cursor: string | undefined; cursorId: string | undefined };
type Options = KeyOptions & {
  pageParam: PageParam | undefined;
  signal: AbortSignal | undefined;
};
export const fetchProducts = async ({
  signal,
  pageParam,
  ...options
}: Options): Promise<Product[]> => {
  try {
    const url = new URL(`${backendUrl}/api/products${getSearchString(options)}`);
    if (pageParam?.cursor) url.searchParams.set('cursor', pageParam.cursor);
    if (pageParam?.cursorId) url.searchParams.set('cursorId', pageParam.cursorId);

    const { data } = await axios.get(url.href, { withCredentials: true, signal });
    return data.products;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
