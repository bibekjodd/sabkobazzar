'use client';

import UserHoverCard from '@/components/cards/user-hover-card';
import { openImageDialog } from '@/components/dialogs/image-dialog';
import { openQrCodeDialog } from '@/components/dialogs/qr-code-dialog';
import { Button } from '@/components/ui/button';
import Avatar from '@/components/utils/avatar';
import CopyToClipboard from '@/components/utils/copy-to-clipboard';
import { auctionProductConditions, dummyAuctionBanner } from '@/lib/constants';
import { formatPrice, isAuctionCompleted, isAuctionPending } from '@/lib/utils';
import dayjs from 'dayjs';
import {
  BadgeCheckIcon,
  BadgeDollarSignIcon,
  BanIcon,
  CheckCheckIcon,
  CircleCheckBigIcon,
  ClockIcon,
  CopyIcon,
  CopyXIcon,
  GlobeIcon,
  GlobeLockIcon,
  LinkIcon,
  PackageIcon,
  QrCodeIcon,
  RadioIcon,
  ReceiptTextIcon,
  UsersRoundIcon,
  VoteIcon
} from 'lucide-react';
import { toast } from 'sonner';

export function Overview({ auction }: { auction: Auction }) {
  const auctionLink = `${location.origin}/auctions/${auction.id}`;

  const isCompleted = isAuctionCompleted(auction);
  const isPending = isAuctionPending(auction);

  return (
    <div>
      <img
        src={auction.banner || dummyAuctionBanner}
        alt="banner image"
        loading="lazy"
        decoding="async"
        className="aspect-video w-full object-cover"
      />

      <div className="-mx-3 mt-4 space-y-5 rounded-md bg-indigo-900/10 p-4">
        <section className="grid grid-cols-2">
          <div>
            <p className="mb-1 text-sm">Host</p>

            <UserHoverCard user={auction.owner}>
              <button className="flex w-fit items-center space-x-3 hover:underline">
                <Avatar src={auction.owner.image} size="sm" />

                <p>{auction.owner.name}</p>
              </button>
            </UserHoverCard>
          </div>

          {auction.winner && (
            <div>
              <p className="mb-1 text-sm">Winner</p>

              <UserHoverCard user={auction.winner}>
                <button className="flex w-fit items-center space-x-3 hover:underline">
                  <Avatar src={auction.winner?.image} size="sm" />

                  <p>{auction.winner?.name}</p>
                </button>
              </UserHoverCard>
            </div>
          )}
        </section>

        <div className="h-[1px] bg-muted-foreground/15" />

        <section className="space-y-2 px-2 text-sm [&_svg]:mr-1.5 [&_svg]:inline [&_svg]:size-3.5 [&_svg]:-translate-y-0.5">
          <CopyToClipboard
            onError={(err) => toast.error(err)}
            onSuccess={() => toast.success('Copied auction id')}
          >
            {({ state, copy }) => (
              <button onClick={() => copy(auction.id)} className="flex items-center space-x-2">
                <span>Copy sku id</span>

                {state === 'ready' && <CopyIcon />}

                {state === 'success' && <CheckCheckIcon />}

                {state === 'error' && <CopyXIcon className="text-error" />}
              </button>
            )}
          </CopyToClipboard>

          {auction.isInviteOnly && (
            <div>
              <GlobeLockIcon /> <span>Private Auction</span>
            </div>
          )}

          {!auction.isInviteOnly && (
            <div>
              <GlobeIcon /> <span>Public Auction</span>
            </div>
          )}

          <div>
            <PackageIcon /> Product: <span className="font-medium">{auction.productTitle}</span>
          </div>

          {auction.brand && (
            <div className="capitalize">
              <BadgeCheckIcon /> Brand: {auction.brand}
            </div>
          )}

          <div>
            <VoteIcon /> Condition:{' '}
            {
              auctionProductConditions.find((condition) => condition.value === auction.condition)
                ?.title
            }
          </div>
          <div>
            <ReceiptTextIcon /> Product lot: {auction.lot}
          </div>
          <div>
            <UsersRoundIcon /> Allowed participants: {auction.minBidders}-{auction.maxBidders}
          </div>
          <div>
            <BadgeDollarSignIcon /> Minimum bid amount: {formatPrice(auction.minBid)}
          </div>

          {(auction.productImages || []).length > 0 && (
            <div className="pb-2">
              <p>Product Images</p>
              <div className="mt-3 flex items-center space-x-2 px-2">
                {(auction.productImages || []).map((image) => (
                  <img
                    onClick={() => openImageDialog(image)}
                    src={image}
                    key={image}
                    loading="lazy"
                    decoding="async"
                    alt="product image"
                    className="max-w-1/3 h-full max-h-24 w-fit cursor-zoom-in object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="italic">
            <ClockIcon />{' '}
            <span>Scheduled for {dayjs(auction.startsAt).format('MMMM DD, YYYY ha')}</span>
          </div>

          {auction.status === 'cancelled' && (
            <div className="w-fit rounded-full bg-error/10 px-2 py-0.5 text-error">
              <BanIcon className="size-3" />
              <span>Cancelled</span>
            </div>
          )}

          {auction.cancelReason && <p>Cancel Reason: {auction.cancelReason}</p>}

          {isPending && (
            <div className="w-fit rounded-full bg-brand/10 px-2 py-0.5 text-brand">
              <RadioIcon className="size-3" />
              <span>Coming live</span>
            </div>
          )}

          {isCompleted && (
            <div className="w-fit rounded-full bg-success/10 px-2 py-0.5 text-success">
              <CircleCheckBigIcon className="size-3" />
              <span>Sold out</span>
            </div>
          )}
        </section>

        <div className="h-[1px] bg-muted-foreground/15" />

        <section className="flex flex-col space-y-2">
          <Button onClick={() => openQrCodeDialog(auctionLink)} variant="outline" Icon={QrCodeIcon}>
            Generate Qr Code link to auction
          </Button>

          <CopyToClipboard onSuccess={() => toast.success('Copied auction link')}>
            {({ state, copy }) => (
              <Button
                onClick={() => copy(auctionLink)}
                variant="outline"
                Icon={state === 'ready' ? LinkIcon : CheckCheckIcon}
              >
                Copy link to auction
              </Button>
            )}
          </CopyToClipboard>
        </section>
      </div>
    </div>
  );
}
