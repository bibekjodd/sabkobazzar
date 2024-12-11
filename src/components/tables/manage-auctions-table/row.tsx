import { openImageDialog } from '@/components/dialogs/image-dialog';
import { openAuctionDetailsDrawer } from '@/components/drawers/auction-details-drawer';
import { TableCell, TableRow } from '@/components/ui/table';
import { auctionProductConditions, dummyAuctionBanner } from '@/lib/constants';
import { cn, formatPrice, isAuctionCompleted, isAuctionLive, isAuctionPending } from '@/lib/utils';
import { useAuction } from '@/queries/use-auction';
import dayjs from 'dayjs';
import {
  CheckCheckIcon,
  CircleCheckBigIcon,
  CircleDotDashedIcon,
  CircleGaugeIcon,
  CircleOffIcon,
  Clock4Icon,
  KanbanIcon,
  LockIcon,
  RadioIcon
} from 'lucide-react';
import MoreOptions from './more-options';

export default function Row({ auction: auctionData }: { auction: Auction }) {
  const { data } = useAuction(auctionData.id, { initialData: auctionData });
  const auction = data || auctionData;
  const condition = auctionProductConditions.find(
    (item) => item.value === auction.condition
  )?.title;
  const isLive = isAuctionLive(auction);
  const isPending = isAuctionPending(auction);
  const isCompleted = isAuctionCompleted(auction);

  return (
    <TableRow key={auction.id} className="h-16">
      <TableCell className="w-24">
        <button onClick={() => openImageDialog(auction.banner || dummyAuctionBanner)}>
          <img
            src={auction.banner || dummyAuctionBanner}
            loading="lazy"
            decoding="async"
            alt="banner image"
            className="aspect-video object-cover"
          />
        </button>
      </TableCell>

      <TableCell className="min-w-52 max-w-72">
        <button
          className="line-clamp-1 hover:underline"
          onClick={() => openAuctionDetailsDrawer(auction.id)}
        >
          {auction.isInviteOnly && <LockIcon className="mr-1.5 inline size-3.5 -translate-y-0.5" />}
          <span>{auction.title}</span>
        </button>
      </TableCell>

      <TableCell className="whitespace-nowrap">
        {dayjs(auction.startsAt).format('MMMM DD, ha')}
      </TableCell>

      <TableCell>
        {isPending && (
          <div className="flex items-center space-x-2 text-purple-500">
            <Clock4Icon className="size-3.5" />
            <span>Pending</span>
          </div>
        )}
        {isLive && (
          <div className="flex items-center space-x-2 text-fuchsia-500">
            <RadioIcon className="size-3.5" />
            <span>Live</span>
          </div>
        )}
        {auction.status === 'cancelled' && (
          <div className="flex items-center space-x-2 text-rose-500">
            <CircleOffIcon className="size-3.5" />
            <span>Cancelled</span>
          </div>
        )}
        {isCompleted && (
          <div className="flex items-center space-x-2 text-green-500">
            <CheckCheckIcon className="size-3.5" />
            <span>Completed</span>
          </div>
        )}
      </TableCell>

      <TableCell>
        <div
          className={cn('flex items-center space-x-2', {
            'text-green-500': auction.condition === 'new',
            'text-purple-500': auction.condition === 'first-class',
            'text-yellow-500': auction.condition === 'repairable'
          })}
        >
          {auction.condition === 'new' && <CircleCheckBigIcon className="size-3.5" />}
          {auction.condition === 'first-class' && <CircleGaugeIcon className="size-3.5" />}
          {auction.condition === 'repairable' && <CircleDotDashedIcon className="size-3.5" />}

          <span className="text-nowrap">{condition}</span>
        </div>
      </TableCell>

      <TableCell className="text-nowrap">
        {auction.finalBid && formatPrice(auction.finalBid)}
        {!auction.finalBid && '-'}
      </TableCell>

      <TableCell>
        <MoreOptions auction={auction}>
          <button className="flex h-9 items-center space-x-2 disabled:opacity-40">
            <KanbanIcon className="size-3.5" />
            <span className="select-none whitespace-nowrap">More</span>
          </button>
        </MoreOptions>
      </TableCell>
    </TableRow>
  );
}
