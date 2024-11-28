'use client';

import { openLogoutDialog } from '@/components/dialogs/logout-dialog';
import { dashboardLinks } from '@/lib/dashboard-links';
import { cn } from '@/lib/utils';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { BellIcon, EggFriedIcon, LogOut, PackagePlusIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import AddProductDialog from '../dialogs/add-product-dialog';
import { openSelectAuctionDialog } from '../dialogs/select-auction-product-dialog';
import { openNotificationsDrawer } from '../drawers/notifications-drawer';

export default function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky left-0 top-16 z-50 hidden h-[calc(100vh-64px)] w-64 min-w-64 flex-col overflow-y-auto pb-3 text-sm lg:flex">
      <nav className="flex h-full flex-grow flex-col px-4">
        {dashboardLinks.map((link) => (
          <ProgressLink
            key={link.title}
            href={link.href}
            onClick={link.action}
            className={cn(
              'mb-0.5 flex h-12 items-center space-x-3 rounded-lg pl-4 hover:bg-purple-700/15 hover:text-purple-500',
              {
                'bg-purple-700/15 text-purple-500': pathname === link.href
              }
            )}
          >
            <link.icon className="size-5" />
            <span>{link.title}</span>
          </ProgressLink>
        ))}

        <button
          onClick={openSelectAuctionDialog}
          className="mb-0.5 flex h-12 items-center space-x-3 rounded-lg pl-4 hover:bg-purple-700/15 hover:text-purple-500"
        >
          <EggFriedIcon className="size-5" />
          <span>Register Auction</span>
        </button>

        <AddProductDialog>
          <button className="mb-0.5 flex h-12 items-center space-x-3 rounded-lg pl-4 hover:bg-purple-700/15 hover:text-purple-500">
            <PackagePlusIcon className="size-5" />
            <span>Add New Product</span>
          </button>
        </AddProductDialog>

        <div className="mt-auto flex w-full flex-col pb-3">
          <button
            onClick={openNotificationsDrawer}
            className="mb-0.5 flex h-12 w-full items-center space-x-3 rounded-lg px-4 hover:bg-purple-700/15 hover:text-purple-500"
          >
            <BellIcon className="size-4" />
            <span>Notifications</span>
          </button>

          <button
            onClick={openLogoutDialog}
            className="flex h-12 items-center space-x-3 rounded-lg px-4 hover:bg-purple-700/15 hover:text-purple-500"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
