import { apiClient } from '@/lib/api-client';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useRequestLoginOtp = () => {
  return useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: async ({ email }: { email: string }) => {
      await apiClient.post('/api/auth/otp/request', { email });
    },
    onError(err) {
      toast.error(`Could not request login otp! ${extractErrorMessage(err)}`);
    },
    onSuccess() {
      toast.success(`Login otp has been sent to your mail`);
    }
  });
};
