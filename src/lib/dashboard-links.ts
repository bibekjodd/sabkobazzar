import { FlagIcon, HomeIcon, LucideIcon, MessageSquareTextIcon, WebhookIcon } from 'lucide-react';
import { prefetchDashboardAuctions, prefetchDashboardData } from './query-utils';

export const dashboardLinks: {
  title: string;
  href: string;
  icon: LucideIcon;
  action?: () => unknown;
  allowedRole: 'admin' | 'user' | 'any';
}[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    action: prefetchDashboardData,
    allowedRole: 'any'
  },
  {
    title: 'Auctions',
    href: '/dashboard/auctions',
    icon: WebhookIcon,
    action: prefetchDashboardAuctions,
    allowedRole: 'any'
  },
  {
    title: 'Feedbacks',
    href: '/dashboard/feedbacks',
    icon: MessageSquareTextIcon,
    allowedRole: 'admin'
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: FlagIcon,
    allowedRole: 'admin'
  }
];
