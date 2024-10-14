import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useInviteUser = ({ auctionId, userId }: { auctionId: string; userId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['invite-user', { userId, auctionId }],
    gcTime: 30 * 1000,
    mutationFn: () => inviteUser({ auctionId, userId }),

    onError(err) {
      toast.dismiss();
      toast.error(`Could not invite user to the auction! ${err.message}`);
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
    }
  });
};

const inviteUser = async ({ userId, auctionId }: { userId: string; auctionId: string }) => {
  try {
    return await axios.put(`${backendUrl}/api/auctions/${auctionId}/invite/${userId}`, undefined, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
