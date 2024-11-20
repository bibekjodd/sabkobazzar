import { backendUrl, MILLIS } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

type KeyOptions = { auctionId: string; userId: string };
export const inviteUserKey = (options: KeyOptions) => ['invite-user', options];

export const useInviteUser = (options: KeyOptions) => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: inviteUserKey(options),
    gcTime: MILLIS.MINUTE / 2,
    mutationFn: () => inviteUser(options),

    onError(err) {
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
