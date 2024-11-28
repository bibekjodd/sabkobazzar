'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { createStore } from '@jodd/snap';
import {
  ActivityIcon,
  EggFriedIcon,
  HistoryIcon,
  PackageIcon,
  TrendingUpIcon,
  WebhookIcon
} from 'lucide-react';
import { useEffect } from 'react';
import { openSelectAuctionDialog } from './dialogs/select-auction-product-dialog';
import { DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

const useSearchDashboard = createStore<{ isOpen: boolean }>(() => ({ isOpen: false }));
const onOpenChange = (isOpen: boolean) => useSearchDashboard.setState({ isOpen });
export const openSearchDashboard = () => onOpenChange(true);
export const closeSearchDashboard = () => onOpenChange(false);

export default function SearchDashboard() {
  const { isOpen } = useSearchDashboard();

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
          <ProgressLink href="/dashboard/#activities" onClick={closeSearchDashboard}>
            <CommandItem>
              <ActivityIcon />
              <span>Activities</span>
            </CommandItem>
          </ProgressLink>

          <ProgressLink href="/dashboard#analytics" onClick={closeSearchDashboard}>
            <CommandItem>
              <TrendingUpIcon />
              <span>Analytics</span>
            </CommandItem>
          </ProgressLink>

          <ProgressLink href="/dashboard#auctions-history" onClick={closeSearchDashboard}>
            <CommandItem>
              <HistoryIcon />
              <span>Auctions history</span>
            </CommandItem>
          </ProgressLink>

          <ProgressLink href="/dashboard/auctions" onClick={closeSearchDashboard}>
            <CommandItem>
              <WebhookIcon />
              <span>Manage auctions</span>
            </CommandItem>
          </ProgressLink>

          <ProgressLink href="/dashboard/products" onClick={closeSearchDashboard}>
            <CommandItem>
              <PackageIcon />
              <span>Manage products</span>
            </CommandItem>
          </ProgressLink>

          <ProgressLink href="/dashboard#recent-auctions" onClick={closeSearchDashboard}>
            <CommandItem>
              <PackageIcon />
              <span>Recent auctions</span>
            </CommandItem>
          </ProgressLink>

          <button
            className="w-full"
            onClick={() => {
              closeSearchDashboard();
              openSelectAuctionDialog();
            }}
          >
            <CommandItem>
              <EggFriedIcon />
              <span>Register an auction</span>
            </CommandItem>
          </button>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
