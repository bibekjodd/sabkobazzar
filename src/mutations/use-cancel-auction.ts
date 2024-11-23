import { backendUrl } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { auctionsKey } from '@/queries/use-auctions';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const cancelAuctionKey = (auctionId: string) => ['cancel-auction', auctionId];

export const useCancelAuction = (auctionId: string) => {
  const queryClient = getQueryClient();
  const profile = queryClient.getQueryData<User>(['profile']);

  return useMutation({
    mutationKey: cancelAuctionKey(auctionId),
    mutationFn: () => cancelAuction(auctionId),

    onSuccess() {
      toast.success('Auction cancelled successfully');
    },

    onError(err) {
      toast.error(`Could not cancel auction! ${err.message}`);
    },

    onSettled() {
      queryClient.invalidateQueries({
        queryKey: auctionsKey({ owner: profile?.id })
      });
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
