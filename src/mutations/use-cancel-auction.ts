import { closeCancelAuctionDialog } from '@/components/dialogs/cancel-auction-dialog';
import { closeManageAuctionDialog } from '@/components/dialogs/manage-auction-dialog';
import { apiClient } from '@/lib/api-client';
import { CancelAuctionSchema } from '@/lib/form-schemas';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const cancelAuctionKey = (auctionId: string) => ['cancel-auction', auctionId];

export const useCancelAuction = (auctionId: string) => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: cancelAuctionKey(auctionId),
    mutationFn: async (data: CancelAuctionSchema) => {
      await apiClient.put(`/api/auctions/${auctionId}/cancel`, data, {
        withCredentials: true
      });
    },

    onSuccess(_, { reason }) {
      toast.success('Auction cancelled successfully');
      const auction = queryClient.getQueryData<Auction>(auctionKey(auctionId));
      if (!auction) return;
      const updatedAuction: Auction = {
        ...auction,
        status: 'cancelled',
        cancelReason: reason || null
      };
      queryClient.setQueryData<Auction>(auctionKey(auctionId), updatedAuction);
      closeCancelAuctionDialog();
      closeManageAuctionDialog();
    },

    onError(err) {
      toast.error(`Could not cancel auction! ${extractErrorMessage(err)}`);
      queryClient.invalidateQueries({ queryKey: auctionKey(auctionId) });
    }
  });
};
