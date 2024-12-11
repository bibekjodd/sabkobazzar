'use client';

import { Button } from '@/components/ui/button';
import { dummyAuctionBanner, MILLIS } from '@/lib/constants';
import {
  canJoinAuction,
  canLeaveAuction,
  cn,
  formatDate,
  formatPrice,
  isAuctionCompleted
} from '@/lib/utils';
import { useInterested } from '@/mutations/use-interested';
import { useAuction } from '@/queries/use-auction';
import { useProfile } from '@/queries/use-profile';
import { AutoAnimate } from '@jodd/auto-animate';
import {
  BadgeDollarSignIcon,
  BadgeMinusIcon,
  ChartNoAxesGanttIcon,
  CheckCheckIcon,
  ClockIcon,
  CopyIcon,
  LogOutIcon,
  ReceiptTextIcon,
  TicketPlusIcon,
  UserRoundIcon,
  UsersRoundIcon,
  VoteIcon
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import UserHoverCard from './cards/user-hover-card';
import JoinAuctionDialog from './dialogs/join-auction-dialog';
import LeaveAuctionDialog from './dialogs/leave-auction.dialog';
import { openLoginDialog } from './dialogs/require-login-dialog';
import { openAuctionDetailsDrawer } from './drawers/auction-details-drawer';
import { Skeleton } from './ui/skeleton';
import Avatar from './utils/avatar';
import CopyToClipboard from './utils/copy-to-clipboard';

type Props = {
  auction: Auction;
};
export default function AuctionOverview({ auction: auctionData }: Props) {
  const { data: profile } = useProfile();
  const { data } = useAuction(auctionData.id, {
    initialData: auctionData,
    refetchInterval: MILLIS.MINUTE
  });
  const auction = data || auctionData;
  const images = [auction.banner || dummyAuctionBanner, ...(auction.productImages || [])];
  const [tempActiveImage, setTempActiveImage] = useState<string | null>(images[0]);
  const [activeImage, setActiveImage] = useState(images[0]);

  const { mutate: setInterested, isPending } = useInterested(auction.id);

  const canUserJoinAuction = canJoinAuction({ auction, userId: profile?.id! });
  const canUserLeaveAuction = canLeaveAuction({ auction });
  const isCompleted = isAuctionCompleted(auction);

  return (
    <div>
      <div className="relative mx-auto w-fit border-b-2 border-purple-500 px-4 pb-3">
        <h3 className="text-center text-xl font-semibold text-purple-500 xs:text-xl sm:text-4xl">
          {auction.title}
        </h3>
      </div>

      <div className="mt-7 grid space-y-12 md:grid-cols-2 md:space-y-0">
        <section className="flex flex-col space-y-3">
          <AutoAnimate>
            <img
              key={tempActiveImage || activeImage}
              src={tempActiveImage || activeImage}
              loading="lazy"
              decoding="async"
              alt="auction banner"
              className="my-auto aspect-video w-full object-contain"
            />
          </AutoAnimate>
          <div className="flex items-center justify-center space-x-2">
            {images.map((image) => (
              <button
                onMouseOver={() => setTempActiveImage(image)}
                onMouseOut={() => setTempActiveImage(null)}
                onClick={() => setActiveImage(image)}
                key={image}
                className={cn(
                  'h-full w-fit max-w-[20%] overflow-hidden rounded-sm border border-transparent bg-background',
                  {
                    'border-indigo-200/25': image === activeImage
                  }
                )}
              >
                <img
                  src={image}
                  loading="lazy"
                  decoding="async"
                  alt="product image"
                  className="max-h-20 object-contain"
                />
              </button>
            ))}
          </div>
        </section>

        <section className="relative flex flex-col pt-5 text-sm text-indigo-200/80 md:pl-10 md:pt-0">
          <div className="absolute bottom-0 right-0 -z-10 aspect-square w-1/2 rounded-full bg-purple-400/10 blur-3xl filter" />
          <div className="absolute left-0 top-0 -z-10 aspect-square w-1/2 rounded-full bg-sky-400/10 blur-3xl filter" />
          <div className="absolute inset-0 -z-20 rounded-lg bg-background/20 blur-3xl filter" />
          <h3 className="text-2xl font-semibold text-indigo-100">{auction.productTitle}</h3>
          <div className="mt-2 w-full space-y-2 [&_svg]:inline [&_svg]:size-3.5">
            <div className="flex items-center space-x-2">
              <p>sku id: {auction.id}</p>
              <CopyToClipboard onSuccess={() => toast.success('Copied auction id')}>
                {({ state, copy }) => (
                  <button onClick={() => copy(auction.id)}>
                    {state === 'ready' && <CopyIcon className="size-3" />}
                    {state === 'success' && <CheckCheckIcon className="size-3" />}
                  </button>
                )}
              </CopyToClipboard>
            </div>

            <p>
              <VoteIcon /> Condition: <span className="capitalize">{auction.condition}</span>
            </p>
            <p>
              <ReceiptTextIcon /> Current lot: {auction.lot}
              {auction.lot % 10 === 1 && 'st'}
              {auction.lot % 10 === 2 && 'nd'}
              {auction.lot % 10 === 3 && 'rd'}
              {auction.lot % 10 > 3 && 'th'}
            </p>
            <p>
              <BadgeDollarSignIcon /> Minimum bid amount:{' '}
              <span className="font-medium">{formatPrice(auction.minBid)}</span>
            </p>
            <p>
              <UsersRoundIcon />{' '}
              <span>
                Allowed participants: {auction.minBidders}-{auction.maxBidders}
              </span>
            </p>
            <p>
              <ClockIcon /> Scheduled for: {formatDate(auction.startsAt)}
            </p>
          </div>

          <div className="mt-2">
            <UserRoundIcon className="inline size-3.5" /> <span className="">Hosted by: </span>
            <UserHoverCard user={auction.owner}>
              <div className="inline-flex items-center space-x-1 hover:underline">
                <p> {auction.owner.name}</p>
                <Avatar src={auction.owner.image} size="sm" />
              </div>
            </UserHoverCard>
          </div>

          {auction.description && (
            <div className="pt-3">
              <p>Description</p>
              <p className="">{auction.description} </p>
            </div>
          )}

          <div className="flex flex-col space-y-2 pt-7">
            {canUserJoinAuction &&
              (profile ? (
                <JoinAuctionDialog auctionId={auction.id}>
                  <Button Icon={TicketPlusIcon}>Join Auction</Button>
                </JoinAuctionDialog>
              ) : (
                <Button onClick={openLoginDialog}>Join Auction</Button>
              ))}
            {canUserLeaveAuction && (
              <LeaveAuctionDialog auctionId={auction.id}>
                <Button variant="outline" Icon={LogOutIcon}>
                  Leave Auction
                </Button>
              </LeaveAuctionDialog>
            )}

            {auction.owner.id === profile?.id && <Button disabled>Join Auction</Button>}

            {isCompleted && (
              <Button
                onClick={() => openAuctionDetailsDrawer(auction.id)}
                variant="secondary"
                Icon={ChartNoAxesGanttIcon}
              >
                See Results
              </Button>
            )}

            {!isCompleted && (
              <Button
                variant="outline"
                Icon={auction.isInterested ? BadgeMinusIcon : CheckCheckIcon}
                onClick={() => setInterested(!auction.isInterested)}
                disabled={isPending || auction.owner.id === profile?.id}
                loading={isPending}
              >
                {auction.isInterested ? 'Remove from interested' : 'Add to interested'}
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export const auctionOverviewSkeleton = (
  <div className="cont">
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
          <Skeleton className="h-24" />
        </div>

        <div className="mt-auto space-y-2 pt-5">
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
        </div>
      </div>
    </div>
  </div>
);
