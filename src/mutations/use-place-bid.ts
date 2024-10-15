import { backendUrl } from '@/lib/constants';
import { updateOnBid } from '@/lib/events-actions';
import { extractErrorMessage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { bidsKey } from '@/queries/use-bids';
import { bidsSnapshotKey } from '@/queries/use-bids-snapshot';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const placeBidKey = (auctionId: string) => ['place-bid', auctionId];

export const usePlaceBid = (auctionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: placeBidKey(auctionId),
    mutationFn: ({ amount }: { amount: number }) => placeBid({ auctionId, amount }),

    onSuccess(bid) {
      updateOnBid({ queryClient, bid });
    },

    onError(err) {
      toast.dismiss();
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
    const res = await axios.put<{ bid: Bid }>(
      `${backendUrl}/api/auctions/${auctionId}/bid`,
      { amount },
      { withCredentials: true }
    );
    return res.data.bid;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
