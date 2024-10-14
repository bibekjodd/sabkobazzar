import { useDebounce } from '@/hooks/use-debounce';
import { useCancelAuction } from '@/mutations/use-cancel-auction';
import { useInviteUser } from '@/mutations/use-invite-user';
import { useKickUser } from '@/mutations/use-kick-user';
import { useSearchInvite } from '@/queries/use-search-invite';
import { DotIcon, InfoIcon, TriangleAlertIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import AutoAnimate from '../utils/auto-animate';
import Avatar from '../utils/avatar';
import CancelAuctionDialog from './cancel-auction-dialog';

type Props = { auction: Auction; children: React.ReactNode };
export default function ManageAuctionDrawer({ auction, children }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-screen max-h-screen flex-col bg-background/50 text-sm filter backdrop-blur-3xl lg:h-fit">
        <DialogHeader>
          <DialogTitle className="line-clamp-1 text-center">{auction.title} </DialogTitle>
        </DialogHeader>
        <BaseContent auction={auction} />
      </DialogContent>
    </Dialog>
  );
}

function BaseContent({ auction }: { auction: Auction }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isInviteUsersExpanded, setIsInviteUsersExpanded] = useState(false);

  const { isSuccess } = useCancelAuction(auction.id);
  isSuccess && closeButtonRef.current?.click();

  return (
    <>
      <section className="h-full overflow-y-auto px-1 pb-4 scrollbar-thin">
        {auction.isInviteOnly && (
          <>
            {!isInviteUsersExpanded ? (
              <Button
                onClick={() => setIsInviteUsersExpanded(true)}
                variant="link"
                Icon={UserPlusIcon}
                className="mb-3 px-0"
              >
                Invite users to the auction
              </Button>
            ) : (
              <InviteUsers auctionId={auction.id} />
            )}
          </>
        )}

        <div>
          <h4 className="flex items-center space-x-2">
            <UsersIcon className="size-4" />{' '}
            <span>
              Participants{' '}
              {auction.participants.length !== 0 && (
                <span className="italic">({auction.participants.length})</span>
              )}
            </span>
          </h4>
          {auction.participants.length === 0 && (
            <div className="mt-1 flex items-center space-x-2 text-xs text-gray-300">
              <InfoIcon className="size-3" />
              <span className="italic">No any participants has joined the auction</span>
            </div>
          )}
          <div className="mt-2 flex flex-col space-y-3">
            {auction.participants.map((participant) => (
              <ParticipantItem
                key={participant.id}
                participant={participant}
                auctionId={auction.id}
              />
            ))}
          </div>
        </div>
      </section>

      <DialogFooter>
        <DialogClose asChild ref={closeButtonRef}>
          <Button variant="outline" className="bg-transparent">
            Close
          </Button>
        </DialogClose>

        <CancelAuctionDialog auctionId={auction.id}>
          <Button variant="theme-secondary" Icon={TriangleAlertIcon}>
            Cancel Auction
          </Button>
        </CancelAuctionDialog>
      </DialogFooter>
    </>
  );
}

function ParticipantItem({ auctionId, participant }: { auctionId: string; participant: User }) {
  const { mutate, isPending } = useKickUser({ auctionId, userId: participant.id });
  return (
    <div key={participant.id} className="flex items-center">
      <Avatar variant="sm" src={participant.image} />
      <span className="ml-2 mr-auto">{participant.name}</span>
      <Button
        onClick={() => mutate()}
        disabled={isPending}
        loading={isPending}
        size="sm"
        className="h-6"
        variant="theme-secondary"
      >
        Kick
      </Button>
    </div>
  );
}

function InviteUsers({ auctionId }: { auctionId: string }) {
  const [searchInput, setSearchInput] = useState('');
  const q = useDebounce(searchInput);
  const { data, isLoading, refetch } = useSearchInvite({ auctionId, q });
  const users = data?.pages.flat(1) || [];

  return (
    <div className="mb-7">
      <h4>Invite Users</h4>
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value.slice(0, 50))}
        placeholder="Search user..."
        className="mt-2 h-8"
      />
      <ScrollArea className="mt-3 flex max-h-60 flex-col">
        {!isLoading && users.length === 0 && (
          <p className="text-sm text-rose-500">No results found</p>
        )}
        {!isLoading && users.length !== 0 && <p className="mb-2 text-gray-300">Results</p>}
        <AutoAnimate className="flex flex-col space-y-3 pr-4">
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
  user: User & { isInvited: boolean };
  refetchResult: () => unknown;
}) {
  const { mutate, isSuccess, isPending } = useInviteUser({ auctionId, userId: user.id });
  const invite = () => {
    mutate(undefined, { onError: refetchResult });
  };

  const isInvited = isSuccess || user.isInvited;

  return (
    <div className="flex items-center">
      <Avatar src={user.image} variant="sm" /> <span className="ml-2 mr-auto">{user.name}</span>
      {isInvited ? (
        <div className="flex items-center text-xs text-sky-600">
          <DotIcon className="size-3 scale-150" />
          <span> Invited</span>
        </div>
      ) : (
        <Button
          variant="theme-secondary"
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
