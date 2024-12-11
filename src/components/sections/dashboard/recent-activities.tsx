'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { NOTIFICATION_MAP } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useNotifications } from '@/queries/use-notifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ActivityIcon, BellIcon, CircleAlertIcon } from 'lucide-react';

dayjs.extend(relativeTime);
export default function RecentActivities() {
  const { data, error } = useNotifications();
  const notifications = data?.pages[0].notifications.slice(0, 5);

  return (
    <section id="activities" className="-mx-4 mt-20 scroll-m-16 rounded-lg bg-indigo-950/10 py-6">
      <h3 className="px-6">
        <span>Recent Activities</span> <ActivityIcon className="ml-2 inline size-4" />
      </h3>
      {error && (
        <div className="mt-2 p-2">
          <Alert variant="destructive">
            <CircleAlertIcon className="size-4" />
            <AlertTitle>Could not load recent activities</AlertTitle>
            <AlertDescription>{extractErrorMessage(error)}</AlertDescription>
          </Alert>
        </div>
      )}

      {!error && (
        <div className="mt-1 flex flex-col px-2">
          {notifications?.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </section>
  );
}

function NotificationItem({ notification }: { notification: UserNotification }) {
  const { Icon } = NOTIFICATION_MAP[`${notification.entity}-${notification.type || ''}`] || {
    Icon: BellIcon,
    severity: 'neutral'
  };
  return (
    <div className="flex items-start gap-x-4 border-b border-gray-400/10 p-4 last:border-none">
      <div className="rounded-full bg-indigo-300/5 p-2">
        <Icon className="size-4" />
      </div>
      <div className="flex flex-col">
        <p>{notification.title}</p>
        <p className="mt-1 text-sm text-indigo-200/90">{notification.description}</p>
        <p className="mt-1.5 text-xs text-indigo-200/60">
          {dayjs(notification.createdAt).fromNow()}
        </p>
      </div>
    </div>
  );
}
