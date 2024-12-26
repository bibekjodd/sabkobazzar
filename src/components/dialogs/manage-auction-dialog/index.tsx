'use client';

import { openCancelAuctionDialog } from '@/components/dialogs/cancel-auction-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCancelAuction } from '@/mutations/use-cancel-auction';
import { useAuction } from '@/queries/use-auction';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/ui/dialog';
import { createStore } from '@jodd/snap';
import { TriangleAlertIcon, UserPlusIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import InviteUsers from './invite-users';
import Participants from './participants';

const useManageAuctionDialog = createStore<{ isOpen: boolean; auctionId: string | null }>(() => ({
  isOpen: false,
  auctionId: null
}));
const onOpenChange = (isOpen: boolean) =>
  useManageAuctionDialog.setState((state) => ({
    isOpen,
    auctionId: isOpen ? state.auctionId : null
  }));
export const openManageAuctionDialog = (auctionId: string) =>
  useManageAuctionDialog.setState({ isOpen: true, auctionId });
export const closeManageAuctionDialog = () => onOpenChange(false);

export default function ManageAuctionDialog() {
  const { isOpen, auctionId } = useManageAuctionDialog();
  const { data: auction } = useAuction(auctionId!, { enabled: !!auctionId });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col text-sm">
        <DialogHeader>
          <DialogTitle className="line-clamp-1 text-center">{auction?.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />
        {auction && <BaseContent auction={auction} />}
      </DialogContent>
    </Dialog>
  );
}

function BaseContent({ auction }: { auction: Auction }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isInviteUsersExpanded, setIsInviteUsersExpanded] = useState(false);
  const { isSuccess } = useCancelAuction(auction.id);
  if (isSuccess) closeButtonRef.current?.click();
  const refetchResultFnRef = useRef(() => {});

  return (
    <>
      <ScrollArea className="h-96 overflow-y-auto pb-4">
        {auction.isInviteOnly && (
          <>
            {!isInviteUsersExpanded ? (
              <Button
                onClick={() => setIsInviteUsersExpanded(true)}
                variant="link"
                Icon={UserPlusIcon}
                className="mb-3 px-0"
              >
                Invite users to the auction
              </Button>
            ) : (
              <InviteUsers auctionId={auction.id} refetchResultFnRef={refetchResultFnRef} />
            )}
          </>
        )}

        <Participants auction={auction} refetchResultFnRef={refetchResultFnRef} />
      </ScrollArea>

      <DialogFooter>
        <DialogClose asChild ref={closeButtonRef}>
          <Button variant="ghost">Close</Button>
        </DialogClose>

        <Button Icon={TriangleAlertIcon} onClick={() => openCancelAuctionDialog(auction.id)}>
          Cancel Auction
        </Button>
      </DialogFooter>
    </>
  );
}
