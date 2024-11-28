'use client';

import LogoutDialog from '@/components/dialogs/logout-dialog';
import { dashboardLinks } from '@/lib/dashboard-links';
import { cn } from '@/lib/utils';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-16 z-50 hidden h-[calc(100vh-64px)] w-64 flex-col overflow-y-auto pb-3 text-sm lg:flex">
      <nav className="flex h-full flex-grow flex-col">
        {dashboardLinks.map((link) => (
          <ProgressLink
            key={link.title}
            href={link.href}
            onClick={link.action}
            className={cn(
              'mb-1 flex h-12 items-center space-x-3 pl-4 hover:bg-purple-700/15 hover:text-purple-500',
              {
                'border-l-4 border-purple-700 bg-purple-700/15 text-purple-500':
                  pathname === link.href
              }
            )}
          >
            <link.icon className="size-5" />
            <span>{link.title}</span>
          </ProgressLink>
        ))}

        <LogoutDialog>
          <button className="mb-3 mt-auto flex w-fit items-center space-x-3 px-6 hover:text-purple-500">
            <LogOut className="size-4" />
            <span>Logout</span>
          </button>
        </LogoutDialog>
      </nav>
    </aside>
  );
}
