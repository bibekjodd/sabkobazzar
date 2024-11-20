import Avatar from '@/components/utils/avatar';
import { useKickUser } from '@/mutations/use-kick-user';
import { useParticipants } from '@/queries/use-participants';
import { Button } from '@/ui/button';
import { InfoIcon, UsersIcon } from 'lucide-react';
import { MutableRefObject } from 'react';

export default function Participants({
  auction,
  refetchResultFnRef
}: {
  auction: Auction;
  refetchResultFnRef: MutableRefObject<() => unknown>;
}) {
  const { data: participants } = useParticipants(auction.id);

  return (
    <div>
      <h4 className="flex items-center space-x-2">
        <UsersIcon className="size-4" />{' '}
        <span>
          Participants{' '}
          {(participants?.length || 0) > 0 && (
            <span className="italic">({participants?.length})</span>
          )}
        </span>
      </h4>
      {participants?.length === 0 && (
        <div className="mt-1 flex items-center space-x-2 text-xs text-gray-300">
          <InfoIcon className="size-3" />
          <span className="italic">No any participants has joined the auction</span>
        </div>
      )}
      <div className="mt-2 flex flex-col space-y-3">
        {participants?.map((participant) => (
          <ParticipantItem
            key={participant.id}
            participant={participant}
            auctionId={auction.id}
            refetchResultFnRef={refetchResultFnRef}
          />
        ))}
      </div>
    </div>
  );
}

function ParticipantItem({
  auctionId,
  participant,
  refetchResultFnRef
}: {
  auctionId: string;
  participant: User;
  refetchResultFnRef: MutableRefObject<() => unknown>;
}) {
  const { mutate, isPending } = useKickUser({ auctionId, userId: participant.id });
  const kickUser = () => {
    mutate(undefined, {
      onSuccess: refetchResultFnRef.current,
      onError: refetchResultFnRef.current
    });
  };
  return (
    <div key={participant.id} className="flex items-center">
      <Avatar size="sm" src={participant.image} />
      <span className="ml-2 mr-auto">{participant.name}</span>
      <Button
        onClick={kickUser}
        disabled={isPending}
        loading={isPending}
        size="sm"
        className="h-6"
        variant="secondary"
      >
        Kick
      </Button>
    </div>
  );
}
