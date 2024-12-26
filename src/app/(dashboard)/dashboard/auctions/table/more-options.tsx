import { openCancelAuctionDialog } from '@/components/dialogs/cancel-auction-dialog';
import { openManageAuctionDialog } from '@/components/dialogs/manage-auction-dialog';
import { openQrCodeDialog } from '@/components/dialogs/qr-code-dialog';
import { openAuctionDetailsDrawer } from '@/components/drawers/auction-details-drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import CopyToClipboard from '@/components/utils/copy-to-clipboard';
import { isAuctionPending } from '@/lib/utils';
import { useProfile } from '@/queries/use-profile';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import {
  BanIcon,
  ChartNoAxesGanttIcon,
  CopyIcon,
  QrCodeIcon,
  Settings2Icon,
  SquareArrowOutUpRightIcon
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export default function MoreOptions({
  children,
  auction
}: {
  children: React.ReactNode;
  auction: Auction;
}) {
  const auctionLink = `${location.origin}/auctions/${auction.id}`;
  const { data: profile } = useProfile();
  const isPending = isAuctionPending(auction);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-44 [&_.dialog-close-button]:hidden [&_svg]:size-3.5">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem className="p-0">
            <CopyToClipboard onSuccess={() => toast.success('Copied auction id')}>
              {({ copy }) => (
                <button
                  onClick={() => copy(auction.id)}
                  className="flex w-full items-center px-2 py-1.5"
                >
                  <CopyIcon className="mr-2 size-4" />
                  <span>Copy sku id</span>
                </button>
              )}
            </CopyToClipboard>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => openAuctionDetailsDrawer(auction.id)}
            className="cursor-pointer"
          >
            <ChartNoAxesGanttIcon />
            <span>See details</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => openQrCodeDialog(auctionLink)}
            className="cursor-pointer"
          >
            <QrCodeIcon />
            <span>Generate Qr Code</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="p-0">
            <ProgressLink href={auctionLink} className="flex items-center space-x-2 px-2 py-1.5">
              <SquareArrowOutUpRightIcon />
              <span>Visit page</span>
            </ProgressLink>
          </DropdownMenuItem>

          {isPending && (
            <DropdownMenuItem onClick={() => openCancelAuctionDialog(auction.id)}>
              <BanIcon />
              <span>Cancel auction</span>
            </DropdownMenuItem>
          )}

          {profile?.role !== 'admin' && isPending && (
            <DropdownMenuItem onClick={() => openManageAuctionDialog(auction.id)}>
              <Settings2Icon />
              <span>Manage auction</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
