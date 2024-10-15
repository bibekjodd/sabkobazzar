import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { participantsKey } from '@/queries/use-participants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

type KeyOptions = { auctionId: string; userId: string };
export const kickUserKey = (options: KeyOptions) => ['kick-user', options];

export const useKickUser = ({ auctionId, userId }: KeyOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: kickUserKey({ auctionId, userId }),
    mutationFn: () => kickUser({ auctionId, userId }),
    onError(err) {
      toast.dismiss();
      toast.error(`Could not kick user from the auction! ${err.message}`);
      queryClient.invalidateQueries({ queryKey: auctionKey(auctionId) });
      queryClient.invalidateQueries({ queryKey: participantsKey(auctionId) });
    },
    onSuccess() {
      const auction = queryClient.getQueryData<Auction>(['auction', auctionId]);
      if (auction) {
        queryClient.setQueryData<Auction>(['auction', auctionId], {
          ...auction,
          totalParticipants: auction.totalParticipants - 1
        });
      }

      const participants = queryClient.getQueryData<User[]>(['participants', auctionId]);
      if (!participants) return;
      const updatedParticipants = participants.filter((participant) => participant.id !== userId);
      queryClient.setQueryData<User[]>(['participants', auctionId], updatedParticipants);
    }
  });
};

const kickUser = async ({ auctionId, userId }: KeyOptions) => {
  try {
    return await axios.put(`${backendUrl}/api/auctions/${auctionId}/kick/${userId}`, undefined, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
