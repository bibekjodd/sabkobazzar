import { cn } from '@/lib/utils';
import { useProfile } from '@/queries/use-profile';
import { ProgressButton } from '@jodd/next-top-loading-bar';
import { BellIcon, DotIcon, LayoutGrid, LogOut, UserIcon } from 'lucide-react';
import React from 'react';
import LogoutDialog from '../dialogs/logout-dialog';
import ProfileDialog from '../dialogs/profile-dialog';
import NotificationsDrawer from '../drawers/notifications-drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-48 bg-background/50 filter backdrop-blur-3xl">
        <DropdownMenuLabel>Account</DropdownMenuLabel>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex-1 [&>svg]:hidden">
            <ProfileDialog>
              <button className="flex w-full items-center">
                <UserIcon className="mr-2 size-3.5" />
                <span>Profile</span>
              </button>
            </ProfileDialog>
          </DropdownMenuSubTrigger>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            className={cn('flex-1 [&>svg]:hidden', { 'text-purple-700': hasNotifications })}
          >
            <NotificationsDrawer>
              <button className="flex w-full items-center">
                <BellIcon
                  className={cn('mr-2 size-3.5', {
                    'fill-purple-700 text-purple-700': hasNotifications
                  })}
                />
                <span>Notifications</span>
                {hasNotifications && <DotIcon className="size-4 scale-150 animate-pulse" />}
              </button>
            </NotificationsDrawer>
          </DropdownMenuSubTrigger>
        </DropdownMenuSub>

        <DropdownMenuItem asChild>
          <ProgressButton href="/dashboard" className="flex w-full cursor-pointer items-center">
            <LayoutGrid className="size-3.5" />
            <span>Dashboard</span>
          </ProgressButton>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex-1 [&>svg]:hidden">
            <LogoutDialog>
              <button className="flex w-full items-center">
                <LogOut className="mr-2 size-3.5" />
                <span>Logout</span>
              </button>
            </LogoutDialog>
          </DropdownMenuSubTrigger>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
