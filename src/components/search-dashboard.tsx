'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { useLoadingBar } from '@jodd/next-top-loading-bar';
import { createStore } from '@jodd/snap';
import {
  ActivityIcon,
  EggFriedIcon,
  HistoryIcon,
  LucideIcon,
  PackageIcon,
  TrendingUpIcon,
  WebhookIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { openRegisterAuctionDrawer } from './drawers/register-auction-drawer';
import { DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

const commandItems: { title: string; href: string; icon: LucideIcon }[] = [
  { title: 'Activities', href: '/dashboard#activities', icon: ActivityIcon },
  { title: 'Analytics', href: '/dashboard#analytics', icon: TrendingUpIcon },
  { title: 'Auctions History', href: '/dashboard#auctions-history', icon: HistoryIcon },
  { title: 'Manage Auctions', href: '/dashboard/auctions', icon: WebhookIcon },
  { title: 'Recent Auctions', href: '/dashboard#recent-auctions', icon: PackageIcon }
];

const useSearchDashboard = createStore<{ isOpen: boolean }>(() => ({ isOpen: false }));
const onOpenChange = (isOpen: boolean) => useSearchDashboard.setState({ isOpen });
export const openSearchDashboard = () => onOpenChange(true);
export const closeSearchDashboard = () => onOpenChange(false);

export default function SearchDashboard() {
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
          {commandItems.map((item) => (
            <CommandItem
              key={item.title}
              onSelect={() => {
                startRouteTransition(item.href);
                router.push(item.href);
                closeSearchDashboard();
              }}
            >
              <item.icon />
              <span>{item.title}</span>
            </CommandItem>
          ))}

          <CommandItem
            onSelect={() => {
              openRegisterAuctionDrawer();
              closeSearchDashboard();
            }}
          >
            <EggFriedIcon />
            <span>Register an auction</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
