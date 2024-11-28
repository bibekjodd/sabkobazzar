'use client';

import { useWindowSize } from '@/hooks/use-window-size';
import { useReadNotifications } from '@/mutations/use-read-notifications';
import { useNotifications } from '@/queries/use-notifications';
import { AlertCircle } from 'lucide-react';
import React, { useRef } from 'react';
import { NotificationCard, NotificationCardSkeleton } from '../cards/notification-card';
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
import InfiniteScrollObserver from '../utils/infinite-scroll-observer';

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
            {isLoading &&
              new Array(6).fill('nothing').map((_, i) => <NotificationCardSkeleton key={i} />)}
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
