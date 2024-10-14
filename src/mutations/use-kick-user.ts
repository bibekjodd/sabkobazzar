import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useKickUser = ({ auctionId, userId }: { auctionId: string; userId: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['kick-user', { userId, auctionId }],
    mutationFn: () => kickUser({ auctionId, userId }),
    onError(err) {
      toast.dismiss();
      toast.error(`Could not kick user from the auction! ${err.message}`);
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
    },
    onSuccess() {
      const auctionData = queryClient.getQueryData<Auction>(['auction', auctionId]);
      if (!auctionData) return;
      const updatedAuctionData: Auction = {
        ...auctionData,
        participants: auctionData.participants.filter((participant) => participant.id !== userId)
      };
      queryClient.setQueryData<Auction>(['auction', auctionId], updatedAuctionData);
    }
  });
};

const kickUser = async ({ auctionId, userId }: { auctionId: string; userId: string }) => {
  try {
    return await axios.put(`${backendUrl}/api/auctions/${auctionId}/kick/${userId}`, undefined, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
