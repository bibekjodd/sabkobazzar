'use client';

import { openLogoutDialog } from '@/components/dialogs/logout-dialog';
import { dashboardLinks } from '@/lib/dashboard-links';
import { cn } from '@/lib/utils';
import { useProfile } from '@/queries/use-profile';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { BellIcon, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { openNotificationsDrawer } from '../drawers/notifications-drawer';

export default function DashboardSidebar() {
  const { data: profile } = useProfile();
  const pathname = usePathname();
  return (
    <aside className="sticky left-0 top-16 z-50 hidden h-[calc(100vh-64px)] w-64 min-w-64 flex-col overflow-y-auto pb-3 text-sm lg:flex">
      <nav className="flex h-full flex-grow flex-col px-4 [&_svg]:mr-4 [&_svg]:size-5">
        {dashboardLinks.map((link) => {
          if (link.allowedRole !== 'any' && profile?.role !== link.allowedRole) return null;
          return (
            <ProgressLink
              key={link.title}
              href={link.href}
              onClick={link.action}
              className={cn(
                'mb-0.5 flex h-12 items-center rounded-lg pl-4 hover:bg-brand/10 hover:text-brand',
                {
                  'bg-brand/10 text-brand': pathname === link.href
                }
              )}
            >
              <link.icon />
              <span>{link.title}</span>
            </ProgressLink>
          );
        })}

        <div className="mt-auto flex w-full flex-col pb-3">
          <button
            onClick={openNotificationsDrawer}
            className="mb-0.5 flex h-12 w-full items-center rounded-lg px-4 hover:bg-brand/10 hover:text-brand"
          >
            <BellIcon className="size-4" />
            <span>Notifications</span>
          </button>

          <button
            onClick={openLogoutDialog}
            className="flex h-12 items-center rounded-lg px-4 hover:bg-brand/10 hover:text-brand"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
