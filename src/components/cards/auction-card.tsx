'use client';

import { dummyAuctionBanner } from '@/lib/constants';
import {
  canJoinAuction,
  canLeaveAuction,
  formatDate,
  isAuctionCompleted,
  isAuctionLive,
  isAuctionPending
} from '@/lib/utils';
import { useAuction } from '@/queries/use-auction';
import { useProfile } from '@/queries/use-profile';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import {
  BanIcon,
  ChartNoAxesGanttIcon,
  CircleCheckBigIcon,
  FlameIcon,
  GlobeIcon,
  GlobeLockIcon,
  RadioIcon
} from 'lucide-react';
import { openAuthDialog } from '../dialogs/auth-dialog';
import { openJoinAuctionDialog } from '../dialogs/join-auction-dialog';
import { openLeaveAuctionDialog } from '../dialogs/leave-auction.dialog';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

type Props = {
  auction: Auction;
};
export default function AuctionCard({ auction: auctionData }: Props) {
  const auctionLink = `/auctions/${auctionData.id}`;
  const { data: profile } = useProfile();

  const { data } = useAuction(auctionData.id, { initialData: auctionData });
  const auction = data || auctionData;

  const canUserJoinAuction = canJoinAuction({ auction, userId: profile?.id! });
  const canUserLeaveAuction = canLeaveAuction({ auction });
  const isCompleted = isAuctionCompleted(auction);
  const isPending = isAuctionPending(auction);
  const isLive = isAuctionLive(auction);

  return (
    <div className="relative flex h-full w-full flex-col rounded-lg filter backdrop-blur-3xl">
      {graphics}

      <ProgressLink href={auctionLink} className="relative">
        {auction.status === 'cancelled' && (
          <div className="absolute right-1.5 top-1.5 z-10 flex w-fit items-center space-x-2 rounded-full bg-error px-2 py-0.5 text-sm text-white">
            <BanIcon className="size-3" />
            <span>Cancelled</span>
          </div>
        )}

        {isPending && (
          <div className="absolute right-1.5 top-1.5 z-10 flex w-fit items-center space-x-2 rounded-full bg-brand-darker px-2 py-0.5 text-sm text-white">
            <RadioIcon className="size-3" />
            <span>Coming live</span>
          </div>
        )}

        {isLive && (
          <div className="absolute right-1.5 top-1.5 z-10 flex w-fit items-center space-x-2 rounded-full bg-brand-darker px-2 py-0.5 text-sm text-white">
            <RadioIcon className="size-3" />
            <span>Live</span>
          </div>
        )}

        {isCompleted && (
          <div className="absolute right-1.5 top-1.5 z-10 flex w-fit items-center space-x-2 rounded-full bg-success px-2 py-0.5 text-sm text-white">
            <CircleCheckBigIcon className="size-3" />
            <span>Sold out</span>
          </div>
        )}

        <img
          src={auction.banner || dummyAuctionBanner}
          loading="lazy"
          decoding="async"
          alt="banner image"
          className="aspect-video w-full object-cover p-0.5"
        />
      </ProgressLink>

      <div className="mt-2.5 px-4">
        <h3 className="line-clamp-2 text-xl">{auction.title}</h3>
        <div className="my-1 flex items-center space-x-1.5 text-sm text-muted-foreground">
          {auction.isInviteOnly ? (
            <>
              <GlobeLockIcon className="size-3.5" />
              <span>Private Auction</span>
            </>
          ) : (
            <>
              <GlobeIcon className="size-3.5" />
              <span>Public Auction</span>
            </>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Scheduled for {formatDate(auction.startsAt)}
        </p>
      </div>

      <div className="mt-auto flex flex-col space-y-1 px-4 pb-4 pt-5">
        <ProgressLink href={auctionLink}>
          <Button variant="brand" Icon={ChartNoAxesGanttIcon} className="flex w-full items-center">
            <span>See More Details</span>
          </Button>
        </ProgressLink>

        {canUserJoinAuction && (
          <Button
            Icon={FlameIcon}
            onClick={() => {
              if (profile) return openJoinAuctionDialog(auction.id);
              openAuthDialog();
            }}
            className="w-full"
          >
            Join Auction
          </Button>
        )}

        {canUserLeaveAuction && (
          <Button
            onClick={() => openLeaveAuctionDialog(auction.id)}
            variant="outline"
            className="w-full"
          >
            Leave Auction
          </Button>
        )}
      </div>
    </div>
  );
}

const graphics = (
  <>
    <div className="absolute inset-0 -z-10 rounded-lg border-2 border-brand-darker/10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
    <div className="absolute inset-0 -z-10 rounded-lg border-2 border-purple-900/40 [mask-image:linear-gradient(to_top,black,transparent)]" />

    <div className="absolute left-10 top-10 -z-20 size-20 rounded-full bg-white/60 blur-3xl filter" />
    <div className="absolute bottom-10 right-10 -z-20 size-20 rounded-full bg-brand/50 blur-3xl filter" />
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
