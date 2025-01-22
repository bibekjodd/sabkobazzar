'use client';

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/ui/drawer';
import { createStore } from '@jodd/snap';

const useDrawer = createStore<{ isOpen: boolean }>(() => ({ isOpen: false }));

const onOpenChange = (isOpen: boolean) => useDrawer.setState({ isOpen });
export const openAuctionsHistoryDrawer = () => onOpenChange(true);
export const closeAuctionsHistoryDrawer = () => onOpenChange(false);

export default function AuctionsHistoryDrawer() {
  const { isOpen } = useDrawer();

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent className="h-screen lg:h-[calc(100vh-36px)]">
        <DrawerHeader>
          <DrawerTitle>Auctions History</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="hidden" />

        <section></section>
      </DrawerContent>
    </Drawer>
  );
}
