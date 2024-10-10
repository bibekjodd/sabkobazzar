import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const usePlaceBid = (auctionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['place-bid', auctionId],
    mutationFn: ({ amount }: { amount: number }) => placeBid({ auctionId, amount }),

    onSuccess(bid) {
      const bidsData = queryClient.getQueryData<InfiniteData<Bid[]>>(['bids', auctionId]);
      if (bidsData) {
        const updatedFirstPage: Bid[] = [bid, ...bidsData.pages[0]];
        queryClient.setQueryData<InfiniteData<Bid[]>>(['bids', auctionId], {
          ...bidsData,
          pages: [updatedFirstPage, ...bidsData.pages.slice(1)]
        });
      }

      const bidsSnapshotData = queryClient.getQueryData<Bid[]>(['bids-snapshot', auctionId]);
      if (!bidsSnapshotData) return;
      const updatedBidsSnapshot = bidsSnapshotData.filter(
        (currentBid) => currentBid.bidderId !== bid.bidderId
      );
      updatedBidsSnapshot.unshift(bid);
      updatedBidsSnapshot.sort((a, b) => (a.amount > b.amount ? -1 : 1));
      queryClient.setQueryData<Bid[]>(['bids-snapshot', auctionId], updatedBidsSnapshot);
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
