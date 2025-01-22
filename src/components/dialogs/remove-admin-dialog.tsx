'use client';

import { useSearch } from '@/app/(dashboard)/dashboard/staffs/table/search';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { useUpdateUser } from '@/mutations/use-update-user';
import { usersKey } from '@/queries/use-users';
import { createStore } from '@jodd/snap';
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

export const openRemoveAdminDialog = (user: User) => useDialog.setState({ isOpen: true, user });

export const closeRemoveAdminDialog = () => onOpenChange(false);

export default function RemoveAdminDialog() {
  const { isOpen, user } = useDialog();

  const { mutate, isPending } = useUpdateUser(user?.id!);

  const removeAdmin = () => {
    if (isPending || !user) return;
    mutate(
      { role: 'user' },
      {
        onError(err) {
          toast.error(`Could not remove ${user.name} from admin! ${extractErrorMessage(err)}`);
        },
        onSuccess() {
          closeRemoveAdminDialog();
          toast.success(`${user.name} removed from admin successfully!`);
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

        <DialogDescription>This action will remove {user?.name} from admin.</DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>

          <Button
            variant="destructive"
            loading={isPending}
            disabled={isPending}
            onClick={removeAdmin}
          >
            Remove Admin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
