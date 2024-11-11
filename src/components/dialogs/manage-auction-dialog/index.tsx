import CancelAuctionDialog from '@/components/dialogs/cancel-auction-dialog';
import { useCancelAuction } from '@/mutations/use-cancel-auction';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/ui/dialog';
import { TriangleAlertIcon, UserPlusIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import InviteUsers from './invite-users';
import Participants from './participants';

type Props = { auction: Auction; children: React.ReactNode };
export default function ManageAuctionDialog({ auction, children }: Props) {
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
  if (isSuccess) closeButtonRef.current?.click();
  const refetchResultFnRef = useRef(() => {});

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
              <InviteUsers auctionId={auction.id} refetchResultFnRef={refetchResultFnRef} />
            )}
          </>
        )}

        <Participants auction={auction} refetchResultFnRef={refetchResultFnRef} />
      </section>

      <DialogFooter>
        <DialogClose asChild ref={closeButtonRef}>
          <Button variant="outline" className="bg-transparent">
            Close
          </Button>
        </DialogClose>

        <CancelAuctionDialog auctionId={auction.id}>
          <Button variant="secondary" Icon={TriangleAlertIcon}>
            Cancel Auction
          </Button>
        </CancelAuctionDialog>
      </DialogFooter>
    </>
  );
}
