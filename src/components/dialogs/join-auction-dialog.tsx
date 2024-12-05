import { joinAuctionKey, useJoinAuction } from '@/mutations/use-join-auction';
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
export default function JoinAuctionDialog({ children, auctionId }: Props) {
  const { mutate } = useJoinAuction(auctionId);
  const isJoiningAuction = !!useIsMutating({ mutationKey: joinAuctionKey(auctionId) });
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const joinAuction = () => {
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
          <DialogTitle>Are you sure to join the auction?</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild ref={closeButtonRef}>
            <Button variant="text">Close</Button>
          </DialogClose>

          <Button
            onClick={joinAuction}
            variant="secondary"
            loading={isJoiningAuction}
            disabled={isJoiningAuction}
          >
            Join
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
