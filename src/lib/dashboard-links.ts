import { feedbacksKey, fetchFeedbacks } from '@/queries/use-feedbacks';
import { fetchReports, reportsKey } from '@/queries/use-reports';
import {
  EggFriedIcon,
  FlagIcon,
  HomeIcon,
  LucideIcon,
  MessageSquareTextIcon,
  WebhookIcon
} from 'lucide-react';
import { getQueryClient } from './query-client';
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
    title: 'Manage Auctions',
    href: '/dashboard/auctions',
    icon: WebhookIcon,
    action: prefetchDashboardAuctions,
    allowedRole: 'any'
  },
  {
    title: 'Register Auction',
    href: '/dashboard/register-auction',
    icon: EggFriedIcon,
    allowedRole: 'user'
  },
  {
    title: 'Feedbacks',
    href: '/dashboard/feedbacks',
    icon: MessageSquareTextIcon,
    allowedRole: 'admin',
    action: () => {
      const queryClient = getQueryClient();
      const accessorKey = feedbacksKey({});
      if (
        queryClient.getQueryData(accessorKey) ||
        queryClient.isFetching({ queryKey: accessorKey })
      )
        return;

      queryClient.prefetchInfiniteQuery({
        queryKey: accessorKey,
        initialPageParam: undefined,
        queryFn: ({ signal }) => fetchFeedbacks({ cursor: undefined, signal })
      });
    }
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: FlagIcon,
    allowedRole: 'admin',
    action: () => {
      const queryClient = getQueryClient();
      const accessorKey = reportsKey({});
      if (
        queryClient.getQueryData(accessorKey) ||
        queryClient.isFetching({ queryKey: accessorKey })
      )
        return;

      queryClient.prefetchInfiniteQuery({
        queryKey: accessorKey,
        initialPageParam: undefined,
        queryFn: ({ signal }) => fetchReports({ signal, cursor: undefined })
      });
    }
  }
];
