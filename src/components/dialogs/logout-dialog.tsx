import { useLogout } from '@/mutations/use-logout';
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
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function LogoutDialog({ children }: Props) {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription className="text-indigo-200/80">
            You will need to log in again to access your account
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="text">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={isPending}
              loading={isPending}
              onClick={() => logout()}
              variant="secondary"
            >
              Logout
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
