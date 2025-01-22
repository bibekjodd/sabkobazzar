'use client';

import UserHoverCard from '@/components/cards/user-hover-card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import Avatar from '@/components/utils/avatar';
import { useDebounce } from '@/hooks/use-debounce';
import { inviteUserKey, useInviteUser } from '@/mutations/use-invite-user';
import { useSearchInvite } from '@/queries/use-search-invite';
import { AutoAnimate } from '@jodd/auto-animate';
import { createStore } from '@jodd/snap';
import { useMutationState } from '@tanstack/react-query';
import { DotIcon, SearchIcon, UserPlusIcon } from 'lucide-react';
import { useState } from 'react';

const useDialog = createStore<{ isOpen: boolean; auctionId: string | null }>(() => ({
  isOpen: false,
  auctionId: null
}));

const onOpenChange = (isOpen: boolean) =>
  useDialog.setState((state) => ({ isOpen, auctionId: isOpen ? state.auctionId : null }));
export const openInviteUsersDialog = (auctionId: string) =>
  useDialog.setState({ isOpen: true, auctionId });
export const closeInviteUsersDialog = () => onOpenChange(false);

export default function InviteUsers() {
  const { isOpen, auctionId } = useDialog();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-screen flex-col lg:max-h-[calc(100vh-40px)]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlusIcon className="size-5" />
            <span>Invite users</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="-ml-2 -mr-4 h-full">
          <div className="max-h-[calc(100vh-40px)] pl-2 pr-4">
            {auctionId && <BaseComponent auctionId={auctionId} />}
          </div>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BaseComponent({ auctionId }: { auctionId: string }) {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchInput = useDebounce(searchInput);
  const { isLoading, data: resultUsers } = useSearchInvite({
    auctionId,
    q: debouncedSearchInput.trim()
  });

  return (
    <section className="max-h-96">
      <Input
        IconLeft={SearchIcon}
        label="Search users"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Enter name or email..."
        className="h-8"
      />

      {resultUsers?.length === 0 && <p className="mt-2 text-sm text-error">No results found.</p>}

      <AutoAnimate className="mt-4 flex flex-col space-y-1">
        {isLoading &&
          new Array(4).fill('nothing').map((_, i) => (
            <div key={i} className="flex items-center space-x-2 py-1">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-8 flex-grow" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}

        {resultUsers?.map((user) => (
          <ResultUserItem key={user.id} user={user} auctionId={auctionId} />
        ))}
      </AutoAnimate>
    </section>
  );
}

function ResultUserItem({
  user,
  auctionId
}: {
  user: User & { status: ParticipationStatus };
  auctionId: string;
}) {
  const { isPending, mutate } = useInviteUser({ auctionId, userId: user.id });

  const isInvited =
    useMutationState({
      filters: { mutationKey: inviteUserKey({ auctionId, userId: user.id }) }
    }).at(0)?.status === 'success' || user.status === 'invited';

  const inviteUser = () => {
    mutate();
  };

  return (
    <div className="-mx-1 flex items-center rounded-md bg-muted-foreground/5 px-3 py-2 font-medium hover:bg-muted-foreground/10">
      <UserHoverCard user={user} popover>
        <div className="mr-auto flex w-fit cursor-pointer items-center hover:underline">
          <Avatar src={user.image} size="sm" />{' '}
          <span className="ml-2 mr-auto text-sm">{user.name}</span>
        </div>
      </UserHoverCard>
      {isInvited && (
        <div className="flex items-center text-xs text-sky-600">
          <DotIcon className="size-3 scale-150" />
          <span>Invited</span>
        </div>
      )}
      {user.status === 'rejected' && (
        <div className="flex items-center text-xs text-rose-600">
          <DotIcon className="size-3 scale-150" />
          <span>Rejected</span>
        </div>
      )}
      {user.status === 'joined' && (
        <div className="flex items-center text-xs text-green-600">
          <DotIcon className="size-3 scale-150" />
          <span>Joined</span>
        </div>
      )}
      {(user.status === null || user.status === 'kicked') && !isInvited && (
        <Button
          variant="brand"
          size="sm"
          loading={isPending}
          disabled={isPending}
          onClick={inviteUser}
          className="ml-auto h-6 font-medium"
        >
          Invite
        </Button>
      )}
    </div>
  );
}
