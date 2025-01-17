import { auctionKey } from '@/queries/use-auction';
import { FetchBidsResult, bidsKey } from '@/queries/use-bids';
import { bidsSnapshotKey } from '@/queries/use-bids-snapshot';
import { FetchNotificationsResult, notificationsKey } from '@/queries/use-notifications';
import { participantsKey } from '@/queries/use-participants';
import { profileKey } from '@/queries/use-profile';
import { useAuctionStore } from '@/stores/use-auction-store';
import { InfiniteData, QueryClient } from '@tanstack/react-query';
import { MILLIS } from './constants';
import { BidResponse, SendMessageResponse } from './events';
import { getQueryClient } from './query-client';

export const onReceivedNotification = ({
  queryClient,
  notification
}: {
  queryClient: QueryClient;
  notification: UserNotification;
}) => {
  const profile = queryClient.getQueryData<UserProfile>(profileKey);
  if (!profile) return;

  queryClient.setQueryData<UserProfile>(profileKey, {
    ...profile,
    totalUnreadNotifications: profile.totalUnreadNotifications + 1
  });
  if (notification.entity === 'auctions' && notification.params) {
    queryClient.invalidateQueries({ queryKey: auctionKey(notification.params) });
    if (notification.type === 'kick')
      queryClient.invalidateQueries({ queryKey: participantsKey(notification.params) });
  }

  const notificationsData =
    queryClient.getQueryData<InfiniteData<FetchNotificationsResult>>(notificationsKey);
  if (!notificationsData) return;
  const firstPage = notificationsData.pages[0] || [];
  const updatedFirstPageNotifications = firstPage.notifications.filter(
    (current) => current.id !== notification.id
  );
  updatedFirstPageNotifications.unshift(notification);

  queryClient.setQueryData<InfiniteData<FetchNotificationsResult>>(notificationsKey, {
    ...notificationsData,
    pages: [
      { cursor: firstPage.cursor, notifications: updatedFirstPageNotifications },
      ...notificationsData.pages.slice(1)
    ]
  });
};

export const onPlaceBid = ({ bid }: BidResponse) => {
  const queryClient = getQueryClient();
  const bidsData = queryClient.getQueryData<InfiniteData<FetchBidsResult>>(
    bidsKey({ auctionId: bid.auctionId })
  );
  if (bidsData) {
    const bidExists = bidsData.pages[0].bids.find((currentBid) => currentBid.id === bid.id);

    if (!bidExists) {
      const updatedFirstPageBids: Bid[] = [bid, ...bidsData.pages[0].bids];
      queryClient.setQueryData<InfiniteData<FetchBidsResult>>(
        bidsKey({ auctionId: bid.auctionId }),
        {
          ...bidsData,
          pages: [
            { cursor: bidsData.pages[0].cursor, bids: updatedFirstPageBids },
            ...bidsData.pages.slice(1)
          ]
        }
      );
    }
  }

  const bidsSnapshotData = queryClient.getQueryData<Bid[]>(bidsSnapshotKey(bid.auctionId));
  if (!bidsSnapshotData) return;
  const updatedBidsSnapshot = bidsSnapshotData.filter(
    (currentBid) => currentBid.bidderId !== bid.bidderId
  );
  updatedBidsSnapshot.push(bid);
  updatedBidsSnapshot.sort((a, b) => b.amount - a.amount);
  queryClient.setQueryData<Bid[]>(bidsSnapshotKey(bid.auctionId), updatedBidsSnapshot);
};

export const onJoinedAuction = ({ auctionId, user }: { auctionId: string; user: User }) => {
  const queryClient = getQueryClient();
  const bidsSnapshot = queryClient.getQueryData<Bid[]>(bidsSnapshotKey(auctionId));
  if (!bidsSnapshot) return;
  const updatedData: Bid[] = bidsSnapshot.map((bid) => {
    if (bid.bidderId !== user.id) return bid;
    return { ...bid, bidder: { ...user, lastOnline: new Date().toISOString() } };
  });
  queryClient.setQueryData<Bid[]>(bidsSnapshotKey(auctionId), updatedData);
};

export const onLeftAuction = ({ auctionId, user }: { auctionId: string; user: User }) => {
  const queryClient = getQueryClient();
  const bidsSnapshot = queryClient.getQueryData<Bid[]>(bidsSnapshotKey(auctionId));
  if (!bidsSnapshot) return;
  const updatedBidsSnapshot: Bid[] = bidsSnapshot.map((bid) => {
    if (bid.bidderId !== user.id) return bid;
    return {
      ...bid,
      bidder: { ...bid.bidder, lastOnline: new Date(Date.now() - 70 * 1000).toISOString() }
    };
  });
  queryClient.setQueryData<Bid[]>(bidsSnapshotKey(auctionId), updatedBidsSnapshot);
};

export const onSentMessage = (responseMessage: SendMessageResponse) => {
  useAuctionStore.setState((state) => ({ liveMessages: [...state.liveMessages, responseMessage] }));
  setTimeout(() => {
    const currentLiveMessages = useAuctionStore.getState().liveMessages;
    const updatedLiveMessages = currentLiveMessages.filter(
      (message) => message.data !== responseMessage.data
    );
    useAuctionStore.setState({ liveMessages: updatedLiveMessages });
  }, MILLIS.SECOND * 3);
};
