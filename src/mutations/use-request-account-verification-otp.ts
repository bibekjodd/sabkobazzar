import { backendUrl } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { profileKey } from '@/queries/use-profile';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useRequestAccountVerificationOtp = () => {
  return useMutation({
    mutationKey: ['request-account-verification-otp'],
    mutationFn: async () => {
      await axios.get(`${backendUrl}/api/users/verify`, { withCredentials: true });
    },

    onSuccess() {
      toast.dismiss();
      toast.success('Account verification otp has been sent to mail');
    },

    onError(err) {
      toast.dismiss();
      toast.error(`Could not get verification otp! ${extractErrorMessage(err)}`);
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({ queryKey: profileKey });
    }
  });
};
