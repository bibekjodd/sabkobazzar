'use client';

import { useWindowSize } from '@/hooks/use-window-size';
import { NOTIFICATION_MAP } from '@/lib/constants';
import { useReadNotifications } from '@/mutations/use-read-notifications';
import { useNotifications } from '@/queries/use-notifications';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AlertCircle, BellIcon } from 'lucide-react';
import React, { useRef } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../ui/drawer';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import InfiniteScrollObserver from '../utils/infinite-scroll-observer';

dayjs.extend(relativeTime);

export default function NotificationsDrawer({ children }: { children: React.ReactNode }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const {
    data: notifications,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching
  } = useNotifications();

  const closeDrawer = () => {
    closeButtonRef.current?.click();
  };
  const { mutate: readNotifications } = useReadNotifications();
  const { width: screenWidth } = useWindowSize();
  return (
    <Drawer
      direction={screenWidth < 768 ? 'bottom' : 'right'}
      onOpenChange={(isOpen) => {
        if (isOpen) readNotifications();
      }}
    >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="ml-auto flex h-screen w-full flex-col bg-background/50 filter backdrop-blur-3xl md:max-w-screen-xs">
        <DrawerHeader>
          <DrawerTitle className="text-center">Notifications</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="hidden" />

        <ScrollArea className="h-full overflow-y-auto pr-2 scrollbar-thin">
          {error && (
            <div className="px-1">
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Could not get notifications</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            </div>
          )}

          <div className="flex flex-col space-y-2 px-1">
            {isLoading && new Array(6).fill('nothing').map((_, i) => <div key={i}>{skeleton}</div>)}
            {notifications?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    closeDrawer={closeDrawer}
                  />
                ))}
              </React.Fragment>
            ))}
            <InfiniteScrollObserver
              showLoader
              isFetching={isFetching}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
            />
          </div>
        </ScrollArea>

        <DrawerFooter>
          <DrawerClose asChild ref={closeButtonRef}>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function NotificationCard({
  notification,
  closeDrawer
}: {
  notification: UserNotification;
  closeDrawer: () => unknown;
}) {
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
      <ProgressLink href={link} onClick={closeDrawer}>
        {element}
      </ProgressLink>
    );
  return element;
}

const skeleton = (
  <div className="flex space-x-3 p-3">
    <Skeleton className="size-9 rounded-full" />
    <div className="flex flex-grow flex-col space-y-2">
      <Skeleton className="h-8" />
      <Skeleton className="h-14" />
      <Skeleton className="h-8" />
    </div>
  </div>
);
