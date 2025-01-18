import { closeJoinAuctionDialog } from '@/components/dialogs/join-auction-dialog';
import { apiClient } from '@/lib/api-client';
import { getQueryClient } from '@/lib/query-client';
import { getStripe } from '@/lib/stripe';
import { extractErrorMessage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { notificationsKey } from '@/queries/use-notifications';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const joinAuctionKey = (auctionId: string) => ['join-auction', auctionId];
export const useJoinAuction = (auctionId: string) => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: joinAuctionKey(auctionId),
    mutationFn: () => joinAuction(auctionId),

    onSuccess() {
      closeJoinAuctionDialog();
      toast.success('Joined auction successfully');
      queryClient.invalidateQueries({ queryKey: notificationsKey });
    },

    onError(err) {
      closeJoinAuctionDialog();
      toast.error(`Could not join auction! ${extractErrorMessage(err)}`);
      queryClient.invalidateQueries({ queryKey: auctionKey(auctionId) });
    }
  });
};

const joinAuction = async (auctionId: string) => {
  const cancelUrl = `${location.origin}/auctions/${auctionId}?join_status=error`;
  const successUrl = `${location.origin}/auctions/${auctionId}?join_status=success`;

  const res = await apiClient.put<{ checkoutSessionId: string }>(
    `/api/auctions/${auctionId}/join`,
    { cancelUrl, successUrl },
    {
      withCredentials: true
    }
  );
  const checkoutSessionId = res.data.checkoutSessionId;
  const stripe = await getStripe();
  await stripe?.redirectToCheckout({
    sessionId: checkoutSessionId
  });
};
