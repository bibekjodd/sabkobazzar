'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuction } from '@/queries/use-auction';
import { useAuctionStore } from '@/stores/use-auction-store';
import AuctionRealtimeListener from './auction-realtime-listener';
import BidsHistory from './bids-history';
import BidsSnapshot from './bids-snapshot';
import Screen from './screen';
import SendMessage from './send-message';
import WinningScreen from './winning-screen';

type Props = { auction: Auction };
export default function Live({ auction: initialData }: Props) {
  const { data } = useAuction(initialData.id, { initialData });
  const auction = data || initialData;
  const isLive = useAuctionStore((state) => state.isLive);

  return (
    <div className="flex size-full h-[calc(100vh-80px)] px-4 py-7 lg:space-x-4">
      {isLive && <AuctionRealtimeListener auctionId={auction.id} />}
      <WinningScreen auction={auction} />

      <section className="relative mb-10 hidden h-full w-72 overflow-hidden rounded-3xl p-4 lg:block">
        {graphics}
        <h3 className="px-2 pb-2 text-muted-foreground">Current Bid leaders</h3>
        <div className="">
          <BidsSnapshot auctionId={auction.id} />
        </div>
      </section>

      <section className="relative size-full h-full w-fit flex-grow overflow-hidden rounded-3xl text-muted-foreground">
        {graphics}
        <Screen auction={auction} />
      </section>

      <section className="relative hidden h-full w-72 flex-col justify-between overflow-hidden rounded-3xl xl:flex 2xl:w-80">
        {graphics}
        <div>
          <h3 className="p-4 pb-2 text-muted-foreground">Bids History</h3>
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
    <div className="absolute inset-0 -z-10 rounded-3xl border-2 border-brand-darker/25 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
    <div className="absolute inset-0 -z-10 rounded-3xl border-2 border-brand-darker/15 [mask-image:linear-gradient(to_top,black,transparent)]" />
    <div className="absolute left-0 top-0 -z-10 size-20 rounded-full bg-brand-darker/20 blur-3xl" />
    <div className="absolute right-0 top-0 -z-10 size-20 rounded-full bg-brand-darker/20 blur-3xl" />
    <div className="absolute inset-0 -z-10 scale-110 bg-gradient-to-b from-foreground/5" />
  </>
);
