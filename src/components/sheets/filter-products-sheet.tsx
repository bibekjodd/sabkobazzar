import React from 'react';
import FilterProducts, { SearchProductsParams } from '../filter-products';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../ui/sheet';

export default function FilterProductsSheet({
  children,
  searchParams
}: {
  children: React.ReactNode;
  searchParams: SearchProductsParams;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" className="flex w-[calc(100%-20px)] max-w-80 flex-col">
        <SheetHeader className="sr-only">
          <SheetTitle />
        </SheetHeader>
        <SheetDescription className="sr-only" />

        <FilterProducts searchParams={searchParams} />

        <SheetFooter className="mt-auto">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
