'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { useUser } from '@/queries/use-user';
import { useUsers } from '@/queries/use-users';
import { createStore } from '@jodd/snap';
import { CheckCheckIcon, SearchIcon, UserPlusIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import Avatar from '../utils/avatar';
import { openConfirmAddAdminDialog } from './confirm-add-admin-dialog';

const useDialog = createStore<{ isOpen: boolean }>(() => ({
  isOpen: false
}));
const onOpenChange = (isOpen: boolean) => useDialog.setState({ isOpen });
export const openAddAdminDialog = () => onOpenChange(true);
export const closeAddAdminDialog = () => onOpenChange(false);

export default function AddAdminDialog() {
  const { isOpen } = useDialog();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-screen flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center space-x-3">
            <UserPlusIcon className="size-5" />
            <p>Add new admin</p>
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="hidden" />

        <ScrollArea className="-mx-3 h-full">{isOpen && <BaseContent />}</ScrollArea>

        <DialogFooter>
          <Button variant="outline" className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BaseContent() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchInput = useDebounce(searchInput);
  const { data: users, isLoading } = useUsers({
    q: debouncedSearchInput.trim() || undefined,
    role: 'user'
  });

  return (
    <section className="px-3">
      <Input
        id="search"
        label="Search users"
        IconLeft={SearchIcon}
        IconRight={searchInput ? XIcon : undefined}
        iconRightAction={() => setSearchInput('')}
        placeholder="Enter name or email..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="h-8"
      />

      <div className="mt-4 flex flex-col space-y-1 pb-10">
        {isLoading &&
          new Array(6).fill('nothing').map((_, i) => (
            <div key={i} className="flex space-x-2 px-2 py-1">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}

        {!isLoading && users?.length === 0 && (
          <p className="text-sm text-error">No results found.</p>
        )}

        {users?.map((user) => <ResultUser key={user.id} user={user} />)}
      </div>
    </section>
  );
}

function ResultUser({ user: initialData }: { user: User }) {
  const { data } = useUser(initialData.id, { initialData });
  const user = data || initialData;

  if (user.role === 'admin') return null;

  return (
    <section className="flex items-center rounded-md py-1 pl-2 text-sm hover:bg-foreground/10">
      <Avatar src={user.image} size="sm" />
      <div className="ml-2 mr-auto">
        <p className="mr-auto">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
      <Button
        size="sm"
        Icon={CheckCheckIcon}
        className="scale-90"
        onClick={() => openConfirmAddAdminDialog(user)}
      >
        Add Admin
      </Button>
    </section>
  );
}
