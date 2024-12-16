'use client';

import ManageAuctionDialog from '@/components/dialogs/manage-auction-dialog';
import { dummyAuctionBanner } from '@/lib/constants';
import { canJoinAuction, canLeaveAuction, formatDate, isAuctionPending } from '@/lib/utils';
import { useAuction } from '@/queries/use-auction';
import { useProfile } from '@/queries/use-profile';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { ChartNoAxesGanttIcon, ChevronsRight, GlobeLockIcon, InfoIcon } from 'lucide-react';
import JoinAuctionDialog from '../dialogs/join-auction-dialog';
import LeaveAuctionDialog from '../dialogs/leave-auction.dialog';
import { openRequireLoginDialog } from '../dialogs/require-login-dialog';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type Props = {
  auction: Auction;
  showJoinButton?: boolean;
  showInviteOnlyInfo?: boolean;
  showManageAuctionButton?: boolean;
};
export default function AuctionCard({
  auction: auctionData,
  showJoinButton,
  showInviteOnlyInfo,
  showManageAuctionButton
}: Props) {
  const auctionLink = `/auctions/${auctionData.id}`;
  const { data: profile } = useProfile();

  const { data } = useAuction(auctionData.id, { initialData: auctionData });
  const auction = data || auctionData;

  const canUserJoinAuction = canJoinAuction({ auction, userId: profile?.id! });
  const canUserLeaveAuction = canLeaveAuction({ auction });
  const canShowInviteOnlyInfo =
    showInviteOnlyInfo &&
    auction.isInviteOnly &&
    isAuctionPending(auction) &&
    auction.ownerId !== profile?.id;

  return (
    <div className="relative flex h-full w-full flex-col rounded-lg filter backdrop-blur-3xl">
      {graphics}

      <ProgressLink href={auctionLink}>
        <img
          src={auction.banner || dummyAuctionBanner}
          loading="lazy"
          decoding="async"
          alt="banner image"
          className="aspect-video w-full rounded-lg object-contain p-0.5"
        />
      </ProgressLink>

      <div className="mt-2.5 px-4">
        <h3 className="line-clamp-2 text-xl">{auction.title}</h3>
        {auction.isInviteOnly && (
          <div className="my-1 flex items-center space-x-1.5 text-sm text-indigo-200/90">
            <GlobeLockIcon className="size-3.5" />
            <span>Private Auction</span>
          </div>
        )}
        <p className="text-sm text-indigo-200/80">Scheduled for {formatDate(auction.startsAt)}</p>
        {canShowInviteOnlyInfo && (
          <p className="mt-1 text-sm text-gray-400/80">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="inline size-3.5 -translate-y-[1px]" />
                </TooltipTrigger>
                <TooltipContent className="bg-gray-300 font-medium">
                  <p>This is invite only auction and only invited members can join the auction.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>{' '}
            Invite only auction
          </p>
        )}
      </div>

      <div className="mt-auto flex flex-col space-y-1 px-4 pb-4 pt-5">
        <ProgressLink href={auctionLink}>
          <Button className="flex w-full items-center">
            <span>See more</span>
            <ChevronsRight className="ml-1 size-4" />
          </Button>
        </ProgressLink>

        {canUserJoinAuction &&
          showJoinButton &&
          (profile ? (
            <JoinAuctionDialog auctionId={auction.id}>
              <Button variant="secondary" className="w-full">
                Join Auction
              </Button>
            </JoinAuctionDialog>
          ) : (
            <Button variant="secondary" className="w-full" onClick={openRequireLoginDialog}>
              Join Auction
            </Button>
          ))}

        {canUserLeaveAuction && showJoinButton && (
          <LeaveAuctionDialog auctionId={auction.id}>
            <Button variant="outline" className="w-full">
              Leave Auction
            </Button>
          </LeaveAuctionDialog>
        )}

        {showManageAuctionButton && (
          <ManageAuctionDialog auction={auction}>
            <Button variant="outline" className="w-full" Icon={ChartNoAxesGanttIcon}>
              Manage
            </Button>
          </ManageAuctionDialog>
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
