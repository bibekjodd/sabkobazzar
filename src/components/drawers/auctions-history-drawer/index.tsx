'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/ui/drawer';
import { createStore } from '@jodd/snap';
import Result from './result';
import Tabs from './tabs';

export const useAuctionsHistoryDrawer = createStore<{
  isOpen: boolean;
  activeTab: 'all' | 'invited' | 'joined';
}>(() => ({
  isOpen: false,
  activeTab: 'all'
}));

const onOpenChange = (isOpen: boolean) => useAuctionsHistoryDrawer.setState({ isOpen });
export const openAuctionsHistoryDrawer = () => onOpenChange(true);
export const closeAuctionsHistoryDrawer = () => onOpenChange(false);

export default function AuctionsHistoryDrawer() {
  const { isOpen } = useAuctionsHistoryDrawer();

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent className="h-screen lg:h-[calc(100vh-36px)]">
        <DrawerHeader>
          <DrawerTitle className="text-center">Auctions History</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="hidden" />

        <Tabs />

        <ScrollArea className="h-full pb-6">
          <section className="px-4">
            <Result />
          </section>
        </ScrollArea>

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
