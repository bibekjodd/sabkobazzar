'use client';

import UserHoverCard from '@/components/cards/user-hover-card';
import { openImageDialog } from '@/components/dialogs/image-dialog';
import { openQrCodeDialog } from '@/components/dialogs/qr-code-dialog';
import { Button } from '@/components/ui/button';
import Avatar from '@/components/utils/avatar';
import CopyToClipboard from '@/components/utils/copy-to-clipboard';
import { auctionProductConditions, dummyAuctionBanner } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import dayjs from 'dayjs';
import {
  BadgeCheckIcon,
  BadgeDollarSignIcon,
  CheckCheckIcon,
  ClockIcon,
  CopyIcon,
  CopyXIcon,
  LinkIcon,
  PackageIcon,
  QrCodeIcon,
  ReceiptTextIcon,
  UsersRoundIcon,
  VoteIcon
} from 'lucide-react';
import { toast } from 'sonner';

export function Overview({ auction }: { auction: Auction }) {
  const auctionLink = `${location.origin}/auctions/${auction.id}`;

  return (
    <div>
      <img
        src={auction.banner || dummyAuctionBanner}
        alt="banner image"
        loading="lazy"
        decoding="async"
        className="aspect-video w-full object-cover"
      />

      <div className="-mx-3 mt-4 space-y-5 rounded-md bg-indigo-900/10 px-4 py-4">
        <section className="grid grid-cols-2">
          <div>
            <p className="mb-1 text-sm text-indigo-100/80">Hosted by</p>

            <UserHoverCard user={auction.owner}>
              <div className="flex w-fit items-center space-x-3 hover:underline">
                <Avatar src={auction.owner.image} size="sm" />
                <p>{auction.owner.name}</p>
              </div>
            </UserHoverCard>
          </div>

          {auction.winner && (
            <div>
              <p className="mb-1 text-sm text-indigo-100/80">Winner</p>

              <UserHoverCard user={auction.winner}>
                <div className="flex w-fit items-center space-x-3 hover:underline">
                  <Avatar src={auction.winner?.image} size="sm" />
                  <p>{auction.winner?.name}</p>
                </div>
              </UserHoverCard>
            </div>
          )}
        </section>

        <div className="h-[1px] bg-indigo-200/15" />

        <section className="space-y-2 px-2 text-sm text-indigo-100/80 [&_svg]:inline [&_svg]:size-3.5">
          <CopyToClipboard
            onError={(err) => toast.error(err)}
            onSuccess={() => toast.success('Copied auction id')}
          >
            {({ state, copy }) => (
              <button onClick={() => copy(auction.id)} className="flex items-center space-x-2">
                <span>Copy sku id</span>
                {state === 'ready' && <CopyIcon className="size-3.5" />}
                {state === 'success' && <CheckCheckIcon className="size-3.5" />}
                {state === 'error' && <CopyXIcon className="size-3.5 text-rose-500" />}
              </button>
            )}
          </CopyToClipboard>

          <p>
            <PackageIcon /> Product:{' '}
            <span className="font-medium text-indigo-100">{auction.productTitle}</span>
          </p>
          {auction.brand && (
            <p>
              <BadgeCheckIcon /> Brand: {auction.brand}
            </p>
          )}

          <p>
            <VoteIcon /> Condition:{' '}
            {
              auctionProductConditions.find((condition) => condition.value === auction.condition)
                ?.title
            }
          </p>
          <p>
            <ReceiptTextIcon /> Product lot: {auction.lot}
          </p>
          <p>
            <UsersRoundIcon /> Allowed participants: {auction.minBidders}-{auction.maxBidders}
          </p>
          <p>
            {' '}
            <BadgeDollarSignIcon /> Minimum bid amount: {formatPrice(auction.minBid)}
          </p>

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
                    className="max-w-1/3 h-full max-h-24 w-fit cursor-pointer object-contain"
                  />
                ))}
              </div>
            </div>
          )}

          <p className="italic text-indigo-100/80">
            <ClockIcon className="inline size-3.5" />{' '}
            <span>Scheduled for {dayjs(auction.startsAt).format('MMMM DD, YYYY ha')}</span>
          </p>
        </section>

        <div className="h-[1px] bg-indigo-200/15" />

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
