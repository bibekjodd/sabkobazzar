'use client';

import { dummyProductImage } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronsRight } from 'lucide-react';
import CancelAuctionDialog from '../dialogs/cancel-auction-dialog';
import { Button } from '../ui/button';
import ProgressLink from '../utils/progress-link';

export default function AuctionCard({ auction }: { auction: Auction }) {
  const auctionLink = `/auctions/${auction.id}`;
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData<User>(['profile']);
  const upadateCache = () => {
    queryClient.setQueryData(['auction', auction.id], { ...auction });
  };

  const canCancelAuction =
    profile?.id === auction.ownerId && !auction.isCancelled && !auction.isFinished;

  return (
    <div className="relative w-full rounded-lg filter backdrop-blur-3xl">
      {graphics}

      <ProgressLink href={auctionLink} onClick={upadateCache}>
        <img
          src={auction.banner || auction.product.image || dummyProductImage}
          alt="banner image"
          className="aspect-video w-full rounded-lg object-contain p-0.5"
        />
      </ProgressLink>

      <div className="mt-2.5 px-4">
        <h3 className="mb-1 line-clamp-2 text-xl">{auction.title}</h3>
        <p className="text-sm text-gray-400">Scheduled for {formatDate(auction.startsAt)}</p>

        <div className="mt-5 flex flex-col space-y-1 pb-4">
          {canCancelAuction && (
            <CancelAuctionDialog auctionId={auction.id}>
              <button className="w-full rounded-lg border border-primary/10 py-2 text-sm hover:bg-gray-400 hover:text-black">
                Cancel
              </button>
            </CancelAuctionDialog>
          )}

          <ProgressLink href={auctionLink} onClick={upadateCache}>
            <Button Icon={ChevronsRight} variant="gradient" className="w-full">
              See more details
            </Button>
          </ProgressLink>
        </div>
      </div>
    </div>
  );
}

const graphics = (
  <>
    <div className="absolute inset-0 -z-10 rounded-lg border-2 border-purple-500/10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
    <div className="absolute inset-0 -z-10 rounded-lg border-2 border-purple-900/40 [mask-image:linear-gradient(to_top,black,transparent)]" />

    <div className="absolute left-10 top-10 -z-20 size-20 rounded-full bg-white/60 blur-3xl filter" />
    <div className="absolute bottom-10 right-10 -z-20 size-20 rounded-full bg-purple-400/50 blur-3xl filter" />
    <div className="absolute bottom-10 left-10 -z-20 size-20 rounded-full bg-sky-400/50 blur-3xl filter" />
  </>
);
