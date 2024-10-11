import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useLeaveLiveAuction = (auctionId: string) => {
  return useMutation({
    mutationKey: ['leave-live-auction', auctionId],
    mutationFn: () => leaveLiveAuction(auctionId)
  });
};

const leaveLiveAuction = async (auctionId: string) => {
  try {
    return axios.put(`${backendUrl}/api/events/auctions/${auctionId}/leave`, undefined, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
