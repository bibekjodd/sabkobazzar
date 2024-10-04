'use client';
import { usePathname, useRouter } from 'next/navigation';
import { ComponentPropsWithRef, ElementRef, forwardRef, useEffect, useRef } from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '../ui/drawer';

export const PageDrawer = forwardRef<
  ElementRef<typeof DrawerPrimitive.Content>,
  ComponentPropsWithRef<typeof DrawerPrimitive.Content>
>(function Component({ children, ...props }, ref) {
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpenRef = useRef(true);

  const pathname = usePathname();
  const originalPathRef = useRef(pathname);
  const previousPathRef = useRef(pathname);

  const router = useRouter();

  useEffect(() => {
    if (pathname === originalPathRef.current && !isOpenRef.current) openButtonRef.current?.click();
    if (pathname !== previousPathRef.current && isOpenRef.current) closeButtonRef.current?.click();
  }, [pathname]);

  return (
    <Drawer
      defaultOpen
      onOpenChange={(isOpen) => {
        if (isOpen) return;
        isOpenRef.current = isOpen;
        if (previousPathRef.current === pathname) router.back();
      }}
    >
      <DrawerTrigger className="hidden" ref={openButtonRef}>
        open
      </DrawerTrigger>
      <DrawerContent {...props} ref={ref}>
        {children}
        <DrawerClose className="hidden" ref={closeButtonRef}>
          Close
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
});
