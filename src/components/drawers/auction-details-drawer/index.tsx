'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuction } from '@/queries/use-auction';
import { createStore } from '@jodd/snap';
import { HistoryIcon } from 'lucide-react';
import { Bids } from './bids';
import { Overview } from './overview';
import { Participants } from './participants';

const useAuctionDetailsDrawer = createStore<{ isOpen: boolean; auctionId: string | null }>(() => ({
  isOpen: false,
  auctionId: null
}));

const onOpenChange = (isOpen: boolean) => {
  useAuctionDetailsDrawer.setState((state) => ({
    isOpen,
    auctionId: isOpen ? state.auctionId : null
  }));
};

export const openAuctionDetailsDrawer = (auctionId: string) =>
  useAuctionDetailsDrawer.setState({ isOpen: true, auctionId });
export const closeAuctionDetailsDrawer = () => onOpenChange(false);

export default function AuctionDetailsDrawer() {
  const isOpen = useAuctionDetailsDrawer((state) => state.isOpen);
  return (
    <Drawer direction="right" open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="ml-auto flex h-screen w-fit max-w-[500px] flex-col rounded-tr-none">
        <BaseContent />
      </DrawerContent>
    </Drawer>
  );
}

function BaseContent() {
  const auctionId = useAuctionDetailsDrawer((state) => state.auctionId);
  const { data: auction } = useAuction(auctionId!, { enabled: !!auctionId });
  if (!auction) return null;
  return (
    <>
      <DrawerHeader>
        <DrawerTitle className="line-clamp-1 text-center text-lg font-medium text-brand">
          {auction.title}
        </DrawerTitle>
      </DrawerHeader>
      <DrawerDescription className="sr-only" />

      <ScrollArea className="h-full">
        <div className="flex flex-col p-6 pt-0">
          <Overview auction={auction} />
          <Participants auctionId={auction.id} />

          {auction.status === 'unbidded' && (
            <div className="mt-4">
              <h3 className="font-medium">
                <HistoryIcon className="mr-2 inline size-4" />
                <span>Bids History</span>
              </h3>
              <p className="mt-3 text-center text-sm text-error">The auction was unbidded.</p>
            </div>
          )}
          {auction.status === 'completed' && (
            <Bids auctionId={auction.id} startDate={auction.startsAt} />
          )}
        </div>
      </ScrollArea>

      <DrawerFooter className="sm:hidden">
        <DrawerClose asChild>
          <Button variant="outline">Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  );
}
