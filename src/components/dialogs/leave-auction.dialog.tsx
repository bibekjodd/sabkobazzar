import { leaveAuctionKey, useLeaveAuction } from '@/mutations/use-leave-auction';
import { useIsMutating } from '@tanstack/react-query';
import React, { useRef } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';

type Props = {
  auctionId: string;
  children: React.ReactNode;
};
export default function LeaveAuctionDialog({ children, auctionId }: Props) {
  const { mutate } = useLeaveAuction(auctionId);
  const isLeavingAuction = !!useIsMutating({ mutationKey: leaveAuctionKey(auctionId) });
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const leaveAuction = () => {
    mutate(undefined, {
      onSuccess() {
        closeButtonRef.current?.click();
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild ref={closeButtonRef}>
            <Button variant="text">Close</Button>
          </DialogClose>

          <Button
            onClick={leaveAuction}
            variant="secondary"
            loading={isLeavingAuction}
            disabled={isLeavingAuction}
          >
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
