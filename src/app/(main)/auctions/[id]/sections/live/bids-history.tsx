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
import Avatar from '@/components/utils/avatar';
import InfiniteScrollObserver from '@/components/utils/infinite-scroll-observer';
import { MILLIS } from '@/lib/constants';
import { formatPrice, setImmediateInterval } from '@/lib/utils';
import { useBids } from '@/queries/use-bids';
import { createStore } from '@jodd/snap';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { HistoryIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

dayjs.extend(relativeTime);

type BidItemData = Bid & { timeAgo: string };
const makeupBidsData = (bids: Bid[]): BidItemData[] => {
  return bids.map((bid) => ({
    ...bid,
    timeAgo: dayjs(bid.createdAt).fromNow()
  }));
};

export default function BidsHistory({ auctionId }: { auctionId: string }) {
  const { data, hasNextPage, isFetching, fetchNextPage } = useBids({ auctionId, sort: 'desc' });
  const [bids, setBids] = useState<BidItemData[] | undefined>(undefined);

  useEffect(() => {
    const interval = setImmediateInterval(() => {
      if (!data) setBids(undefined);
      else setBids(makeupBidsData(data));
    }, MILLIS.SECOND * 30);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <section className="flex size-full flex-col space-y-2 overflow-y-auto pb-6 scrollbar-hide">
      {bids?.map((bid) => <BidItem key={bid.id} bid={bid} />)}
      <InfiniteScrollObserver
        showLoader
        isFetching={isFetching}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </section>
  );
}

function BidItem({ bid }: { bid: BidItemData }) {
  return (
    <section className="mx-2 flex flex-col rounded-lg bg-muted-foreground/[0.03] px-4 py-2 text-sm text-muted-foreground">
      <div className="flex items-center space-x-3">
        <Avatar src={bid.bidder.image} size="sm" />
        <div className="flex flex-col">
          <span className="text-muted-foreground">{bid.bidder.name}</span>
          <span className="pt-0.5 font-medium">{formatPrice(bid.amount)}</span>
        </div>
      </div>
      <span className="mt-2 text-xs italic text-muted-foreground">{bid.timeAgo}</span>
    </section>
  );
}

const useDrawer = createStore<{ isOpen: boolean }>(() => ({
  isOpen: false
}));
const onOpenChange = (isOpen: boolean) => useDrawer.setState({ isOpen });
export const openBidsHistoryDrawer = () => onOpenChange(true);
export const closeBidsHistoryDrawer = () => onOpenChange(false);

export function BidsHistoryDrawer({ auctionId }: { auctionId: string }) {
  const { isOpen } = useDrawer();

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="flex h-screen max-h-[600px] flex-col bg-background/50 backdrop-blur-3xl">
        <DrawerHeader>
          <DrawerTitle className="flex items-center space-x-2">
            <HistoryIcon className="size-5" />
            <span>Bids History</span>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="hidden" />
        <ScrollArea className="h-full">
          {auctionId && <BidsHistory auctionId={auctionId} />}
        </ScrollArea>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
