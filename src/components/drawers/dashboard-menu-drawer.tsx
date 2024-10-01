import { Button } from '@/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/ui/drawer';
import { usePathname } from 'next/navigation';
import React, { useRef } from 'react';
import { dashboardLinks } from '../layouts/dashboard-sidebar';
import { logo } from '../utils/logo';
import ProgressLink from '../utils/progress-link';

export default function DashboardMenuDrawer({ children }: { children: React.ReactNode }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="mr-auto h-screen w-[calc(100%-32px)] rounded-l-none sm:w-96">
        <DrawerHeader>
          <DrawerTitle className="text-3xl">{logo}</DrawerTitle>
        </DrawerHeader>

        <nav className="mt-3 flex h-full flex-col space-y-1 overflow-y-auto text-sm">
          {dashboardLinks.map((link) => (
            <ProgressLink
              key={link.href}
              href={link.href}
              onClick={() => {
                closeButtonRef.current?.click();
              }}
              className={`flex items-center space-x-2 p-4 font-semibold ${link.href === pathname ? 'bg-sky-500/15 text-sky-500' : ''}`}
            >
              <link.icon className="size-5" />
              <span>{link.title}</span>
            </ProgressLink>
          ))}
        </nav>

        <DrawerFooter>
          <DrawerClose asChild ref={closeButtonRef}>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
