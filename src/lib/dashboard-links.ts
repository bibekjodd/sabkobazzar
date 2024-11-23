import { auctionsKey, fetchAuctions } from '@/queries/use-auctions';
import { fetchProducts, productsKey } from '@/queries/use-products';
import { profileKey } from '@/queries/use-profile';
import { EggFriedIcon, LayoutGridIcon, LucideIcon, PackageIcon, WebhookIcon } from 'lucide-react';
import { getQueryClient } from './query-client';

export const dashboardLinks: {
  title: string;
  href: string;
  icon: LucideIcon;
  action?: () => unknown;
}[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGridIcon
  },
  {
    title: 'Auctions',
    href: '/dashboard/auctions',
    icon: WebhookIcon,
    action: () => {
      const queryClient = getQueryClient();
      const profile = queryClient.getQueryData<UserProfile>(profileKey);
      if (!profile) return;

      if (queryClient.getQueryData(auctionsKey({ owner: profile.id }))) return;
      queryClient.prefetchInfiniteQuery({
        queryKey: auctionsKey({ owner: profile.id }),
        queryFn: ({ signal }) => fetchAuctions({ signal, cursor: undefined, owner: profile.id }),
        initialPageParam: undefined
      });
    }
  },
  {
    title: 'Register Auction',
    href: '/dashboard/register-auction',
    icon: EggFriedIcon
  },
  {
    title: 'Manage Products',
    href: '/dashboard/products',
    icon: PackageIcon,
    action: () => {
      const queryClient = getQueryClient();
      const profile = queryClient.getQueryData<UserProfile>(profileKey);
      if (!profile) return;

      if (queryClient.getQueryData(productsKey({ owner: profile.id }))) return;
      queryClient.prefetchInfiniteQuery({
        queryKey: productsKey({ owner: profile.id }),
        queryFn: ({ signal }) => fetchProducts({ signal, cursor: undefined }),
        initialPageParam: undefined
      });
    }
  }
];
