'use client';

import { prefetchDashboardAuctions } from '@/lib/query-utils';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import {
  ActivityIcon,
  ChevronRightIcon,
  HomeIcon,
  TrendingUpIcon,
  WebhookIcon
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DashboardBreadcrumbs() {
  const pathname = usePathname();

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

      {pathname === '/dashboard/auctions' && (
        <ProgressLink
          href="/dashboard/auctions"
          onClick={prefetchDashboardAuctions}
          className="flex items-center space-x-1.5"
        >
          <WebhookIcon className="size-3.5" />
          <span>Auctions</span>
        </ProgressLink>
      )}
    </div>
  );
}
