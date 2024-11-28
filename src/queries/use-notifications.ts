import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const notificationsKey = ['notifications'];
export const useNotifications = () => {
  return useInfiniteQuery({
    queryKey: notificationsKey,
    queryFn: ({ signal, pageParam }) => fetchNotifications({ signal, cursor: pageParam }),

    maxPages: 10,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.cursor
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
  try {
    const url = new URL(`${backendUrl}/api/notifications`);
    if (cursor) url.searchParams.set('cursor', cursor);

    const res = await axios.get<FetchNotificationsResult>(url.href, {
      withCredentials: true,
      signal
    });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
