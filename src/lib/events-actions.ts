import { auctionKey } from '@/queries/use-auction';
import { participantsKey } from '@/queries/use-participants';
import { productKey } from '@/queries/use-product';
import { InfiniteData, QueryClient } from '@tanstack/react-query';
import { BidResponse } from './events';
import { getQueryClient } from './query-client';

export const onPlaceBid = ({ bid }: BidResponse) => {
  const queryClient = getQueryClient();
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
  updatedBidsSnapshot.sort((a, b) => b.amount - a.amount);
  queryClient.setQueryData<Bid[]>(['bids-snapshot', bid.auctionId], updatedBidsSnapshot);
};

export const onJoinedAuction = ({ auctionId, user }: { auctionId: string; user: User }) => {
  const queryClient = getQueryClient();
  const bidsSnapshot = queryClient.getQueryData<Bid[]>(['bids-snapshot', auctionId]);
  if (!bidsSnapshot) return;
  const updatedData: Bid[] = bidsSnapshot.map((bid) => {
    if (bid.bidderId !== user.id) return bid;
    return { ...bid, bidder: user };
  });
  queryClient.setQueryData<Bid[]>(['bids-snapshot', auctionId], updatedData);
};

export const onLeftAuction = ({ auctionId, user }: { auctionId: string; user: User }) => {
  const queryClient = getQueryClient();
  const bidsSnapshot = queryClient.getQueryData<Bid[]>(['bids-snapshot', auctionId]);
  if (!bidsSnapshot) return;
  const updatedBidsSnapshot: Bid[] = bidsSnapshot.map((bid) => {
    if (bid.bidderId !== user.id) return bid;
    return {
      ...bid,
      bidder: { ...bid.bidder, lastOnline: new Date(Date.now() - 70 * 1000).toISOString() }
    };
  });
  queryClient.setQueryData<Bid[]>(['bids-snapshot', auctionId], updatedBidsSnapshot);
};

export const onReceivedNotification = ({
  queryClient,
  notification
}: {
  queryClient: QueryClient;
  notification: UserNotification;
}) => {
  const profile = queryClient.getQueryData<UserProfile>(['profile']);
  if (!profile) return;

  queryClient.setQueryData<UserProfile>(['profile'], {
    ...profile,
    totalUnreadNotifications: profile.totalUnreadNotifications + 1
  });
  if (notification.entity === 'auctions' && notification.params) {
    queryClient.invalidateQueries({ queryKey: auctionKey(notification.params) });
    if (notification.type === 'kick')
      queryClient.invalidateQueries({ queryKey: participantsKey(notification.params) });
  }
  if (notification.entity === 'products' && notification.params) {
    queryClient.invalidateQueries({ queryKey: productKey(notification.params) });
  }

  const notificationsData = queryClient.getQueryData<InfiniteData<UserNotification[]>>([
    'notifications'
  ]);
  if (!notificationsData) return;
  const firstPage = notificationsData.pages[0] || [];
  const updatedFirstPage = firstPage.filter((current) => current.id !== notification.id);
  updatedFirstPage.unshift(notification);

  queryClient.setQueryData<InfiniteData<UserNotification[]>>(['notifications'], {
    ...notificationsData,
    pages: [updatedFirstPage, ...notificationsData.pages.slice(1)]
  });
};
