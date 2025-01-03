import { apiClient } from '@/lib/api-client';
import { getQueryClient } from '@/lib/query-client';
import { auctionKey } from '@/queries/use-auction';
import { useMutation } from '@tanstack/react-query';

export const sendMessageKey = (auctionId: string) => ['send-message', auctionId];

export const useSendMessage = (auctionId: string) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: sendMessageKey(auctionId),
    mutationFn: (data: Omit<Options, 'auctionId'>) => sendMessage({ auctionId, ...data }),
    onError() {
      queryClient.invalidateQueries({ queryKey: auctionKey(auctionId) });
    }
  });
};

type Options = { text: string | undefined; emoji: string | undefined; auctionId: string };
const sendMessage = async ({ auctionId, ...data }: Options) => {
  return await apiClient.put(`/api/events/auctions/${auctionId}/message`, data, {
    withCredentials: true
  });
};
