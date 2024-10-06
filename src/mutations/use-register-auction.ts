import { backendUrl } from '@/lib/constants';
import { RegisterAuctionSchema } from '@/lib/form-schemas';
import { extractErrorMessage, uploadImage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useRegisterAuction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['register-auction'],
    mutationFn: registerAuction,
    onMutate() {
      toast.dismiss();
      toast.loading('Registering auction...');
    },
    onSuccess() {
      toast.dismiss();
      toast.success('Auction registered successfully');
    },
    onError(err) {
      toast.dismiss();
      toast.error(`Could not register auction! ${err.message}`);
    },
    onSettled() {
      const profile = queryClient.getQueryData<User>(['profile']);
      queryClient.invalidateQueries({
        queryKey: ['upcoming-auctions', { productId: null, ownerId: profile?.id }]
      });
    }
  });
};

type Options = { productId: string; image: string | File | undefined } & RegisterAuctionSchema;
const registerAuction = async ({ productId, image, ...data }: Options) => {
  try {
    const imageUrl = image instanceof File ? await uploadImage(image) : undefined;
    await axios.post(
      `${backendUrl}/api/auctions/${productId}`,
      { ...data, banner: imageUrl || image },
      { withCredentials: true }
    );
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};