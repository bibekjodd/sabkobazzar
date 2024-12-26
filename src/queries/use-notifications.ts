import { apiClient } from '@/lib/api-client';
import { concatenateSearchParams } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';

export const notificationsKey = ['notifications'];
export const useNotifications = () => {
  return useInfiniteQuery({
    queryKey: notificationsKey,
    queryFn: ({ signal, pageParam }) => fetchNotifications({ signal, cursor: pageParam }),
    staleTime: Infinity,
    gcTime: Infinity,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
    select: (data) => data.pages.map((page) => page.notifications).flat(1)
  });
};

type Options = { signal: AbortSignal; cursor: string | undefined };
export type FetchNotificationsResult = {
  notifications: UserNotification[];
  cursor: string | undefined;
};
const fetchNotifications = async ({
  signal,
  cursor
}: Options): Promise<FetchNotificationsResult> => {
  const res = await apiClient.get<FetchNotificationsResult>(
    concatenateSearchParams('/api/notifications', { cursor }),
    {
      withCredentials: true,
      signal
    }
  );
  return res.data;
};
