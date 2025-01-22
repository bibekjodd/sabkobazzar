import { apiClient } from '@/lib/api-client';
import { getQueryClient } from '@/lib/query-client';
import { userKey } from '@/queries/use-user';
import { useMutation } from '@tanstack/react-query';

export const updateUserKey = (userId: string) => ['update-user', userId];

export const useUpdateUser = (userId: string) => {
  return useMutation({
    mutationKey: updateUserKey(userId),
    mutationFn: async ({ role }: { role: 'user' | 'admin' }) => {
      const res = await apiClient.put<{ user: User }>(
        `/api/users/${userId}`,
        { role },
        { withCredentials: true }
      );
      return res.data.user;
    },

    onError() {
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({ queryKey: userKey(userId) });
    },

    onSuccess(data) {
      const queryClient = getQueryClient();
      queryClient.setQueryData<User>(userKey(userId), { ...data });
    }
  });
};
