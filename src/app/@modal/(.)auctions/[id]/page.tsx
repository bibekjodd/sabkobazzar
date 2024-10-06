'use client';
import AuctionOverview from '@/components/auction-overview';
import { PageDrawer } from '@/components/drawers/page-drawer';
import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { useAuction } from '@/queries/use-auction';

export default function Page({ params: { id: auctionId } }: { params: { id: string } }) {
  const { data: auction } = useAuction(auctionId);

  return (
    <PageDrawer className="flex h-full flex-col bg-background/50 filter backdrop-blur-3xl md:h-[calc(100vh-40px)]">
      <div className="mx-auto h-full w-full max-w-screen-xl overflow-y-auto p-4 scrollbar-thin">
        {auction && (
          <div className="grid h-full place-items-center py-7">
            <AuctionOverview auction={auction} showProductLinkButton />
          </div>
        )}
      </div>

      <DrawerFooter>
        <DrawerClose asChild>
          <Button variant="outline" className="w-full bg-transparent">
            Close
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </PageDrawer>
  );
}
