'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { useProfile } from '@/queries/use-profile';
import { useLoadingBar } from '@jodd/next-top-loading-bar';
import { createStore } from '@jodd/snap';
import {
  ActivityIcon,
  EggFriedIcon,
  FlagIcon,
  HistoryIcon,
  LucideIcon,
  MessageSquareTextIcon,
  PackageIcon,
  TrendingUpIcon,
  WebhookIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

const commandItems: {
  title: string;
  href: string;
  icon: LucideIcon;
  allowedRole: 'user' | 'admin' | 'any';
}[] = [
  { title: 'Activities', href: '/dashboard#activities', icon: ActivityIcon, allowedRole: 'any' },
  { title: 'Analytics', href: '/dashboard#analytics', icon: TrendingUpIcon, allowedRole: 'any' },
  {
    title: 'Auctions History',
    href: '/dashboard#auctions-history',
    icon: HistoryIcon,
    allowedRole: 'any'
  },
  { title: 'Manage Auctions', href: '/dashboard/auctions', icon: WebhookIcon, allowedRole: 'any' },
  {
    title: 'Recent Auctions',
    href: '/dashboard#recent-auctions',
    icon: PackageIcon,
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
    allowedRole: 'admin'
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: FlagIcon,
    allowedRole: 'admin'
  }
];

const useSearchDashboard = createStore<{ isOpen: boolean }>(() => ({ isOpen: false }));
const onOpenChange = (isOpen: boolean) => useSearchDashboard.setState({ isOpen });
export const openSearchDashboard = () => onOpenChange(true);
export const closeSearchDashboard = () => onOpenChange(false);

export default function SearchDashboard() {
  const { data: profile } = useProfile();
  const { isOpen } = useSearchDashboard();
  const startRouteTransition = useLoadingBar((state) => state.start);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        useSearchDashboard.setState((state) => ({ isOpen: !state.isOpen }));
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="sr-only" />
      </DialogHeader>
      <DialogDescription className="sr-only" />

      <CommandInput placeholder="Search..." />

      <CommandList className="scrollbar-hide">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="All">
          {commandItems
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((item) => {
              if (item.allowedRole !== 'any' && item.allowedRole !== profile?.role) return null;
              return (
                <CommandItem
                  key={item.title}
                  onSelect={() => {
                    startRouteTransition(item.href);
                    router.push(item.href);
                    closeSearchDashboard();
                  }}
                >
                  <item.icon className="mr-1.5 size-5" />
                  <span>{item.title}</span>
                </CommandItem>
              );
            })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
