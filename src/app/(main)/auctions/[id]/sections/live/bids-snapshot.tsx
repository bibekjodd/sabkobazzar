import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import Avatar from '@/components/utils/avatar';
import { cn, formatPrice } from '@/lib/utils';
import { useBidsSnapshot } from '@/queries/use-bids-snapshot';
import { useProfile } from '@/queries/use-profile';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { createStore } from '@jodd/snap';
import { AlignLeftIcon, SignpostIcon } from 'lucide-react';

type Props = { auctionId: string };
export default function BidsSnapshot({ auctionId }: Props) {
  const { data: bids } = useBidsSnapshot(auctionId);
  const [parentRef] = useAutoAnimate({ duration: 300 });
  const { data: profile } = useProfile();

  return (
    <section className="w-full text-muted-foreground">
      <div>
        <Table className="text-left">
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Bidder</TableHead>
              <TableHead className="text-muted-foreground">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody ref={parentRef}>
            {bids?.map((bid, i) => {
              let isOnline = Date.now() - new Date(bid.bidder.lastOnline).getTime() < 65 * 1000;
              if (profile?.id === bid.bidderId) isOnline = true;
              return (
                <TableRow key={bid.id} className="first:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <SignpostIcon
                        className={cn(
                          'mr-1 size-3.5 flex-shrink-0 rotate-45 fill-muted-foreground',
                          {
                            'opacity-0': i !== 0
                          }
                        )}
                      />
                      <Avatar src={bid.bidder.image} size="sm" showOnlineIndicator={isOnline} />
                      <span className="line-clamp-1">{bid.bidder.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(bid.amount, false)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

const useDrawer = createStore<{ isOpen: boolean }>(() => ({
  isOpen: false
}));

const onOpenChange = (isOpen: boolean) => useDrawer.setState({ isOpen });
export const openBidsSnapshotDrawer = () => onOpenChange(true);
export const closeBidsSnapshotDrawer = () => onOpenChange(false);

export function BidsSnapshotDrawer({ auctionId }: { auctionId: string }) {
  const { isOpen } = useDrawer();
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="flex max-h-screen flex-col bg-background/50 filter backdrop-blur-3xl">
        <DrawerHeader>
          <DrawerTitle className="flex items-center space-x-2">
            <AlignLeftIcon className="size-5" />
            <span>Current Bids</span>
          </DrawerTitle>
        </DrawerHeader>

        <DrawerDescription className="hidden" />

        <section className="h-fit max-h-screen overflow-y-auto p-4">
          {auctionId && <BidsSnapshot auctionId={auctionId} />}
        </section>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
