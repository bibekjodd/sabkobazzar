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
  children?: React.ReactNode;
};

export default function LogoutDialog({ children }: Props) {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Dialog>
      <DialogTrigger asChild>{children ? children : <Button>Logout</Button>}</DialogTrigger>
      <DialogContent className="bg-background/50 filter backdrop-blur-3xl">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            You will need to log in again to access your account
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={isPending}
              loading={isPending}
              onClick={() => logout()}
              variant="white"
            >
              Logout
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
