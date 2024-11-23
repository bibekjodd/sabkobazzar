import { auctionKey, fetchAuction } from '@/queries/use-auction';
import { fetchProduct, productKey } from '@/queries/use-product';
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
