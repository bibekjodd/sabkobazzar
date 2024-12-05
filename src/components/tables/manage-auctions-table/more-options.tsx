import ManageAuctionDialog from '@/components/dialogs/manage-auction-dialog';
import { openQrCodeDialog } from '@/components/dialogs/qr-code-dialog';
import { openAuctionDetailsDrawer } from '@/components/drawers/auction-details-drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import CopyToClipboard from '@/components/utils/copy-to-clipboard';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import {
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

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="p-0 [&>svg]:hidden">
              <ManageAuctionDialog auction={auction}>
                <button className="flex w-full items-center space-x-2 px-2 py-1.5 disabled:opacity-50">
                  <Settings2Icon />
                  <span>Manage auction</span>
                </button>
              </ManageAuctionDialog>
            </DropdownMenuSubTrigger>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
