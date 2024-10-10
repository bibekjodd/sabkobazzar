import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useSendMessage = (auctionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['send-message', auctionId],
    mutationFn: (data: Omit<Options, 'auctionId'>) => sendMessage({ auctionId, ...data }),
    onError() {
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
    }
  });
};

type Options = { text: string | undefined; emoji: string | undefined; auctionId: string };
const sendMessage = async ({ auctionId, ...data }: Options) => {
  try {
    return axios.put(`${backendUrl}/api/events/auctions/${auctionId}/message`, data, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
