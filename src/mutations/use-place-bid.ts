import { backendUrl } from '@/lib/constants';
import { onPlaceBid } from '@/lib/events-actions';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { bidsKey } from '@/queries/use-bids';
import { bidsSnapshotKey } from '@/queries/use-bids-snapshot';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const placeBidKey = (auctionId: string) => ['place-bid', auctionId];

export const usePlaceBid = (auctionId: string) => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: placeBidKey(auctionId),
    mutationFn: ({ amount }: { amount: number }) => placeBid({ auctionId, amount }),

    onSuccess(bid) {
      onPlaceBid({ bid });
    },

    onError(err) {
      toast.error(`Could not place bid! ${err.message}`);
      queryClient.invalidateQueries({ queryKey: bidsSnapshotKey(auctionId) });
      queryClient.invalidateQueries({ queryKey: bidsKey(auctionId) });
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
  try {
    const res = await axios.post<{ bid: Bid }>(
      `${backendUrl}/api/auctions/${auctionId}/bids`,
      { amount },
      { withCredentials: true }
    );
    return res.data.bid;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
