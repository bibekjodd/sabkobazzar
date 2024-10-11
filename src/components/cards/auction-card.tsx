'use client';

import { dummyProductImage } from '@/lib/constants';
import {
  canCancelAuction,
  canJoinAuction,
  canLeaveAuction,
  formatDate,
  redirectToLogin
} from '@/lib/utils';
import { useAuction } from '@/queries/use-auction';
import { useProfile } from '@/queries/use-profile';
import { ChevronsRight } from 'lucide-react';
import CancelAuctionDialog from '../dialogs/cancel-auction-dialog';
import JoinAuctionDialog from '../dialogs/join-auction-dialog';
import LeaveAuctionDialog from '../dialogs/leave-auction.dialog';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import ProgressLink from '../utils/progress-link';

type Props = {
  auction: Auction;
  showCancelButton?: boolean;
  showJoinButton?: boolean;
};
export default function AuctionCard({
  auction: auctionData,
  showCancelButton,
  showJoinButton
}: Props) {
  const auctionLink = `/auctions/${auctionData.id}`;
  const { data: profile } = useProfile();

  const { data } = useAuction(auctionData.id, { initialData: auctionData });
  const auction = data || auctionData;

  const canUserCancelAuction = canCancelAuction({ auction, userId: profile?.id! });
  const canUserJoinAuction = canJoinAuction({ auction, userId: profile?.id! });
  const canUserLeaveAuction = canLeaveAuction({ auction, userId: profile?.id! });

  return (
    <div className="relative flex h-full w-full flex-col rounded-lg filter backdrop-blur-3xl">
      {graphics}

      <ProgressLink href={auctionLink}>
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
        {canUserJoinAuction &&
          showJoinButton &&
          (profile ? (
            <JoinAuctionDialog auctionId={auction.id}>
              <Button variant="theme-secondary" className="w-full">
                Join Auction
              </Button>
            </JoinAuctionDialog>
          ) : (
            <Button variant="theme-secondary" className="w-full" onClick={redirectToLogin}>
              Join Auction
            </Button>
          ))}
        {canUserLeaveAuction && showJoinButton && (
          <LeaveAuctionDialog auctionId={auction.id}>
            <Button variant="outline" className="w-full bg-transparent">
              Leave Auction
            </Button>
          </LeaveAuctionDialog>
        )}
        <ProgressLink href={auctionLink}>
          <Button variant="theme" className="flex w-full items-center">
            <span>See more details</span>
            <ChevronsRight className="ml-1 size-4" />
          </Button>
        </ProgressLink>

        {canUserCancelAuction && showCancelButton && (
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
