import { backendUrl } from '@/lib/constants';
import { updateOnBid } from '@/lib/events-actions';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const usePlaceBid = (auctionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['place-bid', auctionId],
    mutationFn: ({ amount }: { amount: number }) => placeBid({ auctionId, amount }),

    onSuccess(bid) {
      updateOnBid({ queryClient, bid });
    },

    onError(err) {
      toast.dismiss();
      toast.error(`Could not place bid! ${err.message}`);
      queryClient.invalidateQueries({ queryKey: ['bids-snapshot', auctionId] });
      queryClient.invalidateQueries({ queryKey: ['bids', auctionId] });
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
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
      `${backendUrl}/api/bids/${auctionId}`,
      { amount },
      { withCredentials: true }
    );
    return res.data.bid;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
