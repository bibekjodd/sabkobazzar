import { backendUrl } from '@/lib/constants';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useLeaveLiveAuction = (auctionId: string) => {
  return useMutation({
    mutationKey: ['leave-live-auction', auctionId],
    mutationFn: () => leaveLiveAuction(auctionId)
  });
};

const leaveLiveAuction = async (auctionId: string) => {
  return await axios.put(`${backendUrl}/api/events/auctions/${auctionId}/leave`, undefined, {
    withCredentials: true
  });
};
