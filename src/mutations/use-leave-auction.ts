import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useLeaveAuction = (auctionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['leave-auction', auctionId],
    mutationFn: () => leaveAuction(auctionId),

    onMutate() {
      toast.dismiss();
      toast.loading('Leaving auction...');
    },

    onSuccess() {
      toast.dismiss();
      toast.success('Left auction successfully');
      const auction = queryClient.getQueryData<Auction>(['auction', auctionId]);
      const profile = queryClient.getQueryData<User>(['profile']);
      if (!auction) return;
      const updatedAuction: Auction = {
        ...auction,
        participants: auction.participants.filter((participant) => participant.id !== profile?.id)
      };
      queryClient.setQueryData<Auction>(['auction', auction.id], updatedAuction);
    },

    onError(err) {
      toast.dismiss();
      toast.error(`Could not leave auction! ${err.message}`);
    },

    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
    }
  });
};

const leaveAuction = async (auctionId: string) => {
  try {
    await axios.put<{ auction: Auction }>(
      `${backendUrl}/api/participants/${auctionId}/leave`,
      undefined,
      {
        withCredentials: true
      }
    );
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
