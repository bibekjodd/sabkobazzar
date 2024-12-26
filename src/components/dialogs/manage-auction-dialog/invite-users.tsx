import Avatar from '@/components/utils/avatar';
import { useDebounce } from '@/hooks/use-debounce';
import { useInviteUser } from '@/mutations/use-invite-user';
import { useSearchInvite } from '@/queries/use-search-invite';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { ScrollArea } from '@/ui/scroll-area';
import { Skeleton } from '@/ui/skeleton';
import { AutoAnimate } from '@jodd/auto-animate';
import { DotIcon } from 'lucide-react';
import { MutableRefObject, useEffect, useState } from 'react';

export default function InviteUsers({
  auctionId,
  refetchResultFnRef
}: {
  auctionId: string;
  refetchResultFnRef: MutableRefObject<() => unknown>;
}) {
  const [searchInput, setSearchInput] = useState('');
  const q = useDebounce(searchInput);
  const { data, isLoading, refetch } = useSearchInvite({ auctionId, q });
  const users = data?.pages.flat(1) || [];

  useEffect(() => {
    refetchResultFnRef.current = refetch;
  }, [refetch, refetchResultFnRef]);

  return (
    <div className="mb-7 pr-4">
      <h4>Invite Users</h4>
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value.slice(0, 50))}
        placeholder="Search user..."
        className="mt-2 h-8"
      />
      <ScrollArea className="mt-3 flex max-h-60 flex-col">
        {!isLoading && users.length === 0 && <p className="text-sm text-error">No results found</p>}
        {!isLoading && users.length !== 0 && <p className="mb-2 text-muted-foreground">Results</p>}
        <AutoAnimate className="flex flex-col space-y-3">
          {users.map((user) => (
            <ResultUser key={user.id} user={user} auctionId={auctionId} refetchResult={refetch} />
          ))}
        </AutoAnimate>
        {isLoading &&
          new Array(4).fill('nothing').map((_, i) => (
            <div key={i} className="mb-2 flex items-center space-x-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-6 flex-grow" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
      </ScrollArea>
    </div>
  );
}

function ResultUser({
  user,
  auctionId,
  refetchResult
}: {
  auctionId: string;
  user: User & { status: ParticipationStatus };
  refetchResult: () => unknown;
}) {
  const { mutate, isSuccess, isPending } = useInviteUser({ auctionId, userId: user.id });
  const invite = () => {
    mutate(undefined, { onError: refetchResult });
  };

  const isInvited = isSuccess || user.status === 'invited';

  return (
    <div className="flex items-center font-medium">
      <Avatar src={user.image} size="sm" /> <span className="ml-2 mr-auto">{user.name}</span>
      {isInvited && (
        <div className="flex items-center text-xs text-sky-600">
          <DotIcon className="size-3 scale-150" />
          <span> Invited</span>
        </div>
      )}
      {user.status === 'rejected' && (
        <div className="flex items-center text-xs text-rose-600">
          <DotIcon className="size-3 scale-150" />
          <span> Rejected</span>
        </div>
      )}
      {user.status === 'joined' && (
        <div className="flex items-center text-xs text-green-600">
          <DotIcon className="size-3 scale-150" />
          <span> Joined</span>
        </div>
      )}
      {(user.status === null || user.status === 'kicked') && !isInvited && (
        <Button
          size="sm"
          loading={isPending}
          disabled={isPending}
          onClick={invite}
          className="ml-auto h-6 font-medium"
        >
          Invite
        </Button>
      )}
    </div>
  );
}
