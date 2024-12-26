import { closePreviewDrawer } from '@/app/(dashboard)/dashboard/register-auction/sections/preview';
import { apiClient } from '@/lib/api-client';
import { RegisterAuctionSchema } from '@/lib/form-schemas';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage, uploadImage } from '@/lib/utils';
import { auctionKey } from '@/queries/use-auction';
import { auctionsKey } from '@/queries/use-auctions';
import { auctionsStatsKey } from '@/queries/use-auctions-stats';
import { profileKey } from '@/queries/use-profile';
import { useLoadingBar } from '@jodd/next-top-loading-bar';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const registerAuctionKey = ['register-auction'];

export const useRegisterAuction = () => {
  const queryClient = getQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: registerAuctionKey,
    mutationFn: registerAuction,

    onSuccess(auction) {
      toast.success('Auction registered successfully');
      queryClient.setQueryData<Auction>(auctionKey(auction.id), auction);
      queryClient.invalidateQueries({ queryKey: auctionsStatsKey({ resource: 'self' }) });
      closePreviewDrawer();
      const startRouteTransition = useLoadingBar.getState().start;
      if (startRouteTransition('/dashboard')) router.push('/dashboard');
    },
    onError(err) {
      toast.error(`Could not register auction! ${extractErrorMessage(err)}`);
    },
    onSettled() {
      const profile = queryClient.getQueryData<User>(profileKey);
      queryClient.invalidateQueries({
        queryKey: auctionsKey({ owner: profile?.id })
      });
    }
  });
};

type Options = {
  bannerImage: string | File | undefined;
  productImages: string[] | (File | undefined)[] | null;
} & RegisterAuctionSchema;
const registerAuction = async ({
  bannerImage,
  productImages,
  ...data
}: Options): Promise<Auction> => {
  const bannerImageUrlPromise = bannerImage instanceof File ? uploadImage(bannerImage) : undefined;

  const productImagesUrlsPromise: Promise<string>[] = [];
  for (const image of productImages || []) {
    if (image instanceof File) productImagesUrlsPromise.push(uploadImage(image));
  }

  const [bannerImageUrl, ...productImagesUrls] = await Promise.all([
    bannerImageUrlPromise,
    ...productImagesUrlsPromise
  ]);

  const res = await apiClient.post<{ auction: Auction }>(
    '/api/auctions',
    { ...data, banner: bannerImageUrl || bannerImage, productImages: productImagesUrls },
    { withCredentials: true }
  );
  return res.data.auction;
};
