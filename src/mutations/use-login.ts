import { closeAuthDialog } from '@/components/dialogs/auth-dialog';
import { apiClient } from '@/lib/api-client';
import { LoginSchema } from '@/lib/form-schemas';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { profileKey } from '@/queries/use-profile';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useLogin = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (data: LoginSchema) => {
      const res = await apiClient.post<{ user: UserProfile }>('/api/auth/login', data, {
        withCredentials: true
      });
      return res.data.user;
    },

    onError(err) {
      toast.error(`Could not login! ${extractErrorMessage(err)}`);
    },
    onSuccess(data) {
      closeAuthDialog();
      toast.success('Logged in successfully');
      queryClient.setQueryData<UserProfile>(profileKey, data);
    }
  });
};
