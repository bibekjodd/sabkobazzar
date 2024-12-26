import { apiClient } from '@/lib/api-client';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { participantsKey } from '@/queries/use-participants';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type KeyOptions = { auctionId: string; userId: string };
export const kickUserKey = (options: KeyOptions) => ['kick-user', options];

export const useKickUser = ({ auctionId, userId }: KeyOptions) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: kickUserKey({ auctionId, userId }),
    mutationFn: () => kickUser({ auctionId, userId }),

    onError(err) {
      toast.error(`Could not kick user from the auction! ${extractErrorMessage(err)}`);
      queryClient.invalidateQueries({ queryKey: auctionKey(auctionId) });
      queryClient.invalidateQueries({ queryKey: participantsKey(auctionId) });
    },

    onSuccess() {
      const auction = queryClient.getQueryData<Auction>(auctionKey(auctionId));
      if (auction) {
        queryClient.setQueryData<Auction>(auctionKey(auctionId), {
          ...auction,
          totalParticipants: auction.totalParticipants - 1
        });
      }

      const participants = queryClient.getQueryData<User[]>(participantsKey(auctionId));
      if (!participants) return;
      const updatedParticipants = participants.filter((participant) => participant.id !== userId);
      queryClient.setQueryData<User[]>(participantsKey(auctionId), updatedParticipants);
    }
  });
};

const kickUser = async ({ auctionId, userId }: KeyOptions) => {
  return await apiClient.put(`/api/auctions/${auctionId}/kick/${userId}`, undefined, {
    withCredentials: true
  });
};
