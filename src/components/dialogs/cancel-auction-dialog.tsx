'use client';

import { CancelAuctionSchema, cancelAuctionSchema } from '@/lib/form-schemas';
import { useCancelAuction } from '@/mutations/use-cancel-auction';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStore } from '@jodd/snap';
import { useForm } from 'react-hook-form';
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
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const useCancelAuctionDialog = createStore<{ isOpen: boolean; auctionId: string | null }>(() => ({
  isOpen: false,
  auctionId: null
}));
const onOpenChange = (isOpen: boolean) =>
  useCancelAuctionDialog.setState((state) => ({
    isOpen,
    auctionId: isOpen ? state.auctionId : null
  }));

export const openCancelAuctionDialog = (auctionId: string) =>
  useCancelAuctionDialog.setState({ isOpen: true, auctionId });
export const closeCancelAuctionDialog = () => onOpenChange(false);

export default function CancelAuctionDialog() {
  const { isOpen, auctionId } = useCancelAuctionDialog();
  const { mutate, isPending } = useCancelAuction(auctionId!);

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register
  } = useForm<CancelAuctionSchema>({ resolver: zodResolver(cancelAuctionSchema) });

  const onSubmit = handleSubmit((data) => {
    if (isPending || !auctionId) return;
    mutate(data, {
      onSuccess() {
        reset();
      }
    });
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-center">Are you sure to cancel the auction?</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />

        <form className="flex flex-col space-y-2" onSubmit={onSubmit}>
          <Label htmlFor="reason">Reason</Label>
          <Textarea rows={6} id="reason" placeholder="Cancel reason..." {...register('reason')} />
          <div className="flex flex-wrap justify-between">
            {errors.reason && <p className="text-sm text-error">{errors.reason.message}</p>}
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>

          <Button onClick={onSubmit} loading={isPending} disabled={isPending}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
