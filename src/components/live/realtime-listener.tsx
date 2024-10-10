import { BidResponse, EVENTS } from '@/lib/events';
import { updateOnBid } from '@/lib/events-actions';
import { pusher } from '@/lib/pusher';
import { useQueryClient } from '@tanstack/react-query';
import { Channel } from 'pusher-js';
import { useEffect, useState } from 'react';

export default function RealtimeListener({ auctionId }: { auctionId: string }) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setChannel(pusher.subscribe(auctionId));
    return () => {
      setChannel(null);
      pusher.unsubscribe(auctionId);
    };
  }, [auctionId]);

  useEffect(() => {
    if (!channel) return;

    pusher.bind(EVENTS.BID, (data: BidResponse) => {
      updateOnBid({ bid: data.bid, queryClient });
    });

    return () => {
      channel.unbind_all();
    };
  }, [channel, queryClient]);

  return null;
}
