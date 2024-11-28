'use client';

import { useLoginDialog } from '@/hooks/use-login-dialog';
import { redirectToLogin } from '@/lib/utils';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/ui/dialog';

export default function RequireLoginDialog() {
  const isOpen = useLoginDialog((state) => state.isOpen);
  return (
    <Dialog open={isOpen} onOpenChange={useLoginDialog.getState().onOpenChange}>
      <DialogTrigger asChild className="sr-only">
        Login
      </DialogTrigger>
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
