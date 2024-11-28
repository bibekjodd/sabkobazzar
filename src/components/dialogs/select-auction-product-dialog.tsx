'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { dummyProductImage } from '@/lib/constants';
import { useProducts } from '@/queries/use-products';
import { useProfile } from '@/queries/use-profile';
import { AutoAnimate } from '@jodd/auto-animate';
import { CircleAlert, SearchIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import InfiniteScrollObserver from '../utils/infinite-scroll-observer';
import RegisterAuctionDialog from './register-auction-dialog';

type Props = {
  children: React.ReactNode;
};
export default function SelectAuctionProductDialog({ children }: Props) {
  const { data: profile } = useProfile();
  const [searchInput, setSearchInput] = useState('');
  const { owner, title } = useDebounce({ owner: profile?.id, title: searchInput }, 250);
  const {
    data: products,
    isLoading,
    fetchNextPage,
    isFetching,
    hasNextPage,
    error
  } = useProducts({ owner, title });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Select Product</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />

        <section className="flex h-full flex-col space-y-2">
          <Input
            id="search-products"
            IconLeft={SearchIcon}
            placeholder="Search..."
            label="Select products"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <ScrollArea className="flex max-h-96 flex-grow flex-col overflow-y-auto pt-2">
            <AutoAnimate className="flex flex-col space-y-3 px-1 py-3">
              {error && (
                <Alert variant="destructive">
                  <CircleAlert className="size-4" />
                  <AlertTitle>Could not search products</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}

              {!isLoading && !products?.pages?.at(0)?.products.at(0) && (
                <p className="text-sm text-rose-500">No results found!</p>
              )}
              {isLoading &&
                new Array(4)
                  .fill('nothing')
                  .map((_, i) => <React.Fragment key={i}>{skeleton}</React.Fragment>)}
              {products?.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.products.map((product) => (
                    <ProductResultItem key={product.id} product={product} />
                  ))}
                </React.Fragment>
              ))}
              <InfiniteScrollObserver
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetching={isFetching}
                showLoader
              />
            </AutoAnimate>
          </ScrollArea>
        </section>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="block w-full">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProductResultItem({ product }: { product: Product }) {
  return (
    <div className="rounded-lg bg-gray-900/50 hover:bg-gray-900">
      <div className="flex">
        <img
          src={product.image || dummyProductImage}
          className="aspect-video w-20 object-contain"
          alt="product image"
        />
        <div className="flex w-full flex-col justify-between px-4 py-2">
          <span className="line-clamp-2 text-sm">{product.title}</span>
          <RegisterAuctionDialog product={product}>
            <Button className="mt-2 block w-full" size="sm" variant="secondary">
              Select
            </Button>
          </RegisterAuctionDialog>
        </div>
      </div>
    </div>
  );
}

const skeleton = (
  <div className="flex w-full space-x-3">
    <Skeleton className="aspect-video w-40" />
    <div className="flex flex-grow flex-col justify-between">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
    </div>
  </div>
);
