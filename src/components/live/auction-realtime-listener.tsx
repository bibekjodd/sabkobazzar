import { EVENTS, JoinedAuctionResponse, LeftAuctionResponse } from '@/lib/events';
import { onJoinedAuction, onLeftAuction, onPlaceBid } from '@/lib/events-actions';
import { pusher } from '@/lib/pusher';
import { useNotifyJoinLive } from '@/mutations/use-notify-join-live';
import { Channel } from 'pusher-js';
import { useEffect, useState } from 'react';

export default function AuctionRealtimeListener({ auctionId }: { auctionId: string }) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const { mutate: notifyJoinLive } = useNotifyJoinLive(auctionId);

  useEffect(() => {
    setChannel(pusher.subscribe(auctionId));
    return () => {
      setChannel(null);
      pusher.unsubscribe(auctionId);
    };
  }, [auctionId]);

  useEffect(notifyJoinLive, [auctionId, notifyJoinLive]);

  useEffect(() => {
    if (!channel) return;

    pusher.bind(EVENTS.BID, onPlaceBid);

    pusher.bind(EVENTS.JOINED_AUCTION, (data: JoinedAuctionResponse) => {
      onJoinedAuction({ auctionId, user: data.user });
    });

    pusher.bind(EVENTS.LEFT_AUCTION, (data: LeftAuctionResponse) => {
      onLeftAuction({ auctionId, user: data.user });
    });

    return () => {
      channel.unbind_all();
    };
  }, [channel, auctionId]);

  return null;
}
