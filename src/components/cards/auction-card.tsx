'use client';

import { dummyProductImage } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronsRight } from 'lucide-react';
import CancelAuctionDialog from '../dialogs/cancel-auction-dialog';
import { Button } from '../ui/button';
import ProgressLink from '../utils/progress-link';
import { Skeleton } from '../ui/skeleton';

type Props = {
  auction: Auction;
  showCancelButton?: boolean;
  showJoinButton?: boolean;
};
export default function AuctionCard({ auction, showCancelButton }: Props) {
  const auctionLink = `/auctions/${auction.id}`;
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData<User>(['profile']);
  const upadateCache = () => {
    queryClient.setQueryData(['auction', auction.id], { ...auction });
  };

  const canCancelAuction =
    profile?.id === auction.ownerId && !auction.isCancelled && !auction.isFinished;

  const canJoinAuction =
    !auction.isCancelled &&
    !auction.isFinished &&
    Date.now() < new Date(auction.startsAt).getTime() &&
    profile?.id !== auction.ownerId;

  return (
    <div className="relative flex h-full w-full flex-col rounded-lg filter backdrop-blur-3xl">
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
      </div>

      <div className="mt-auto flex flex-col space-y-1 px-4 pb-4 pt-5">
        {canJoinAuction && (
          <button className="h-9 w-full rounded-lg bg-gradient-to-b from-gray-400 to-gray-500/90 py-2 text-center text-sm font-medium text-background hover:brightness-125">
            Join Auction
          </button>
        )}
        <ProgressLink href={auctionLink} onClick={upadateCache}>
          <Button variant="gradient" className="flex w-full items-center">
            <span>See more details</span>
            <ChevronsRight className="ml-1 size-4" />
          </Button>
        </ProgressLink>

        {canCancelAuction && showCancelButton && (
          <CancelAuctionDialog auctionId={auction.id}>
            <button className="w-full rounded-lg border border-primary/10 py-2 text-sm hover:bg-gray-400 hover:text-black">
              Cancel Auction
            </button>
          </CancelAuctionDialog>
        )}
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

export const auctionCardSkeleton = (
  <div className="flex flex-col space-y-2">
    <Skeleton className="aspect-video w-full" />
    <Skeleton className="h-9" />
    <Skeleton className="h-9" />
    <Skeleton className="h-9" />
  </div>
);