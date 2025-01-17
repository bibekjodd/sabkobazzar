import {
  EVENTS,
  JoinedAuctionResponse,
  LeftAuctionResponse,
  SendMessageResponse
} from '@/lib/events';
import { onJoinedAuction, onLeftAuction, onPlaceBid, onSentMessage } from '@/lib/events-actions';
import { pusher } from '@/lib/pusher';
import { getQueryClient } from '@/lib/query-client';
import { useLeaveLiveAuction } from '@/mutations/use-leave-live-auction';
import { useNotifyJoinLive } from '@/mutations/use-notify-join-live';
import { auctionKey } from '@/queries/use-auction';
import { useAuctionStore } from '@/stores/use-auction-store';
import { Channel } from 'pusher-js';
import { useEffect, useState } from 'react';

export const useRealtimeAuctionEvents = (auctionId: string) => {
  const isLive = useAuctionStore((state) => state.isLive);
  const [channel, setChannel] = useState<Channel | null>(null);
  const { mutate: notifyLeaveLive } = useLeaveLiveAuction(auctionId);
  const { mutate: notifyJoinLive } = useNotifyJoinLive(auctionId);

  useEffect(() => {
    const queryClient = getQueryClient();
    const auction = queryClient.getQueryData<Auction>(auctionKey(auctionId));
    if (auction?.participationStatus !== 'joined') return;
    notifyJoinLive();
    return () => {
      notifyLeaveLive();
    };
  }, [auctionId, notifyJoinLive, notifyLeaveLive]);

  useEffect(() => {
    if (!isLive) return;
    setChannel(pusher.subscribe(auctionId));
    return () => {
      setChannel(null);
      pusher.unsubscribe(auctionId);
    };
  }, [auctionId, isLive]);

  useEffect(() => {
    if (!channel) return;

    channel.bind(EVENTS.BID, onPlaceBid);

    channel.bind(EVENTS.JOINED_AUCTION, (data: JoinedAuctionResponse) => {
      onJoinedAuction({ auctionId, user: data.user });
    });

    channel.bind(EVENTS.LEFT_AUCTION, (data: LeftAuctionResponse) => {
      onLeftAuction({ auctionId, user: data.user });
    });

    channel.bind(EVENTS.SENT_MESSAGE, (data: SendMessageResponse) => {
      onSentMessage(data);
    });

    return () => {
      channel.unbind_all();
    };
  }, [channel, auctionId]);
  return;
};
