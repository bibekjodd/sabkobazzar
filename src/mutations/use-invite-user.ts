import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

type KeyOptions = { auctionId: string; userId: string };
export const inviteUserKey = (options: KeyOptions) => ['invite-user', options];

export const useInviteUser = (options: KeyOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: inviteUserKey(options),
    gcTime: 30 * 1000,
    mutationFn: () => inviteUser(options),

    onError(err) {
      toast.dismiss();
      toast.error(`Could not invite user to the auction! ${err.message}`);
      queryClient.invalidateQueries({ queryKey: auctionKey(options.auctionId) });
    }
  });
};

const inviteUser = async ({ userId, auctionId }: KeyOptions) => {
  try {
    return await axios.put(`${backendUrl}/api/auctions/${auctionId}/invite/${userId}`, undefined, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
