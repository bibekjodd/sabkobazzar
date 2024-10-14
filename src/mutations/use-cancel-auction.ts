import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useCancelAuction = (auctionId: string) => {
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData<User>(['profile']);

  return useMutation({
    mutationKey: ['cancel-auction', auctionId],
    mutationFn: () => cancelAuction(auctionId),

    onMutate() {
      toast.dismiss();
      toast.loading('Cancelling auction...');
    },

    onSuccess() {
      toast.dismiss();
      toast.success('Auction cancelled successfully');
    },

    onError(err) {
      toast.dismiss();
      toast.error(`Could not cancel auction! ${err.message}`);
    },

    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ['auctions', { ownerId: profile?.id, productId: null, order: 'asc' }]
      });
    }
  });
};

const cancelAuction = async (auctionId: string) => {
  try {
    return axios.put(`${backendUrl}/api/auctions/${auctionId}/cancel`, undefined, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
