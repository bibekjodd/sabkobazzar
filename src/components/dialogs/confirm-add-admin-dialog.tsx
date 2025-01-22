'use client';

import { useSearch } from '@/app/(dashboard)/dashboard/staffs/table/search';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { useUpdateUser } from '@/mutations/use-update-user';
import { usersKey } from '@/queries/use-users';
import { createStore } from '@jodd/snap';
import { CheckCheckIcon } from 'lucide-react';
import { toast } from 'sonner';
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

const useDialog = createStore<{ isOpen: boolean; user: User | null }>(() => ({
  isOpen: false,
  user: null
}));
const onOpenChange = (isOpen: boolean) =>
  useDialog.setState((state) => ({ isOpen, user: isOpen ? state.user : null }));

export const openConfirmAddAdminDialog = (user: User) => useDialog.setState({ isOpen: true, user });

export const closeCofirmAddAdminDialog = () => onOpenChange(false);

export default function ConfirmAddAdminDialog() {
  const { isOpen, user } = useDialog();

  const { mutate, isPending } = useUpdateUser(user?.id!);

  const addAdmin = () => {
    if (isPending || !user) return;
    mutate(
      { role: 'admin' },
      {
        onError(err) {
          toast.error(`Could not add ${user.name} as admin! ${extractErrorMessage(err)}`);
        },
        onSuccess() {
          closeCofirmAddAdminDialog();
          toast.success(`${user.name} added as admin successfully!`);
          const queryClient = getQueryClient();
          queryClient.invalidateQueries({
            queryKey: usersKey({ q: useSearch.getState().q?.trim() || undefined, role: 'admin' })
          });
          queryClient.invalidateQueries({
            queryKey: usersKey({ q: useSearch.getState().q?.trim() || undefined, role: 'user' })
          });
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>

        <DialogDescription>This action will add {user?.name} as admin.</DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>

          <Button loading={isPending} disabled={isPending} onClick={addAdmin} Icon={CheckCheckIcon}>
            Add Admin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
