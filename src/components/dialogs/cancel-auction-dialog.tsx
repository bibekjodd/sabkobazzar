import { useCancelAuction } from '@/mutations/use-cancel-auction';
import React from 'react';
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

export default function CancelAuctionDialog({
  auctionId,
  children
}: {
  auctionId: string;
  children: React.ReactNode;
}) {
  const { mutate, isPending } = useCancelAuction(auctionId);
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-indigo-200/80">
          You cannot undo this action and will have to register to bring product to the auction
          again!
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="text">Close</Button>
          </DialogClose>
          <Button
            onClick={() => mutate()}
            loading={isPending}
            disabled={isPending}
            variant="secondary"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
