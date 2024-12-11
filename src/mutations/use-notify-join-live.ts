import { backendUrl } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { auctionKey } from '@/queries/use-auction';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useNotifyJoinLive = (auctionId: string) => {
  const queryClient = getQueryClient();

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
  return await axios.put(`${backendUrl}/api/events/auctions/${auctionId}/join`, undefined, {
    withCredentials: true
  });
};
