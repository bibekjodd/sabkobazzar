'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRealtimeAuctionEvents } from '@/hooks/use-realtime-auction-events';
import { getQueryClient } from '@/lib/query-client';
import { isAuctionLive } from '@/lib/utils';
import { auctionKey, useAuction } from '@/queries/use-auction';
import { createStore } from '@jodd/snap';
import { AlignLeftIcon, HistoryIcon } from 'lucide-react';
import BidsHistory, { BidsHistoryDrawer } from './bids-history';
import BidsSnapshot, { BidsSnapshotDrawer } from './bids-snapshot';
import Messages from './messages';
import PlaceBidDialog from './place-bid-dialog';
import Screen from './screen';
import SendMessage, { SendMessageDialog } from './send-message';
import WinningScreen from './winning-screen';

const useLiveScreen = createStore<{ isOpen: boolean; auctionId: string | null }>(() => ({
  isOpen: false,
  auctionId: null
}));
const onOpenChange = (isOpen: boolean) => {
  const queryClient = getQueryClient();
  const auction = queryClient.getQueryData<Auction>(
    auctionKey(useLiveScreen.getState().auctionId!)
  );
  const isLive = auction && isAuctionLive(auction);
  if (isLive && auction?.participationStatus === 'joined') return;
  useLiveScreen.setState((state) => ({ isOpen, auctionId: isOpen ? state.auctionId : null }));
};
export const openLiveScreen = (auctionId: string) =>
  useLiveScreen.setState({ isOpen: true, auctionId });
export const closeLiveScreen = () => onOpenChange(false);
export const forceCloseLiveScreen = () =>
  useLiveScreen.setState({ auctionId: null, isOpen: false });

export default function Live() {
  const { isOpen, auctionId } = useLiveScreen();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        hideDefaultCloseButton
        className="flex h-screen max-h-full w-full max-w-full flex-col border-none bg-background p-0 focus:outline-none lg:p-6"
      >
        <DialogHeader className="hidden">
          <DialogTitle />
        </DialogHeader>
        <DialogDescription className="hidden" />
        {auctionId && <Content auctionId={auctionId} />}
      </DialogContent>
    </Dialog>
  );
}

function Content({ auctionId }: { auctionId: string }) {
  useRealtimeAuctionEvents(auctionId);
  const { data: auction } = useAuction(auctionId);
  if (!auction) return null;
  return (
    <div className="flex size-full lg:space-x-4 lg:p-0">
      <WinningScreen auction={auction} />
      <PlaceBidDialog auctionId={auction.id} />
      <BidsSnapshotDrawer auctionId={auction.id} />
      <BidsHistoryDrawer auctionId={auction.id} />
      <Messages />
      <SendMessageDialog auctionId={auction.id} />

      <section className="relative mb-10 hidden h-full w-72 overflow-hidden p-4 lg:block lg:rounded-3xl">
        {graphics}
        <div className="flex items-center space-x-2 px-2 pb-2 text-muted-foreground">
          <AlignLeftIcon className="size-4" />
          <h3>Current Bid Leaders</h3>
        </div>
        <ScrollArea className="h-full">
          <BidsSnapshot auctionId={auction.id} />
        </ScrollArea>
      </section>

      <section className="relative size-full h-full w-fit flex-grow overflow-hidden text-muted-foreground lg:rounded-3xl">
        {graphics}
        <Screen auction={auction} />
      </section>

      <section className="relative hidden h-full w-72 flex-col justify-between overflow-hidden lg:rounded-3xl xl:flex 2xl:w-80">
        {graphics}
        <div className="flex items-center space-x-2 px-6 pb-2 pt-4 text-muted-foreground">
          <HistoryIcon className="size-4" />
          <h3>Bids History</h3>
        </div>
        <ScrollArea className="h-full">
          <BidsHistory auctionId={auction.id} />
        </ScrollArea>
        <SendMessage auctionId={auction.id} />
      </section>
    </div>
  );
}

const graphics = (
  <>
    <div className="absolute inset-0 -z-10 border-brand-darker/20 [mask-image:linear-gradient(to_bottom,black,transparent)] lg:rounded-3xl lg:border-2" />
    <div className="absolute inset-0 -z-10 border-brand/5 [mask-image:linear-gradient(to_top,black,transparent)] lg:rounded-3xl lg:border-2" />

    <div className="absolute left-0 top-0 -z-10 size-20 rounded-full bg-brand/20 blur-3xl" />
    <div className="absolute right-0 top-0 -z-10 size-20 rounded-full bg-brand/20 blur-3xl" />
    <div className="absolute inset-0 -z-10 scale-110 bg-gradient-to-t from-muted-foreground/5" />
  </>
);
