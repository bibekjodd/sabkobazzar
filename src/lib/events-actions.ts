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

export const onJoinedAuction = ({
  queryClient,
  auctionId,
  user
}: {
  queryClient: QueryClient;
  auctionId: string;
  user: User;
}) => {
  const bidsSnapshot = queryClient.getQueryData<Bid[]>(['bids-snapshot', auctionId]);
  if (!bidsSnapshot) return;
  const updatedData: Bid[] = bidsSnapshot.map((bid) => {
    if (bid.bidderId !== user.id) return bid;
    return { ...bid, bidder: user };
  });
  queryClient.setQueryData<Bid[]>(['bids-snapshot', auctionId], updatedData);
};

export const onLeftAuction = ({
  auctionId,
  queryClient,
  user
}: {
  queryClient: QueryClient;
  auctionId: string;
  user: User;
}) => {
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

  const updatedProfile: UserProfile = {
    ...profile,
    totalUnreadNotifications: profile.totalUnreadNotifications + 1
  };
  queryClient.setQueryData<UserProfile>(['profile'], updatedProfile);

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
