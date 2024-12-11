import { backendUrl } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { FetchNotificationsResult, notificationsKey } from '@/queries/use-notifications';
import { profileKey } from '@/queries/use-profile';
import { InfiniteData, useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useReadNotifications = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: ['read-notifications'],
    retry: 1,
    mutationFn: async () => {
      const profile = queryClient.getQueryData<UserProfile>(profileKey);
      if (!profile) throw new Error('User is not authorized');
      const notificationsData =
        queryClient.getQueryData<InfiniteData<FetchNotificationsResult>>(notificationsKey);

      if (!notificationsData) return null;

      const lastNotification = notificationsData.pages[0]?.notifications[0];
      if (!lastNotification) return null;
      if (profile.lastNotificationReadAt > lastNotification?.createdAt) return null;
      return await axios.put(`${backendUrl}/api/notifications/read`, undefined, {
        withCredentials: true
      });
    },

    onSuccess() {
      const profile = queryClient.getQueryData<UserProfile>(profileKey);
      if (!profile) return;
      queryClient.setQueryData<UserProfile>(profileKey, {
        ...profile,
        lastNotificationReadAt: new Date().toISOString(),
        totalUnreadNotifications: 0
      });
    },

    onError() {
      queryClient.invalidateQueries({ queryKey: profileKey });
    },

    onSettled() {
      queryClient.invalidateQueries({ queryKey: profileKey });
    }
  });
};
