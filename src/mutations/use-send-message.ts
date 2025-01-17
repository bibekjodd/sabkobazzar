import { closeSendMessageDialog } from '@/app/(main)/auctions/[id]/sections/live/send-message';
import { apiClient } from '@/lib/api-client';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const sendMessageKey = (auctionId: string) => ['send-message', auctionId];

export const useSendMessage = (auctionId: string) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: sendMessageKey(auctionId),
    mutationFn: (data: Omit<Options, 'auctionId'>) => sendMessage({ auctionId, ...data }),
    onSuccess() {
      closeSendMessageDialog();
    },
    onError(err) {
      toast.error(`Could not send message! ${extractErrorMessage(err)}`);
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
