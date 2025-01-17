import { apiClient } from '@/lib/api-client';
import { onPlaceBid } from '@/lib/events-actions';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage, formatPrice } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { bidsKey } from '@/queries/use-bids';
import { bidsSnapshotKey } from '@/queries/use-bids-snapshot';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const placeBidKey = (auctionId: string) => ['place-bid', auctionId];

export const usePlaceBid = (auctionId: string) => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: placeBidKey(auctionId),
    mutationFn: ({ amount }: { amount: number }) => placeBid({ auctionId, amount }),

    onSuccess(bid) {
      toast.success(`Placed bid of amount ${formatPrice(bid.amount)}`);
      onPlaceBid({ bid });
    },

    onError(err) {
      toast.error(`Could not place bid! ${extractErrorMessage(err)}`);
      queryClient.invalidateQueries({ queryKey: bidsSnapshotKey(auctionId) });
      queryClient.invalidateQueries({ queryKey: bidsKey({ auctionId }) });
      queryClient.invalidateQueries({ queryKey: auctionKey(auctionId) });
    }
  });
};

const placeBid = async ({
  auctionId,
  amount
}: {
  auctionId: string;
  amount: number;
}): Promise<Bid> => {
  const res = await apiClient.post<{ bid: Bid }>(
    `/api/auctions/${auctionId}/bids`,
    { amount },
    { withCredentials: true }
  );
  return res.data.bid;
};
