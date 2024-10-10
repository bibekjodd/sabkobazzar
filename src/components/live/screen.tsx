import { useMediaQuery } from '@/hooks/use-media-query';
import { formatPrice } from '@/lib/utils';
import { useBidsSnapshot } from '@/queries/use-bids-snapshot';
import { ChevronDownIcon, RadioIcon } from 'lucide-react';
import { BidsHistoryDrawer } from './bids-history';
import { BidsSnapshotDrawer } from './bids-snapshot';
import PlaceBid from './place-bid';
import AuctionDetailsDrawer from '../drawers/auction-details-drawer';

export default function Screen({ auction }: { auction: Auction }) {
  const { data } = useBidsSnapshot(auction.id);
  const currentBid = data?.at(0)?.amount || 0;
  const screenWidth = useMediaQuery();

  return (
    <div className="relative flex size-full flex-col justify-between">
      <div className="mt-2 p-4">
        <h3 className="text-balance text-center text-xl text-indigo-200 xs:text-2xl">
          <RadioIcon className="mx-2 inline size-6 -translate-y-0.5 xs:size-8" />
          Live {auction.title}
        </h3>
      </div>
      <div className="grid size-full place-items-center">
        <div>
          <div className="flex flex-col items-center space-y-3">
            <span className="text-3xl font-semibold text-indigo-200 xs:text-4xl sm:text-5xl">
              Rs {formatPrice(currentBid)}
            </span>
            <span className="">Current Bid</span>
          </div>
        </div>
      </div>
      <PlaceBid auctionId={auction.id} minBid={auction.minBid} />
      <div className="mb-2 mr-6 flex flex-wrap justify-end gap-y-1 space-x-2">
        <AuctionDetailsDrawer auction={auction}>
          <button className="flex items-center space-x-2 rounded-md border border-indigo-200/10 px-2 py-1 text-xs">
            <span>Auction details</span>
            <ChevronDownIcon className="size-3" />
          </button>
        </AuctionDetailsDrawer>
        {screenWidth < 1024 && (
          <BidsSnapshotDrawer auctionId={auction.id}>
            <button className="flex items-center space-x-2 rounded-md border border-indigo-200/10 px-2 py-1 text-xs">
              <span>Bids Snapshot</span>
              <ChevronDownIcon className="size-3" />
            </button>
          </BidsSnapshotDrawer>
        )}
        {screenWidth < 1280 && (
          <BidsHistoryDrawer auctionId={auction.id}>
            <button className="flex items-center space-x-2 rounded-md border border-indigo-200/10 px-2 py-1 text-xs">
              <span>Bids History</span>
              <ChevronDownIcon className="size-3" />
            </button>
          </BidsHistoryDrawer>
        )}
      </div>
    </div>
  );
}