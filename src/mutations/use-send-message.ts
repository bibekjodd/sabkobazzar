import { backendUrl } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

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
  try {
    return await axios.put(`${backendUrl}/api/events/auctions/${auctionId}/message`, data, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
