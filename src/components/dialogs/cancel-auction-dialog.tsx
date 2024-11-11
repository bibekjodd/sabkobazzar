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

      <DialogContent className="bg-background/50 filter backdrop-blur-lg">
        <DialogHeader>Are you sure?</DialogHeader>
        <DialogDescription>
          You cannot undo this action and will have to register to bring product to the auction
          again!
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
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
