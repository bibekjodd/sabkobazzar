import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
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
import { formatPrice } from '@/lib/utils';
import { useBidsSnapshot } from '@/queries/use-bids-snapshot';
import { useProfile } from '@/queries/use-profile';
import { useAutoAnimate } from '@formkit/auto-animate/react';

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
            {bids?.map((bid) => {
              let isOnline = Date.now() - new Date(bid.bidder.lastOnline).getTime() < 65 * 1000;
              if (profile?.id === bid.bidderId) isOnline = true;
              return (
                <TableRow key={bid.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar src={bid.bidder.image} size="sm" showOnlineIndicator={isOnline} />
                      <span>{bid.bidder.name}</span>
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

export function BidsSnapshotDrawer({
  auctionId,
  children
}: {
  auctionId: string;
  children: React.ReactNode;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="flex max-h-screen flex-col bg-background/50 filter backdrop-blur-3xl">
        <DrawerHeader>
          <DrawerTitle>Current Bids</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="hidden" />

        <section className="h-fit max-h-screen overflow-y-auto p-4">
          <BidsSnapshot auctionId={auctionId} />
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
