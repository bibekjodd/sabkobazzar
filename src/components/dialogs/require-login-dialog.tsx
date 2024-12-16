'use client';

import { redirectToLogin } from '@/lib/utils';
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

const useRequireLoginDialog = createStore<{ isOpen: boolean }>(() => ({
  isOpen: false
}));

const onOpenChange = (isOpen: boolean) => useRequireLoginDialog.setState({ isOpen });

export const openRequireLoginDialog = () => onOpenChange(true);
export const closeRequireLoginDialog = () => onOpenChange(false);

export default function RequireLoginDialog() {
  const { isOpen } = useRequireLoginDialog();
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login to continue</DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="text">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={redirectToLogin} variant="secondary">
              Login
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
