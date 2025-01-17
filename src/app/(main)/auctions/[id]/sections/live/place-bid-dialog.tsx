'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { cn, formatPrice } from '@/lib/utils';
import { usePlaceBid } from '@/mutations/use-place-bid';
import { createStore } from '@jodd/snap';
import { SignpostIcon } from 'lucide-react';

const useDialog = createStore<{ amount: number | null; isOpen: boolean }>(() => ({
  isOpen: false,
  amount: null
}));

const onOpenChange = (isOpen: boolean) => useDialog.setState({ isOpen });

export const openPlaceBidDialog = (options: { auctionId: string; amount: number }) =>
  useDialog.setState({ isOpen: true, ...options });

export const closePlaceBidDialog = () => onOpenChange(false);

export default function PlaceBidDialog({ auctionId }: { auctionId: string }) {
  const { isOpen, amount } = useDialog();
  const { mutate, isPending } = usePlaceBid(auctionId!);

  const placeBid = () => {
    if (isPending || !amount) return;
    mutate(
      { amount },
      {
        onSuccess() {
          useDialog.setState({ isOpen: false });
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-brand/5">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">Confirm placing bid?</DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-base">
          Are you sure to place the bid of{' '}
          <span className="font-semibold text-brand">{formatPrice(amount || 0)} ?</span>
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>

          <Button
            IconRight={SignpostIcon}
            disabled={isPending}
            loading={isPending}
            onClick={placeBid}
            variant="brand"
            className={cn({ '[&_svg]:rotate-45 [&_svg]:fill-current': !isPending })}
          >
            Place Bid
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
