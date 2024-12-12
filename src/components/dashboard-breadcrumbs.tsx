'use client';

import { dashboardLinks } from '@/lib/dashboard-links';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { ActivityIcon, ChevronRightIcon, HomeIcon, TrendingUpIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const currentLink = dashboardLinks.find((link) => link.href === pathname);

  return (
    <div className="flex items-center space-x-2 px-5 text-sm">
      <ProgressLink href="/dashboard" className="flex items-center space-x-1.5">
        <HomeIcon className="size-3.5" />
        <span>Dashboard</span>
        <ChevronRightIcon className="size-3.5" />
      </ProgressLink>

      {pathname === '/dashboard' && (
        <div className="!ml-6 flex items-center space-x-6">
          <ProgressLink href="/dashboard#analytics" className="flex items-center space-x-1.5">
            <TrendingUpIcon className="size-3.5" />
            <span>Analytics</span>
          </ProgressLink>

          <ProgressLink href="/dashboard#activities" className="flex items-center space-x-1.5">
            <ActivityIcon className="size-3.5" />
            <span>Activities</span>
          </ProgressLink>
        </div>
      )}

      {currentLink && currentLink.href !== '/dashboard' && (
        <ProgressLink
          href={currentLink.href}
          onClick={currentLink.action}
          className="flex items-center space-x-1.5"
        >
          <currentLink.icon className="size-3.5" />
          <span>{currentLink.title}</span>
        </ProgressLink>
      )}
    </div>
  );
}
