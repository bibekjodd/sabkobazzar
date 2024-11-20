import React from 'react';
import AuctionOverview from '../auction-overview';
import { Button } from '../ui/button';
import { DialogDescription } from '../ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../ui/drawer';

export default function AuctionDetailsDrawer({
  auction,
  children
}: {
  children: React.ReactNode;
  auction: Auction;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="flex h-screen flex-col bg-background/50 filter backdrop-blur-3xl">
        <DrawerHeader>
          <DrawerTitle />
        </DrawerHeader>
        <DialogDescription className="hidden" />
        <section className="grid h-full place-items-center overflow-y-auto py-7">
          <AuctionOverview auction={auction} />
        </section>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
