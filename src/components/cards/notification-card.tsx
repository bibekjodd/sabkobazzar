import { NOTIFICATION_MAP } from '@/lib/constants';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BellIcon } from 'lucide-react';
import { closeNotificationsDrawer } from '../drawers/notifications-drawer';
import { Skeleton } from '../ui/skeleton';

dayjs.extend(relativeTime);

export function NotificationCard({ notification }: { notification: UserNotification }) {
  let link: string | null = null;
  if (notification.entity === 'products' && notification.params)
    link = `/products/${notification.params}`;
  if (notification.entity === 'auctions' && notification.params)
    link = `/auctions/${notification.params}`;

  const { Icon } = NOTIFICATION_MAP[`${notification.entity}-${notification.type || ''}`] || {
    Icon: BellIcon,
    severity: 'neutral'
  };

  const element = (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute left-0 top-0 -z-20 aspect-square h-20 rounded-full bg-indigo-300/15 blur-3xl filter" />
      <div className="absolute right-0 top-0 -z-20 aspect-square h-20 rounded-full bg-indigo-300/30 blur-3xl filter" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-blue-300/5" />
      <div className="absolute inset-0 -z-20 rounded-xl border-2 border-white/5 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="absolute inset-0 -z-20 rounded-xl border-2 border-gray-400/10 [mask-image:linear-gradient(to_top,black,transparent)]" />

      <section className="relative flex space-x-3 p-3">
        <div className="size-fit translate-y-0.5 rounded-full bg-indigo-300/10 p-2">
          <Icon className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{notification.title}</span>
          <span className="mt-0.5 text-sm text-gray-400">{notification.description}</span>
          <span className="mt-2 text-xs text-gray-500">
            {dayjs(notification.receivedAt).fromNow()}
          </span>
        </div>
      </section>
    </div>
  );

  if (link)
    return (
      <ProgressLink href={link} onClick={closeNotificationsDrawer}>
        {element}
      </ProgressLink>
    );
  return element;
}

export function NotificationCardSkeleton() {
  return (
    <div className="flex space-x-3 p-3">
      <Skeleton className="size-9 rounded-full" />
      <div className="flex flex-grow flex-col space-y-2">
        <Skeleton className="h-8" />
        <Skeleton className="h-14" />
        <Skeleton className="h-8" />
      </div>
    </div>
  );
}
