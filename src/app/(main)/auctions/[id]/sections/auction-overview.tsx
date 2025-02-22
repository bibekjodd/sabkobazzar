'use client';

import UserHoverCard from '@/components/cards/user-hover-card';
import { openAuthDialog } from '@/components/dialogs/auth-dialog';
import { openJoinAuctionDialog } from '@/components/dialogs/join-auction-dialog';
import { openLeaveAuctionDialog } from '@/components/dialogs/leave-auction.dialog';
import { openReportAuctionDialog } from '@/components/dialogs/report-auction-dialog';
import { openAuctionDetailsDrawer } from '@/components/drawers/auction-details-drawer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Avatar from '@/components/utils/avatar';
import CopyToClipboard from '@/components/utils/copy-to-clipboard';
import { dummyAuctionBanner, MILLIS } from '@/lib/constants';
import {
  canJoinAuction,
  canLeaveAuction,
  cn,
  formatDate,
  formatPrice,
  isAuctionCompleted,
  isAuctionLive,
  isAuctionPending
} from '@/lib/utils';
import { useInterested } from '@/mutations/use-interested';
import { useAuction } from '@/queries/use-auction';
import { useProfile } from '@/queries/use-profile';
import { AutoAnimate } from '@jodd/auto-animate';
import {
  BadgeDollarSignIcon,
  BanIcon,
  ChartNoAxesGanttIcon,
  CheckCheckIcon,
  CircleCheckBigIcon,
  ClockIcon,
  CopyIcon,
  FlagIcon,
  FlameIcon,
  GlobeLockIcon,
  LogOutIcon,
  MinusCircleIcon,
  RadioIcon,
  ReceiptTextIcon,
  UserRoundIcon,
  UsersRoundIcon,
  VoteIcon
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { openLiveScreen } from './live';

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

  const { mutate: setInterested, isPending: isSettingInterested } = useInterested(auction.id);

  const canUserJoinAuction = canJoinAuction({ auction, userId: profile?.id! });
  const canUserLeaveAuction = canLeaveAuction({ auction });
  const isCompleted = isAuctionCompleted(auction);
  const isPending = isAuctionPending(auction);
  const isLive = isAuctionLive(auction);

  return (
    <div>
      <div className="relative mx-auto w-fit border-b-2 border-brand/80 px-4 pb-3">
        <h3 className="text-center text-xl font-semibold text-brand xs:text-xl sm:text-4xl">
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
              className="my-auto aspect-video w-full object-cover"
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
                    'border-foreground/50': image === activeImage
                  }
                )}
              >
                <img
                  src={image}
                  loading="lazy"
                  decoding="async"
                  alt="product image"
                  className="max-h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </section>

        <section className="relative flex flex-col pt-5 text-sm text-muted-foreground md:pl-10 md:pt-0">
          <div className="absolute bottom-0 right-0 -z-10 aspect-square w-1/2 rounded-full bg-brand/10 blur-3xl filter" />
          <div className="absolute left-0 top-0 -z-10 aspect-square w-1/2 rounded-full bg-sky-400/10 blur-3xl filter" />
          <div className="absolute inset-0 -z-20 rounded-lg bg-background/20 blur-3xl filter" />

          {auction.status === 'cancelled' && (
            <div className="mb-1 flex w-fit items-center space-x-2 rounded-full bg-error/10 px-2 py-0.5 text-sm text-error">
              <BanIcon className="size-3" />
              <span>Cancelled</span>
            </div>
          )}

          {isPending && (
            <div className="mb-1 flex w-fit items-center space-x-2 rounded-full bg-brand/10 px-2 py-0.5 text-sm text-brand">
              <RadioIcon className="size-3" />
              <span>Coming live</span>
            </div>
          )}

          {isCompleted && (
            <div className="mb-1 flex w-fit items-center space-x-2 rounded-full bg-success/10 px-2 py-0.5 text-sm text-success">
              <CircleCheckBigIcon className="size-3" />
              <span>Sold out</span>
            </div>
          )}

          {isLive && (
            <div className="mb-1 flex w-fit items-center space-x-2 rounded-full bg-brand/10 px-2 py-0.5 text-sm text-brand">
              <RadioIcon className="size-3" />
              <span>Live now</span>
            </div>
          )}

          <h3 className="text-2xl font-semibold">{auction.productTitle}</h3>
          <div className="mt-2 w-full space-y-2 [&_svg]:mr-1 [&_svg]:inline [&_svg]:size-3.5 [&_svg]:-translate-y-0.5">
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

            {auction.isInviteOnly && (
              <div className="">
                <GlobeLockIcon className="size-3.5" /> <span>Private Auction</span>
              </div>
            )}

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
            <UserRoundIcon className="mr-1 inline size-3.5" /> <span className="">Host: </span>
            <UserHoverCard user={auction.owner}>
              <button className="inline-flex cursor-pointer items-center space-x-2 hover:underline">
                <p> {auction.owner.name}</p>
                <Avatar src={auction.owner.image} size="sm" />
              </button>
            </UserHoverCard>
          </div>

          <button
            onClick={() => openReportAuctionDialog(auction.id)}
            className="mt-2 flex w-fit items-center space-x-2 hover:underline"
          >
            <FlagIcon className="size-3.5" />
            <span>Report</span>
          </button>

          {auction.description && (
            <div className="pt-3">
              <p>Description</p>
              <p className="">{auction.description} </p>
            </div>
          )}

          <div className="flex flex-col space-y-2 pt-7">
            {canUserJoinAuction && (
              <Button
                variant="brand"
                onClick={() => {
                  if (profile) return openJoinAuctionDialog(auction.id);
                  openAuthDialog();
                }}
                Icon={FlameIcon}
              >
                Join Auction
              </Button>
            )}
            {canUserLeaveAuction && (
              <Button
                onClick={() => openLeaveAuctionDialog(auction.id)}
                variant="outline"
                Icon={LogOutIcon}
              >
                Leave Auction
              </Button>
            )}

            {auction.owner.id === profile?.id && !isLive && auction.owner.id !== profile.id && (
              <Button variant="brand" disabled Icon={FlameIcon}>
                Join Auction
              </Button>
            )}

            {isCompleted && (
              <Button
                onClick={() => openAuctionDetailsDrawer(auction.id)}
                Icon={ChartNoAxesGanttIcon}
              >
                See Results
              </Button>
            )}

            {!(isCompleted || auction.status === 'cancelled' || isLive) && (
              <Button
                variant="outline"
                Icon={auction.isInterested ? MinusCircleIcon : CheckCheckIcon}
                onClick={
                  profile ? () => setInterested(!auction.isInterested) : () => openAuthDialog()
                }
                disabled={isSettingInterested || auction.owner.id === profile?.id}
                loading={isSettingInterested}
              >
                {auction.isInterested ? 'Remove from interested' : 'Add to interested'}
              </Button>
            )}

            {isLive && (
              <Button onClick={() => openLiveScreen(auction.id)} Icon={RadioIcon}>
                {auction.participationStatus === 'joined' ? 'Join live' : 'Spectate live'}
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
