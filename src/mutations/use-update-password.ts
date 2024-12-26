import { closeUpdatePasswordDialog } from '@/components/dialogs/update-password-dialog';
import { apiClient } from '@/lib/api-client';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { profileKey } from '@/queries/use-profile';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdatePassword = () => {
  return useMutation({
    mutationKey: ['update-password'],
    mutationFn: async (data: { password: string }) => {
      await apiClient.put('/api/auth/password', data, { withCredentials: true });
    },
    onError(err) {
      toast.error(`Could not update password! ${extractErrorMessage(err)}`);
      getQueryClient().invalidateQueries({ queryKey: profileKey });
    },
    onSuccess() {
      closeUpdatePasswordDialog();
      toast.success('Password updated successfully');
    }
  });
};
