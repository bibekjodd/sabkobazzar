import { backendUrl } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const interestedKey = (auctionId: string) => ['interested', auctionId];

export const useInterested = (auctionId: string) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: interestedKey(auctionId),
    mutationFn: (interested: boolean) => updateInterested({ auctionId, interested }),

    onSuccess(_, interested) {
      const auction = queryClient.getQueryData<Auction>(auctionKey(auctionId));
      if (!auction) return;
      const updatedAuction: Auction = { ...auction, isInterested: interested };
      queryClient.setQueryData<Auction>(auctionKey(auctionId), updatedAuction);
    },
    onError() {
      queryClient.invalidateQueries({ queryKey: auctionKey(auctionId) });
    }
  });
};

const updateInterested = async ({
  interested,
  auctionId
}: {
  interested: boolean;
  auctionId: string;
}) => {
  try {
    const url = `${backendUrl}/api/auctions/${auctionId}/interested`;
    if (interested) {
      return await axios.post(url, undefined, {
        withCredentials: true
      });
    }
    return await axios.delete(url, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
