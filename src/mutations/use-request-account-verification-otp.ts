import { apiClient } from '@/lib/api-client';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { profileKey } from '@/queries/use-profile';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useRequestAccountVerificationOtp = () => {
  return useMutation({
    mutationKey: ['request-account-verification-otp'],
    mutationFn: async () => {
      await apiClient.post('/api/users/otp/request', undefined, { withCredentials: true });
    },

    onSuccess() {
      toast.success('Account verification otp has been sent to mail');
    },

    onError(err) {
      toast.error(`Could not get verification otp! ${extractErrorMessage(err)}`);
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({ queryKey: profileKey });
    }
  });
};
