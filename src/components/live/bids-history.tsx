import { formatPrice } from '@/lib/utils';
import { useBids } from '@/queries/use-bids';
import moment from 'moment';
import React from 'react';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../ui/drawer';
import Avatar from '../utils/avatar';
import InfiniteScrollObserver from '../utils/infinite-scroll-observer';

export default function BidsHistory({ auctionId }: { auctionId: string }) {
  const { data: bids, hasNextPage, isFetching, fetchNextPage } = useBids(auctionId);
  return (
    <section className="flex size-full flex-col space-y-2 overflow-y-auto scrollbar-hide">
      {bids?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.map((bid) => (
            <BidItem key={bid.id} bid={bid} />
          ))}
        </React.Fragment>
      ))}
      <InfiniteScrollObserver
        showLoader
        isFetching={isFetching}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </section>
  );
}

function BidItem({ bid }: { bid: Bid }) {
  return (
    <section className="mx-2 flex flex-col rounded-lg bg-background/20 px-4 py-2 text-sm text-indigo-200">
      <div className="flex items-center space-x-3">
        <Avatar src={bid.bidder.image} size="sm" />
        <div className="flex flex-col">
          <span className="text-xs text-indigo-200/80">{bid.bidder.name}</span>
          <span className="font-medium">Rs {formatPrice(bid.amount)}</span>
        </div>
      </div>
      <span className="mt-2 text-xs italic text-indigo-200/50">{moment(bid.at).fromNow()}</span>
    </section>
  );
}

export function BidsHistoryDrawer({
  children,
  auctionId
}: {
  auctionId: string;
  children: React.ReactNode;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="flex h-screen max-h-[600px] flex-col bg-background/50 backdrop-blur-3xl">
        <DrawerHeader>
          <DrawerTitle>Bids History</DrawerTitle>
        </DrawerHeader>
        <section className="h-full overflow-y-auto">
          <BidsHistory auctionId={auctionId} />
        </section>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full bg-transparent">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
