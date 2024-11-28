import { backendUrl } from '@/lib/constants';
import { RegisterAuctionSchema } from '@/lib/form-schemas';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage, uploadImage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { auctionsKey } from '@/queries/use-auctions';
import { profileKey } from '@/queries/use-profile';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const registerAuctionKey = ['register-auction'];

export const useRegisterAuction = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: registerAuctionKey,
    mutationFn: registerAuction,

    onSuccess(auction) {
      toast.success('Auction registered successfully');
      queryClient.setQueryData<Auction>(auctionKey(auction.id), auction);
    },
    onError(err) {
      toast.error(`Could not register auction! ${err.message}`);
    },
    onSettled() {
      const profile = queryClient.getQueryData<User>(profileKey);
      queryClient.invalidateQueries({
        queryKey: auctionsKey({ owner: profile?.id })
      });
    }
  });
};

type Options = { productId: string; image: string | File | undefined } & RegisterAuctionSchema;
const registerAuction = async ({ productId, image, ...data }: Options): Promise<Auction> => {
  try {
    const imageUrl = image instanceof File ? await uploadImage(image) : undefined;
    const res = await axios.post<{ auction: Auction }>(
      `${backendUrl}/api/auctions/${productId}`,
      { ...data, banner: imageUrl || image },
      { withCredentials: true }
    );
    return res.data.auction;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
