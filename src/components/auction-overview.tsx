'use client';

import { Button } from '@/components/ui/button';
import { dummyProductImage, MILLIS } from '@/lib/constants';
import { prefetchProduct } from '@/lib/query-utils';
import { canJoinAuction, canLeaveAuction, formatDate, formatPrice } from '@/lib/utils';
import { useAuction } from '@/queries/use-auction';
import { useProfile } from '@/queries/use-profile';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { ChevronsRightIcon, CopyIcon } from 'lucide-react';
import JoinAuctionDialog from './dialogs/join-auction-dialog';
import LeaveAuctionDialog from './dialogs/leave-auction.dialog';
import { openLoginDialog } from './dialogs/require-login-dialog';
import { Skeleton } from './ui/skeleton';
import Avatar from './utils/avatar';

type Props = {
  auction: Auction;
  showProductLinkButton?: boolean;
  showProductDetails?: boolean;
};
export default function AuctionOverview({ auction: auctionData, showProductLinkButton }: Props) {
  const { data: profile } = useProfile();
  const { data } = useAuction(auctionData.id, {
    initialData: auctionData,
    refetchInterval: MILLIS.MINUTE
  });
  const auction = data || auctionData;

  const canUserJoinAuction = canJoinAuction({ auction, userId: profile?.id! });
  const canUserLeaveAuction = canLeaveAuction({ auction });

  return (
    <div>
      <div className="relative mx-auto w-fit border-b-2 border-purple-800 px-4 pb-3">
        <h3 className="text-center text-xl font-semibold text-purple-800 xs:text-xl sm:text-4xl">
          {auction.title}
        </h3>
      </div>

      <div className="mt-7 grid md:grid-cols-2">
        <img
          src={auction.banner || auction.product.image || dummyProductImage}
          alt="auction banner"
          className="my-auto aspect-video w-full object-contain"
        />

        <section className="relative flex flex-col pt-5 text-sm text-gray-400/90 md:pl-10 md:pt-0">
          <div className="absolute bottom-0 right-0 -z-10 aspect-square w-1/2 rounded-full bg-purple-400/10 blur-3xl filter" />
          <div className="absolute left-0 top-0 -z-10 aspect-square w-1/2 rounded-full bg-sky-400/10 blur-3xl filter" />
          <div className="absolute inset-0 -z-20 rounded-lg bg-background/20 blur-3xl filter" />
          <h3 className="text-2xl font-semibold text-gray-300">{auction.product.title}</h3>
          <div className="mt-2 w-full space-y-1">
            <div className="flex items-center space-x-2">
              <p>sku id - {auction.id}</p>
              <CopyIcon className="size-3" />
            </div>

            <p>
              Condition - <span className="capitalize">{auction.condition}</span>
            </p>
            <p>
              Current lot - {auction.lot}
              {auction.lot % 10 === 1 && 'st'}
              {auction.lot % 10 === 2 && 'nd'}
              {auction.lot % 10 === 3 && 'rd'}
              {auction.lot % 10 > 3 && 'th'}
            </p>
            <p>Minimum bid amount - Rs. {formatPrice(auction.minBid)}</p>
            <p>
              Allowed participants {auction.minBidders}-{auction.maxBidders}
            </p>
            <p>Scheduled for - {formatDate(auction.startsAt)}</p>
          </div>

          <div className="mt-2">
            <span className="">Hosted by - </span>
            <div className="inline-flex items-center space-x-3">
              <p> {auction.owner.name}</p>
              <Avatar src={auction.owner.image} size="sm" />
            </div>
          </div>

          {auction.description && (
            <div className="mt-3">
              <p>Description</p>
              <p className="text-gray-400/60">{auction.description}</p>
            </div>
          )}

          <div className="mt-auto flex flex-col space-y-2 pt-7">
            {showProductLinkButton && (
              <ProgressLink
                href={`/products/${auction.productId}`}
                onClick={() => prefetchProduct({ ...auction.product, owner: auction.owner })}
              >
                <Button variant="secondary" className="w-full" Icon={ChevronsRightIcon}>
                  See Product Details
                </Button>
              </ProgressLink>
            )}

            {canUserJoinAuction &&
              (profile ? (
                <JoinAuctionDialog auctionId={auction.id}>
                  <Button>Join Auction</Button>
                </JoinAuctionDialog>
              ) : (
                <Button onClick={openLoginDialog}>Join Auction</Button>
              ))}
            {canUserLeaveAuction && (
              <LeaveAuctionDialog auctionId={auction.id}>
                <Button variant="outline">Leave Auction</Button>
              </LeaveAuctionDialog>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export const auctionOverviewSkeleton = (
  <div>
    <Skeleton className="mx-auto mb-3 h-10 w-full max-w-96" />
    <div className="grid w-full space-y-5 md:grid-cols-2 md:space-y-0">
      <Skeleton className="aspect-video" />
      <div className="flex w-full flex-col md:pl-10">
        <div className="space-y-2">
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
        </div>

        <div className="mt-auto space-y-2 pt-5">
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
        </div>
      </div>
    </div>
  </div>
);
