import ManageAuctionDialog from '@/components/dialogs/manage-auction-dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { dummyProductImage, productConditions } from '@/lib/constants';
import { cn, formatDate, formatPrice } from '@/lib/utils';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import {
  CheckCheckIcon,
  CircleCheckBigIcon,
  CircleDotDashedIcon,
  CircleGaugeIcon,
  CircleOffIcon,
  Clock4Icon,
  KanbanIcon
} from 'lucide-react';

export default function Row({ auction }: { auction: Auction }) {
  const condition = productConditions.find((item) => item.value === auction.condition)?.title;

  return (
    <TableRow key={auction.id} className="h-16">
      <TableCell className="w-24">
        <ProgressLink href={`/auctions/${auction.id}`}>
          <img
            src={auction.banner || auction.product.image || dummyProductImage}
            alt="banner image"
            className="aspect-video object-cover"
          />
        </ProgressLink>
      </TableCell>
      <TableCell className="min-w-52 max-w-72">
        <ProgressLink href={`/auctions/${auction.id}`} className="line-clamp-1 hover:underline">
          {auction.title}
        </ProgressLink>
      </TableCell>

      <TableCell className="min-w-44">{formatDate(auction.startsAt)}</TableCell>

      <TableCell>
        {!auction.isFinished && !auction.isCancelled && (
          <div className="flex items-center space-x-2 text-purple-500">
            <Clock4Icon className="size-3.5" />
            <span>Pending</span>
          </div>
        )}
        {auction.isCancelled && (
          <div className="flex items-center space-x-2 text-rose-500">
            <CircleOffIcon className="size-3.5" />
            <span>Cancelled</span>
          </div>
        )}
        {auction.isFinished && (
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

          <span>{condition}</span>
        </div>
      </TableCell>
      <TableCell>
        {auction.finalBid && 'Rs ' + formatPrice(auction.finalBid)}
        {!auction.finalBid && '-'}
      </TableCell>

      <TableCell>
        <ManageAuctionDialog auction={auction}>
          <button className="flex h-9 items-center space-x-2 disabled:opacity-40">
            <KanbanIcon className="size-3.5" />
            <span>Manage</span>
          </button>
        </ManageAuctionDialog>
      </TableCell>
    </TableRow>
  );
}
