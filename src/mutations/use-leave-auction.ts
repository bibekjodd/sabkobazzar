import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { notificationsKey } from '@/queries/use-notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const leaveAuctionKey = (auctionId: string) => ['kick-user', auctionId];

export const useLeaveAuction = (auctionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: leaveAuctionKey(auctionId),
    mutationFn: () => leaveAuction(auctionId),

    onMutate() {
      toast.dismiss();
      toast.loading('Leaving auction...');
    },

    onSuccess() {
      toast.dismiss();
      toast.success('Left auction successfully');
      queryClient.invalidateQueries({ queryKey: notificationsKey });
      const auction = queryClient.getQueryData<Auction>(['auction', auctionId]);
      if (auction) {
        queryClient.setQueryData<Auction>(['auction', auction.id], {
          ...auction,
          participationStatus: null,
          totalParticipants: auction.totalParticipants - 1
        });
      }

      const profile = queryClient.getQueryData<UserProfile>(['profile']);
      const participants = queryClient.getQueryData<User[]>(['participants', auctionId]);
      if (!participants) return;
      const updatedParticipants: User[] = participants.filter(
        (participant) => participant.id !== profile?.id
      );
      queryClient.setQueryData<User[]>(['participants', auctionId], updatedParticipants);
    },

    onError(err) {
      toast.dismiss();
      toast.error(`Could not leave auction! ${err.message}`);
    },

    onSettled() {
      queryClient.invalidateQueries({ queryKey: auctionKey(auctionId) });
    }
  });
};

const leaveAuction = async (auctionId: string) => {
  try {
    await axios.put<{ auction: Auction }>(
      `${backendUrl}/api/auctions/${auctionId}/leave`,
      undefined,
      {
        withCredentials: true
      }
    );
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
