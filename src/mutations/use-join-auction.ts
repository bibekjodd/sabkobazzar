import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useJoinAuction = (auctionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['join-auction', auctionId],
    mutationFn: () => joinAuction(auctionId),

    onMutate() {
      toast.dismiss();
      toast.loading('Joining auction...');
    },

    onSuccess(auction) {
      toast.dismiss();
      toast.success('Joined auction successfully');
      queryClient.setQueryData<Auction>(['auction', auction.id], auction);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },

    onError(err) {
      toast.dismiss();
      toast.error(`Could not join auction! ${err.message}`);
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
    }
  });
};

const joinAuction = async (auctionId: string): Promise<Auction> => {
  try {
    const res = await axios.put<{ auction: Auction }>(
      `${backendUrl}/api/participants/${auctionId}/join`,
      undefined,
      {
        withCredentials: true
      }
    );
    return res.data.auction;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
