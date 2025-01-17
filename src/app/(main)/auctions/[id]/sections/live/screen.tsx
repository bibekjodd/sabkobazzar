import { openAuctionDetailsDrawer } from '@/components/drawers/auction-details-drawer';
import { Button } from '@/components/ui/button';
import { useBidsSnapshot } from '@/queries/use-bids-snapshot';
import { useProfile } from '@/queries/use-profile';
import { useAuctionStore } from '@/stores/use-auction-store';
import NumberFlow from '@number-flow/react';
import { ChevronDownIcon, ClockIcon, LogOutIcon, RadioIcon } from 'lucide-react';
import { closeLiveScreen, forceCloseLiveScreen } from '.';
import { openBidsHistoryDrawer } from './bids-history';
import { openBidsSnapshotDrawer } from './bids-snapshot';
import PlaceBidOptions from './place-bid-options';
import { openSendMessageDialog } from './send-message';

export default function Screen({ auction }: { auction: Auction }) {
  const { data } = useBidsSnapshot(auction.id);
  const currentBid = data?.at(0)?.amount || 0;
  const { data: profile } = useProfile();
  const isLive = useAuctionStore((state) => state.isLive);

  return (
    <div className="relative flex size-full flex-col justify-between">
      <div className="mt-2 p-4">
        <h3 className="text-balance text-center text-xl text-muted-foreground xs:text-2xl">
          <RadioIcon className="mx-2 inline size-6 -translate-y-0.5 xs:size-8" />
          Live {auction.title}
        </h3>
        <Timer />
      </div>
      <div className="grid size-full place-items-center">
        <div>
          <div className="flex flex-col items-center space-y-3">
            <span className="text-3xl font-semibold text-muted-foreground sm:text-5xl">
              Rs <NumberFlow value={currentBid} format={{ notation: 'standard' }} locales="en-IN" />
            </span>
            {!(auction.status === 'completed' || auction.status === 'unbidded') && (
              <span className="font-medium">Current Bid</span>
            )}
            {auction.status === 'unbidded' && (
              <span className="font-medium text-error">Auction went unsold!</span>
            )}
            {auction.status === 'completed' && auction.winner && (
              <p className="text-balance text-center text-2xl font-medium text-brand">
                {auction.winner.id === profile?.id ? (
                  <span> Congratulations! you won the auction 🎉</span>
                ) : (
                  <span>{auction.winner.name} won the auction!</span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
      {!(auction.status === 'completed' || auction.status === 'unbidded') && (
        <PlaceBidOptions auctionId={auction.id} minBid={auction.minBid} />
      )}
      {(auction.status === 'completed' || auction.status === 'unbidded') && (
        <div className="flex justify-center py-4">
          <Button variant="ghost" Icon={LogOutIcon} className="border" onClick={closeLiveScreen}>
            Return back
          </Button>
        </div>
      )}
      <div className="mb-2 mr-6 flex flex-wrap justify-end gap-y-1 space-x-2">
        <button
          onClick={() => openAuctionDetailsDrawer(auction.id)}
          className="flex items-center space-x-2 rounded-md border border-foreground/10 px-2 py-1 text-xs hover:border-foreground/40 focus:border-foreground/40"
        >
          <span>Auction details</span>
          <ChevronDownIcon className="size-3" />
        </button>
        <button
          onClick={() => openBidsSnapshotDrawer()}
          className="flex items-center space-x-2 rounded-md border border-foreground/10 px-2 py-1 text-xs hover:border-foreground/40 focus:border-foreground/40 lg:hidden"
        >
          <span>Bids Snapshot</span>
          <ChevronDownIcon className="size-3" />
        </button>

        <button
          onClick={() => openBidsHistoryDrawer()}
          className="flex items-center space-x-2 rounded-md border border-foreground/10 px-2 py-1 text-xs hover:border-foreground/40 focus:border-foreground/40 xl:hidden"
        >
          <span>Bids History</span>
          <ChevronDownIcon className="size-3" />
        </button>

        {auction.participationStatus === 'joined' && (
          <button
            onClick={() => openSendMessageDialog()}
            className="flex items-center space-x-2 rounded-md border border-foreground/10 px-2 py-1 text-xs hover:border-foreground/40 focus:border-foreground/40 xl:hidden"
          >
            <span>Send Message</span>
            <ChevronDownIcon className="size-3" />
          </button>
        )}

        {isLive && (
          <button
            onClick={forceCloseLiveScreen}
            className="flex items-center space-x-2 rounded-md border border-foreground/10 px-2 py-1 text-xs hover:border-foreground/40 focus:border-foreground/40"
          >
            <span>Exit live</span>
            <LogOutIcon className="size-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function Timer() {
  const { hours, minutes, seconds } = useAuctionStore((state) => state.finishTimer);
  const isLive = useAuctionStore((state) => state.isLive);
  if (!isLive) return null;
  return (
    <div className="flex items-center space-x-1.5 pt-6">
      <ClockIcon className="size-4" />
      <p>
        {hours >= 10 ? hours : `0${hours}`}:{minutes >= 10 ? minutes : `0${minutes}`}:
        {seconds >= 10 ? seconds : `0${seconds}`}
      </p>
    </div>
  );
}
