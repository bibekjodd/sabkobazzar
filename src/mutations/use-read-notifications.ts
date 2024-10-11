import { backendUrl } from '@/lib/constants';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useReadNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['read-notifications'],
    mutationFn: async () => {
      const profile = queryClient.getQueryData<UserProfile>(['profile']);
      if (!profile) throw new Error('User is not authorized');
      const notificationsData = queryClient.getQueryData<InfiniteData<UserNotification[]>>([
        'notifications'
      ]);
      if (!notificationsData) return null;

      const lastNotification = notificationsData.pages.at(0)?.at(0);
      if (!lastNotification) return null;
      if (profile.lastNotificationReadAt > lastNotification?.receivedAt) return null;
      return axios.put(`${backendUrl}/api/notifications/read`, undefined, {
        withCredentials: true
      });
    },

    onSuccess() {
      const profile = queryClient.getQueryData<UserProfile>(['profile']);
      if (!profile) return;
      queryClient.setQueryData<UserProfile>(['profile'], {
        ...profile,
        lastNotificationReadAt: new Date().toISOString(),
        totalUnreadNotifications: 0
      });
    },

    onError() {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });
};
