import { closeLogoutDialog } from '@/components/dialogs/logout-dialog';
import { apiClient } from '@/lib/api-client';
import { getQueryClient } from '@/lib/query-client';
import { profileKey } from '@/queries/use-profile';
import { useMutation } from '@tanstack/react-query';

export const logoutKey = ['logout'];

export const useLogout = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: logoutKey,
    mutationFn: async () => {
      await apiClient.post('/api/auth/logout', undefined, { withCredentials: true });
    },
    onSuccess() {
      closeLogoutDialog();
      queryClient.setQueryData(profileKey, null);
      queryClient.clear();
    },
    retry: 1
  });
};
