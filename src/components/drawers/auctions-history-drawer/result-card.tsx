import UserHoverCard from '@/components/cards/user-hover-card';
import { openImageDialog } from '@/components/dialogs/image-dialog';
import { openJoinAuctionDialog } from '@/components/dialogs/join-auction-dialog';
import { Button } from '@/components/ui/button';
import Avatar from '@/components/utils/avatar';
import { dummyAuctionBanner } from '@/lib/constants';
import {
  canJoinAuction,
  canLeaveAuction,
  formatDate,
  formatPrice,
  isAuctionCompleted,
  isAuctionLive,
  isAuctionPending
} from '@/lib/utils';
import { useAuction } from '@/queries/use-auction';
import { useProfile } from '@/queries/use-profile';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import {
  BadgeDollarSignIcon,
  BanIcon,
  ChartNoAxesGanttIcon,
  CircleCheckBigIcon,
  ClockIcon,
  FlameIcon,
  LogOutIcon,
  MoveUpRightIcon,
  RadioIcon,
  UserIcon
} from 'lucide-react';
import { closeAuctionsHistoryDrawer } from '.';
import { openAuctionDetailsDrawer } from '../auction-details-drawer';

export default function ResultCard({ auction: initialData }: { auction: Auction }) {
  const { data } = useAuction(initialData.id, { initialData });
  const auction = data || initialData;

  const { data: profile } = useProfile();
  const canUserJoinAuction = canJoinAuction({ auction, userId: profile?.id! });
  const canUserLeaveAuction = canLeaveAuction({ auction });
  const isCompleted = isAuctionCompleted(auction);
  const isPending = isAuctionPending(auction);
  const isLive = isAuctionLive(auction);

  return (
    <section className="flex rounded-md bg-muted-foreground/[0.02] p-4 md:space-x-6">
      <button
        onClick={() =>
          openImageDialog(auction.banner || auction.productImages?.at(0) || dummyAuctionBanner)
        }
        className="hidden flex-shrink-0 cursor-zoom-in md:block"
      >
        <img
          src={auction.banner || auction.productImages?.at(0) || dummyAuctionBanner}
          alt="auction banner"
          className="aspect-video h-44 object-cover"
        />
      </button>

      <div className="flex h-full min-h-44 flex-grow flex-col">
        {auction.status === 'cancelled' && (
          <div className="flex w-fit items-center space-x-2 rounded-full bg-error/10 px-2 py-0.5 text-sm text-error">
            <BanIcon className="size-3" />
            <span>Cancelled</span>
          </div>
        )}

        {isPending && (
          <div className="flex w-fit items-center space-x-2 rounded-full bg-brand/10 px-2 py-0.5 text-sm text-brand">
            <RadioIcon className="size-3" />
            <span>Coming live</span>
          </div>
        )}

        {isCompleted && (
          <div className="flex w-fit items-center space-x-2 rounded-full bg-success/10 px-2 py-0.5 text-sm text-success">
            <CircleCheckBigIcon className="size-3" />
            <span>Sold out</span>
          </div>
        )}

        {isLive && (
          <div className="flex w-fit items-center space-x-2 rounded-full bg-brand/10 px-2 py-0.5 text-sm text-brand">
            <RadioIcon className="size-3" />
            <span>Live now</span>
          </div>
        )}

        <p className="mt-1 line-clamp-2 text-xl font-medium text-brand-lighter">{auction.title}</p>

        <div className="mt-1 flex items-center space-x-2 text-sm">
          <UserIcon className="size-3.5" /> <span className="">Host: </span>
          <UserHoverCard user={auction.owner}>
            <button className="inline-flex cursor-pointer items-center space-x-2 hover:underline">
              <p> {auction.owner.name}</p>
              <Avatar src={auction.owner.image} size="xs" />
            </button>
          </UserHoverCard>
        </div>

        <div className="mt-2 flex items-center space-x-2 text-sm">
          <BadgeDollarSignIcon className="size-3.5" />
          <span>
            Minimum bid amount: <span className="font-medium">{formatPrice(auction.minBid)}</span>
          </span>
        </div>

        <div className="mt-2 flex items-center space-x-2 text-sm">
          <ClockIcon className="size-3.5" />
          <span> Scheduled for: {formatDate(auction.startsAt)}</span>
        </div>

        <div className="mt-auto flex flex-col gap-x-2 gap-y-1 pt-4 sm:flex-row">
          <ProgressLink href={`/auctions/${auction.id}`} onClick={closeAuctionsHistoryDrawer}>
            <Button variant="outline" Icon={MoveUpRightIcon} className="w-full">
              Visit Page
            </Button>
          </ProgressLink>

          <Button
            onClick={() => openAuctionDetailsDrawer(auction.id)}
            variant="outline"
            Icon={ChartNoAxesGanttIcon}
          >
            {isCompleted ? 'See Results' : 'See more details'}
          </Button>

          {canUserJoinAuction && (
            <Button
              variant="outline"
              Icon={FlameIcon}
              onClick={() => openJoinAuctionDialog(auction.id)}
            >
              Join Auction
            </Button>
          )}

          {canUserLeaveAuction && (
            <Button variant="outline" Icon={LogOutIcon}>
              Leave Auction
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
