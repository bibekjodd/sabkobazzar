import { auctionKey, fetchAuction } from '@/queries/use-auction';
import { auctionsKey, fetchAuctions } from '@/queries/use-auctions';
import { auctionsStatsKey, fetchAuctionsStats } from '@/queries/use-auctions-stats';
import { fetchProduct, productKey } from '@/queries/use-product';
import { fetchProducts, productsKey } from '@/queries/use-products';
import { fetchProductsStats, productsStatsKey } from '@/queries/use-products-stats';
import { profileKey } from '@/queries/use-profile';
import { getQueryClient } from './query-client';

export const prefetchProduct = (product: Product | string) => {
  const queryClient = getQueryClient();
  if (typeof product !== 'string') {
    queryClient.setQueryData<Product>(productKey(product.id), { ...product });
    return;
  }

  if (queryClient.getQueryData(productKey(product))) return;
  queryClient.prefetchQuery({
    queryKey: productKey(product),
    queryFn: ({ signal }) => fetchProduct({ productId: product, signal })
  });
};

export const prefetchAuction = (auction: Auction | string) => {
  const queryClient = getQueryClient();
  if (typeof auction !== 'string') {
    queryClient.setQueryData<Auction>(auctionKey(auction.id), { ...auction });
    return;
  }

  if (queryClient.getQueryData(auctionKey(auction))) return;
  queryClient.prefetchQuery({
    queryKey: auctionKey(auction),
    queryFn: ({ signal }) => fetchAuction({ auctionId: auction, signal })
  });
};

export const prefetchProducts = () => {
  const queryClient = getQueryClient();
  if (queryClient.getQueryData(productsKey({}))) return;
  queryClient.prefetchInfiniteQuery({
    queryKey: productsKey({}),
    initialPageParam: undefined,
    queryFn: ({ signal, pageParam }) => fetchProducts({ cursor: pageParam, signal })
  });
};

export const prefetchDashboardData = () => {
  const queryClient = getQueryClient();
  if (!queryClient.getQueryData(auctionsStatsKey))
    queryClient.prefetchQuery({ queryKey: auctionsStatsKey, queryFn: fetchAuctionsStats });

  if (!queryClient.getQueryData(productsStatsKey))
    queryClient.prefetchQuery({ queryKey: productsStatsKey, queryFn: fetchProductsStats });
};

export const prefetchDashboardAuctions = () => {
  const queryClient = getQueryClient();
  const profile = queryClient.getQueryData<UserProfile>(profileKey);
  if (!profile) return;

  if (queryClient.getQueryData(auctionsKey({ owner: profile.id }))) return;
  queryClient.prefetchInfiniteQuery({
    queryKey: auctionsKey({ owner: profile.id }),
    queryFn: ({ signal }) => fetchAuctions({ signal, cursor: undefined, owner: profile.id }),
    initialPageParam: undefined
  });
};

export const prefetchDashboardProducts = () => {
  const queryClient = getQueryClient();
  const profile = queryClient.getQueryData<UserProfile>(profileKey);
  if (!profile) return;

  if (queryClient.getQueryData(productsKey({ owner: profile.id }))) return;
  queryClient.prefetchInfiniteQuery({
    queryKey: productsKey({ owner: profile.id }),
    queryFn: ({ signal }) => fetchProducts({ signal, cursor: undefined }),
    initialPageParam: undefined
  });
};
