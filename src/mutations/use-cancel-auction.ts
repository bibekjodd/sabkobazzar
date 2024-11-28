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
      const updatedAuction: Auction = { ...auction, isCancelled: true };
      queryClient.setQueryData<Auction>(auctionKey(auctionId), updatedAuction);
    },

    onError(err) {
      toast.error(`Could not cancel auction! ${err.message}`);
      queryClient.invalidateQueries({ queryKey: auctionKey(auctionId) });
    }
  });
};

const cancelAuction = async (auctionId: string) => {
  try {
    return await axios.put(`${backendUrl}/api/auctions/${auctionId}/cancel`, undefined, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
