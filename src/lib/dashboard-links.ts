import {
  EggFriedIcon,
  LayoutGridIcon,
  LucideIcon,
  PackageIcon,
  PackagePlusIcon,
  WebhookIcon
} from 'lucide-react';
import {
  prefetchDashboardAuctions,
  prefetchDashboardData,
  prefetchDashboardProducts
} from './query-utils';

export const dashboardLinks: {
  title: string;
  href: string;
  icon: LucideIcon;
  action?: () => unknown;
}[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGridIcon,
    action: prefetchDashboardData
  },
  {
    title: 'Auctions',
    href: '/dashboard/auctions',
    icon: WebhookIcon,
    action: prefetchDashboardAuctions
  },
  {
    title: 'Register Auction',
    href: '/dashboard/register-auction',
    icon: EggFriedIcon
  },
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: PackageIcon,
    action: prefetchDashboardProducts
  },
  {
    title: 'Add new Product',
    href: '/dashboard/add-new-product',
    icon: PackagePlusIcon
  }
];
