'use client';

import { useLogout } from '@/mutations/use-logout';
import { useProfile } from '@/queries/use-profile';
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

const useLogoutDialog = createStore<{ isOpen: boolean }>(() => ({ isOpen: false }));

const onOpenChange = (isOpen: boolean) => useLogoutDialog.setState({ isOpen });
export const openLogoutDialog = () => onOpenChange(true);
export const closeLogoutDialog = () => onOpenChange(false);

export default function LogoutDialog() {
  const { data: profile } = useProfile();
  const { mutate, isPending } = useLogout();
  const { isOpen } = useLogoutDialog();
  const logout = () => {
    if (isPending) return;
    mutate(undefined, {
      onSuccess() {
        closeLogoutDialog();
      }
    });
  };

  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button disabled={isPending} loading={isPending} onClick={logout} variant="secondary">
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
