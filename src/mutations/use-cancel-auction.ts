import { backendUrl } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const cancelAuctionKey = (auctionId: string) => ['cancel-auction', auctionId];

export const useCancelAuction = (auctionId: string) => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: cancelAuctionKey(auctionId),
    mutationFn: () => cancelAuction(auctionId),

    onSuccess() {
      toast.success('Auction cancelled successfully');
      const auction = queryClient.getQueryData<Auction>(auctionKey(auctionId));
      if (!auction) return;
      const updatedAuction: Auction = { ...auction, status: 'cancelled' };
      queryClient.setQueryData<Auction>(auctionKey(auctionId), updatedAuction);
    },

    onError(err) {
      toast.error(`Could not cancel auction! ${extractErrorMessage(err)}`);
      queryClient.invalidateQueries({ queryKey: auctionKey(auctionId) });
    }
  });
};

const cancelAuction = async (auctionId: string) => {
  return await axios.put(`${backendUrl}/api/auctions/${auctionId}/cancel`, undefined, {
    withCredentials: true
  });
};
