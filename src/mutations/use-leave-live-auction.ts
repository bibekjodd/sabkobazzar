import { apiClient } from '@/lib/api-client';
import { useMutation } from '@tanstack/react-query';

export const useLeaveLiveAuction = (auctionId: string) => {
  return useMutation({
    mutationKey: ['leave-live-auction', auctionId],
    mutationFn: () => leaveLiveAuction(auctionId)
  });
};

const leaveLiveAuction = async (auctionId: string) => {
  return await apiClient.put(`/api/events/auctions/${auctionId}/leave`, undefined, {
    withCredentials: true
  });
};
