import { cn } from '@/lib/utils';
import { useProfile } from '@/queries/use-profile';
import { ProgressButton } from '@jodd/next-top-loading-bar';
import { BellIcon, DotIcon, LayoutGrid, LogOut } from 'lucide-react';
import React from 'react';
import LogoutDialog from '../dialogs/logout-dialog';
import NotificationsDrawer from '../drawers/notifications-drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';

export default function ProfileDropdown({ children }: { children: React.ReactNode }) {
  const { data: profile } = useProfile();
  const hasNotifications = !!(profile?.totalUnreadNotifications || 0 > 0);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent className="bg-background/50 filter backdrop-blur-3xl">
        <DropdownMenuLabel>Account</DropdownMenuLabel>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={cn('w-full', hasNotifications && 'text-purple-700')}>
            <NotificationsDrawer>
              <button className="flex w-full items-center">
                <BellIcon className={cn('mr-2 size-4', hasNotifications && 'text-purple-700')} />
                <span>Notifications</span>
                {hasNotifications && <DotIcon className="size-4 scale-150" />}
              </button>
            </NotificationsDrawer>
          </DropdownMenuSubTrigger>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="w-full">
            <ProgressButton href="/dashboard" className="flex items-center">
              <LayoutGrid className="mr-2 size-4" />
              <span>Dashboard</span>
            </ProgressButton>
          </DropdownMenuSubTrigger>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="w-full">
            <LogoutDialog>
              <button className="flex w-full items-center">
                <LogOut className="mr-2 size-4" />
                <span>Logout</span>
              </button>
            </LogoutDialog>
          </DropdownMenuSubTrigger>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
