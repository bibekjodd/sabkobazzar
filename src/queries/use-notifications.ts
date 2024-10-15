import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const notificationsKey = ['notifications'];
export const useNotifications = () => {
  return useInfiniteQuery({
    queryKey: notificationsKey,
    queryFn: ({ signal, pageParam }) => fetchNotifications({ signal, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam(lastPage) {
      return lastPage.at(lastPage.length - 1)?.receivedAt;
    }
  });
};

type Options = { signal: AbortSignal; cursor: string | undefined };
const fetchNotifications = async ({ signal, cursor }: Options): Promise<UserNotification[]> => {
  try {
    const url = new URL(`${backendUrl}/api/notifications`);
    if (cursor) url.searchParams.set('cursor', cursor);
    const res = await axios.get<{ notifications: UserNotification[] }>(url.href, {
      withCredentials: true,
      signal
    });
    return res.data.notifications;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
