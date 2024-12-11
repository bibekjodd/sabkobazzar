import { backendUrl } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { notificationsKey } from '@/queries/use-notifications';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const joinAuctionKey = (auctionId: string) => ['join-auction', auctionId];
export const useJoinAuction = (auctionId: string) => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: joinAuctionKey(auctionId),
    mutationFn: () => joinAuction(auctionId),

    onSuccess(auction) {
      toast.success('Joined auction successfully');
      queryClient.setQueryData<Auction>(auctionKey(auction.id), auction);
      queryClient.invalidateQueries({ queryKey: notificationsKey });
    },

    onError(err) {
      toast.error(`Could not join auction! ${extractErrorMessage(err)}`);
      queryClient.invalidateQueries({ queryKey: auctionKey(auctionId) });
    }
  });
};

const joinAuction = async (auctionId: string): Promise<Auction> => {
  const res = await axios.put<{ auction: Auction }>(
    `${backendUrl}/api/auctions/${auctionId}/join`,
    undefined,
    {
      withCredentials: true
    }
  );
  return res.data.auction;
};
