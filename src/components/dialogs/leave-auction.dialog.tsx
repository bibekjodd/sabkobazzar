'use client';

import { useLeaveAuction } from '@/mutations/use-leave-auction';
import { createStore } from '@jodd/snap';
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

const useLeaveAuctionDialog = createStore<{ isOpen: boolean; auctionId: string | null }>(() => ({
  isOpen: false,
  auctionId: null
}));
const onOpenChange = (isOpen: boolean) =>
  useLeaveAuctionDialog.setState((state) => ({
    isOpen,
    auctionId: isOpen ? state.auctionId : null
  }));

export const openLeaveAuctionDialog = (auctionId: string) =>
  useLeaveAuctionDialog.setState({ isOpen: true, auctionId });
export const closeLeaveAuctionDialog = () => onOpenChange(false);

export default function LeaveAuctionDialog() {
  const { isOpen, auctionId } = useLeaveAuctionDialog();
  const { mutate, isPending } = useLeaveAuction(auctionId!);

  const leaveAuction = () => {
    if (isPending || !auctionId) return;
    mutate(undefined, {
      onSuccess() {
        closeLeaveAuctionDialog();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="text">Close</Button>
          </DialogClose>

          <Button
            onClick={leaveAuction}
            variant="secondary"
            loading={isPending}
            disabled={isPending}
          >
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
