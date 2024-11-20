import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const notificationsKey = ['notifications'];
export const useNotifications = () => {
  return useInfiniteQuery({
    queryKey: notificationsKey,
    queryFn: ({ signal, pageParam }) => fetchNotifications({ signal, pageParam }),

    maxPages: 10,
    initialPageParam: undefined as PageParam | undefined,
    getNextPageParam(lastPage) {
      const lastResult = lastPage.at(lastPage.length - 1);
      if (!lastResult) return undefined;

      return { cursor: lastResult.receivedAt, cursorId: lastResult.id };
    }
  });
};

type PageParam = { cursor: string; cursorId: string | undefined };
type Options = { signal: AbortSignal; pageParam: PageParam | undefined };
const fetchNotifications = async ({ signal, pageParam }: Options): Promise<UserNotification[]> => {
  try {
    const url = new URL(`${backendUrl}/api/notifications`);
    if (pageParam?.cursor) url.searchParams.set('cursor', pageParam.cursor);
    if (pageParam?.cursorId) url.searchParams.set('cursorId', pageParam.cursorId);

    const res = await axios.get<{ notifications: UserNotification[] }>(url.href, {
      withCredentials: true,
      signal
    });
    return res.data.notifications;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
