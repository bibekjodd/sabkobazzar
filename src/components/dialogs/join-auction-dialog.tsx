import { useJoinAuction } from '@/mutations/use-join-auction';
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
  const isJoiningAuction = !!useIsMutating({ mutationKey: ['join-auction', auctionId] });
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
      <DialogContent className="bg-background/50 filter backdrop-blur-3xl">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild ref={closeButtonRef}>
            <Button variant="outline">Close</Button>
          </DialogClose>

          <Button
            onClick={joinAuction}
            variant="white"
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
