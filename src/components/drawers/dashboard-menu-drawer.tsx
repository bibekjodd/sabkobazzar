'use client';

import { dashboardLinks } from '@/lib/dashboard-links';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/ui/drawer';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { createStore } from '@jodd/snap';
import { WebhookIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { logo } from '../utils/logo';
import { openRegisterAuctionDrawer } from './register-auction-drawer';

const useDashboardMenuDrawer = createStore<{ isOpen: boolean }>(() => ({ isOpen: false }));
const onOpenChange = (isOpen: boolean) => useDashboardMenuDrawer.setState({ isOpen });
export const openDashbordMenuDrawer = () => onOpenChange(true);
export const closeDashbordMenuDrawer = () => onOpenChange(false);

export default function DashboardMenuDrawer() {
  const pathname = usePathname();
  const { isOpen } = useDashboardMenuDrawer();

  return (
    <Drawer direction="left" open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="mr-auto h-screen w-[calc(100%-32px)] rounded-l-none sm:w-96">
        <DrawerHeader>
          <DrawerTitle className="text-3xl">{logo}</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="hidden" />

        <nav className="mt-3 flex h-full flex-col space-y-1 overflow-y-auto text-sm text-indigo-200">
          {dashboardLinks.map((link) => (
            <ProgressLink
              key={link.href}
              href={link.href}
              onClick={() => {
                if (link.action) link.action();
                closeDashbordMenuDrawer();
              }}
              className={cn(
                'flex items-center space-x-2 p-4 font-semibold hover:bg-purple-400/10 hover:text-purple-400',
                pathname === link.href &&
                  'border-l-4 border-purple-700 bg-purple-400/10 text-purple-400'
              )}
            >
              <link.icon className="size-5" />
              <span>{link.title}</span>
            </ProgressLink>
          ))}

          <button
            onClick={() => {
              openRegisterAuctionDrawer();
              closeDashbordMenuDrawer();
            }}
            className="flex items-center space-x-2 p-4 font-semibold hover:bg-purple-400/10 hover:text-purple-400"
          >
            <WebhookIcon className="size-5" />
            <span>Register Auction</span>
          </button>
        </nav>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
