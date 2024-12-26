'use client';

import { useJoinAuction } from '@/mutations/use-join-auction';
import { createStore } from '@jodd/snap';
import { FlameIcon } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';

const useJoinAuctionDialog = createStore<{ isOpen: boolean; auctionId: string | null }>(() => ({
  isOpen: false,
  auctionId: null
}));
const onOpenChange = (isOpen: boolean) =>
  useJoinAuctionDialog.setState((state) => ({
    isOpen,
    auctionId: isOpen ? state.auctionId : null
  }));

export const openJoinAuctionDialog = (auctionId: string) =>
  useJoinAuctionDialog.setState({ isOpen: true, auctionId });
export const closeJoinAuctionDialog = () => onOpenChange(false);

export default function JoinAuctionDialog() {
  const { isOpen, auctionId } = useJoinAuctionDialog();
  const { mutate, isPending } = useJoinAuction(auctionId!);

  const joinAuction = () => {
    if (isPending || !auctionId) return;
    mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure to join the auction?</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>

          <Button Icon={FlameIcon} onClick={joinAuction} loading={isPending} disabled={isPending}>
            Join
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
