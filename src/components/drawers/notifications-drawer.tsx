'use client';

import { useWindowSize } from '@/hooks/use-window-size';
import { extractErrorMessage } from '@/lib/utils';
import { useReadNotifications } from '@/mutations/use-read-notifications';
import { useNotifications } from '@/queries/use-notifications';
import { useProfile } from '@/queries/use-profile';
import { createStore } from '@jodd/snap';
import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
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
  DrawerTitle
} from '../ui/drawer';
import { ScrollArea } from '../ui/scroll-area';
import InfiniteScrollObserver from '../utils/infinite-scroll-observer';

const useNotificationsDrawer = createStore<{ isOpen: boolean }>(() => ({ isOpen: false }));
const onOpenChange = (isOpen: boolean) => useNotificationsDrawer.setState({ isOpen });
export const openNotificationsDrawer = () => onOpenChange(true);
export const closeNotificationsDrawer = () => onOpenChange(false);

export default function NotificationsDrawer() {
  const { data: profile } = useProfile();
  const { width: screenWidth } = useWindowSize();
  const { isOpen } = useNotificationsDrawer();

  return (
    <Drawer
      open={isOpen}
      direction={screenWidth < 768 ? 'bottom' : 'right'}
      onOpenChange={onOpenChange}
    >
      <DrawerContent className="ml-auto flex h-screen w-full flex-col bg-background/50 filter backdrop-blur-3xl md:max-w-screen-xs">
        <DrawerHeader>
          <DrawerTitle className="text-center">Notifications</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="hidden" />

        {profile && <BaseContent />}

        <DrawerFooter className="md:hidden">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function BaseContent() {
  const {
    data: notifications,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching
  } = useNotifications();

  const { mutate: readNotifications } = useReadNotifications();

  useEffect(() => {
    readNotifications();
  }, [readNotifications, notifications]);

  return (
    <ScrollArea className="h-full overflow-y-auto pr-2 scrollbar-thin">
      {error && (
        <div className="px-1">
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Could not get notifications</AlertTitle>
            <AlertDescription>{extractErrorMessage(error)}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex flex-col space-y-2 px-1">
        {isLoading &&
          new Array(6).fill('nothing').map((_, i) => <NotificationCardSkeleton key={i} />)}
        {notifications?.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
        <InfiniteScrollObserver
          showLoader
          isFetching={isFetching}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </ScrollArea>
  );
}
