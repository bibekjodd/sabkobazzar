import UserHoverCard from '@/components/cards/user-hover-card';
import { Skeleton } from '@/components/ui/skeleton';
import Avatar from '@/components/utils/avatar';
import { useParticipants } from '@/queries/use-participants';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { UsersRoundIcon } from 'lucide-react';

dayjs.extend(durationPlugin);

export function Participants({ auctionId }: { auctionId: string }) {
  const { data: participants, error, isLoading } = useParticipants(auctionId);
  if (error) return null;

  return (
    <div className="-mx-3 mt-2 rounded-md bg-indigo-900/10 px-4 py-2">
      <h3>
        <UsersRoundIcon className="mr-2 inline size-4" />
        <span>Participants</span>
      </h3>
      {!isLoading && participants?.length === 0 && (
        <p className="mt-1 text-sm italic text-muted-foreground">
          No any participants has joined the auction
        </p>
      )}

      <div className="mt-2.5 flex flex-col space-y-4">
        {isLoading &&
          new Array(4).fill('nothing').map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="size-7 rounded-full" />
              <Skeleton className="h-7 flex-grow" />
            </div>
          ))}

        {participants?.map((participant) => (
          <UserHoverCard key={participant.id} user={participant}>
            <div className="flex w-fit items-center space-x-3 hover:underline">
              <Avatar src={participant.image} size="sm" />
              <p className="text-sm">{participant.name}</p>
            </div>
          </UserHoverCard>
        ))}
      </div>
    </div>
  );
}
