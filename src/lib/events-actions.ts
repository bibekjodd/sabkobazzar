import { InfiniteData, QueryClient } from '@tanstack/react-query';

export const updateOnBid = ({ queryClient, bid }: { queryClient: QueryClient; bid: Bid }) => {
  const bidsData = queryClient.getQueryData<InfiniteData<Bid[]>>(['bids', bid.auctionId]);
  if (bidsData) {
    const bidExists = bidsData.pages[0].find((currentBid) => currentBid.id === bid.id);
    if (!bidExists) {
      const updatedFirstPage: Bid[] = [bid, ...bidsData.pages[0]];
      queryClient.setQueryData<InfiniteData<Bid[]>>(['bids', bid.auctionId], {
        ...bidsData,
        pages: [updatedFirstPage, ...bidsData.pages.slice(1)]
      });
    }
  }

  const bidsSnapshotData = queryClient.getQueryData<Bid[]>(['bids-snapshot', bid.auctionId]);
  if (!bidsSnapshotData) return;
  const updatedBidsSnapshot = bidsSnapshotData.filter(
    (currentBid) => currentBid.bidderId !== bid.bidderId
  );
  updatedBidsSnapshot.unshift(bid);
  updatedBidsSnapshot.sort((a, b) => (a.amount > b.amount ? -1 : 1));
  queryClient.setQueryData<Bid[]>(['bids-snapshot', bid.auctionId], updatedBidsSnapshot);
};
