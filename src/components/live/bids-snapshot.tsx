import { getQueryClient } from '@/lib/query-client';
import { formatPrice } from '@/lib/utils';
import { useBidsSnapshot } from '@/queries/use-bids-snapshot';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../ui/drawer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import Avatar from '../utils/avatar';

type Props = { auctionId: string };
export default function BidsSnapshot({ auctionId }: Props) {
  const { data: bids } = useBidsSnapshot(auctionId);
  const [parentRef] = useAutoAnimate({ duration: 300 });
  const queryClient = getQueryClient();
  const profile = queryClient.getQueryData<UserProfile>(['profile']);

  return (
    <section className="w-full text-indigo-200">
      <div>
        <Table className="text-left">
          <TableHeader>
            <TableRow>
              <TableHead className="text-indigo-200">Bidder</TableHead>
              <TableHead className="text-indigo-200">Amount</TableHead>
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
                  <TableCell>{formatPrice(bid.amount)}</TableCell>
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
        <DrawerDescription />

        <section className="h-fit max-h-screen overflow-y-auto p-4">
          <BidsSnapshot auctionId={auctionId} />
        </section>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full bg-transparent">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
