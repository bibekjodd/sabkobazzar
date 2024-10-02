import { backendUrl } from '@/lib/constants';
import { RegisterAuctionSchema } from '@/lib/form-schemas';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useRegisterAuction = () => {
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
      toast.error(`Could not regiser auction! ${err.message}`);
    }
  });
};

type Options = { productId: string } & RegisterAuctionSchema;
const registerAuction = async ({ productId, ...data }: Options) => {
  try {
    await axios.post(`${backendUrl}/api/auctions/${productId}`, data, { withCredentials: true });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
