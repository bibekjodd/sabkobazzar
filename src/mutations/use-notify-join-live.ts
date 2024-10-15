import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useNotifyJoinLive = (auctionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['notify-join-live', auctionId],
    mutationFn: () => notifyJoinLive(auctionId),
    onError() {
      queryClient.invalidateQueries({ queryKey: auctionKey(auctionId) });
    },
    retry: 1
  });
};

const notifyJoinLive = async (auctionId: string) => {
  try {
    return await axios.put(`${backendUrl}/api/events/auctions/${auctionId}/join`, undefined, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
