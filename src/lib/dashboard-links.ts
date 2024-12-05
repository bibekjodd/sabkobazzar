import { HomeIcon, LucideIcon, WebhookIcon } from 'lucide-react';
import { prefetchDashboardAuctions, prefetchDashboardData } from './query-utils';

export const dashboardLinks: {
  title: string;
  href: string;
  icon: LucideIcon;
  action?: () => unknown;
}[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    action: prefetchDashboardData
  },
  {
    title: 'Auctions',
    href: '/dashboard/auctions',
    icon: WebhookIcon,
    action: prefetchDashboardAuctions
  }
];
