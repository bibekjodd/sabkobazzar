import { backendUrl } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { profileKey } from '@/queries/use-profile';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useUpdatePassword = () => {
  return useMutation({
    mutationKey: ['update-password'],
    mutationFn: async (data: { password: string }) => {
      await axios.put(`${backendUrl}/api/auth/password`, data, { withCredentials: true });
    },
    onError(err) {
      toast.error(`Could not update password! ${extractErrorMessage(err)}`);
      getQueryClient().invalidateQueries({ queryKey: profileKey });
    },
    onSuccess() {
      toast.success('Password updated successfully');
    }
  });
};
