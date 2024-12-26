import { prefetchDashboardData } from '@/lib/query-utils';
import { cn } from '@/lib/utils';
import { useProfile } from '@/queries/use-profile';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { BellIcon, DotIcon, HomeIcon, LogOutIcon, UserIcon } from 'lucide-react';
import React from 'react';
import { openLogoutDialog } from '../dialogs/logout-dialog';
import { openProfileDialog } from '../dialogs/profile-dialog';
import { openNotificationsDrawer } from '../drawers/notifications-drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';

export default function ProfileDropdown({ children }: { children: React.ReactNode }) {
  const { data: profile } = useProfile();
  const hasNotifications = !!(profile?.totalUnreadNotifications || 0 > 0);
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={openProfileDialog}
            className="flex flex-1 cursor-pointer items-center"
          >
            <UserIcon className="size-3.5" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={openNotificationsDrawer}
            className={cn('flex flex-1 cursor-pointer items-center', {
              'text-brand': hasNotifications
            })}
          >
            <BellIcon
              className={cn('size-3.5', {
                'fill-brand text-brand': hasNotifications
              })}
            />
            <span>Notifications</span>
            {hasNotifications && <DotIcon className="size-4 scale-150 animate-pulse" />}
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <ProgressLink
              href="/dashboard"
              onClick={prefetchDashboardData}
              className="flex w-full cursor-pointer items-center"
            >
              <HomeIcon className="size-3.5" />
              <span>Dashboard</span>
            </ProgressLink>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={openLogoutDialog}
            className="flex flex-1 cursor-pointer items-center"
          >
            <LogOutIcon className="size-3.5" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
