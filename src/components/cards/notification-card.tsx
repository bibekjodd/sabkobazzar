import { NOTIFICATION_MAP } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { cn } from '@/lib/utils';
import { profileKey } from '@/queries/use-profile';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BellIcon } from 'lucide-react';
import { useState } from 'react';
import { openReportDetailsDialog } from '../dialogs/report-details-dialog';
import { closeNotificationsDrawer } from '../drawers/notifications-drawer';
import { Skeleton } from '../ui/skeleton';

dayjs.extend(relativeTime);

export function NotificationCard({ notification }: { notification: UserNotification }) {
  const [isNew] = useState(() => {
    const queryClient = getQueryClient();
    const profile = queryClient.getQueryData<UserProfile>(profileKey);
    const isNew = notification.createdAt > profile?.lastNotificationReadAt!;
    return isNew;
  });

  let link: string | null = null;
  if (notification.entity === 'auctions' && notification.params)
    link = `/auctions/${notification.params}`;

  const { Icon, severity } = NOTIFICATION_MAP[
    `${notification.entity}-${notification.type || ''}`
  ] || {
    Icon: BellIcon,
    severity: 'neutral'
  };

  const onClickAction = () => {
    if (
      notification.entity === 'reports' &&
      notification.type === 'response' &&
      notification.params
    ) {
      openReportDetailsDialog(notification.params);
    }
  };

  const element = (
    <div className="relative cursor-pointer overflow-hidden rounded-xl" onClick={onClickAction}>
      <div className="absolute left-0 top-0 -z-20 aspect-square h-20 rounded-full bg-indigo-300/15 blur-3xl filter" />
      <div className="absolute right-0 top-0 -z-20 aspect-square h-20 rounded-full bg-indigo-300/30 blur-3xl filter" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-blue-300/5" />
      <div className="absolute inset-0 -z-20 rounded-xl border-2 border-white/5 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="absolute inset-0 -z-20 rounded-xl border-2 border-gray-400/10 [mask-image:linear-gradient(to_top,black,transparent)]" />

      <section className="relative flex space-x-3 p-3">
        <div
          className={cn('size-fit translate-y-0.5 rounded-full p-2', {
            'bg-indigo-300/10 text-indigo-100': severity === 'neutral',
            'bg-yellow-300/10 text-yellow-500': severity === 'warning',
            'bg-rose-300/10 text-rose-500': severity === 'critical',
            'bg-emerald-300/10 text-emerald-500': severity === 'success',
            'bg-sky-300/10 text-sky-500': severity === 'info',
            'bg-purple-300/10 text-purple-500': severity === 'acknowledge'
          })}
        >
          <Icon className="size-5" />
        </div>
        <div className="flex flex-col">
          <div>
            <span className="font-medium">{notification.title}</span>
            {isNew && (
              <span className="ml-2 w-fit rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-500">
                New
              </span>
            )}
          </div>

          <span className="mt-0.5 text-sm text-indigo-100/80">{notification.description}</span>
          <span className="mt-2 text-xs text-gray-500">
            {dayjs(notification.createdAt).fromNow()}
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
