'use client';
import { useTimeout } from '@/hooks/use-timeout';
import { dummyProductImage } from '@/lib/constants';
import { useProducts } from '@/queries/use-products';
import { useProfile } from '@/queries/use-profile';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import AutoAnimate from '../utils/auto-animate';
import InfiniteScrollObserver from '../utils/infinite-scroll-observer';
import RegisterAuctionDialog from './register-auction-dialog';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { CircleAlert } from 'lucide-react';

type Props = {
  children: React.ReactNode;
};
export default function SelectAuctionProductDialog({ children }: Props) {
  const { data: profile } = useProfile();
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState(`?title=${title}&owner=${profile?.id}`);

  useTimeout(() => {
    setQuery(`?title=${title}&owner=${profile?.id}`);
  }, 250);

  const {
    data: products,
    isLoading,
    fetchNextPage,
    isFetching,
    hasNextPage,
    error
  } = useProducts(query);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-full flex-col bg-background/70 filter backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-center">Select Product</DialogTitle>
        </DialogHeader>

        <section className="flex h-full flex-col space-y-2">
          <div className="flex flex-col space-y-2">
            <Label id="search">Select products</Label>
            <Input
              placeholder="Search..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <AutoAnimate className="flex max-h-96 flex-grow flex-col space-y-3 overflow-y-auto px-1 py-3 scrollbar-thin">
            {error && (
              <Alert variant="destructive">
                <CircleAlert className="size-4" />
                <AlertTitle>Could not search products</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            {!isLoading && !products?.pages?.at(0)?.at(0) && (
              <p className="text-sm text-rose-500">No results found!</p>
            )}
            {isLoading &&
              new Array(4)
                .fill('nothing')
                .map((_, i) => <React.Fragment key={i}>{skeleton}</React.Fragment>)}
            {products?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.map((product) => (
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
    <div className="rounded-md bg-gray-900/80 hover:bg-gray-800/70">
      <div className="flex">
        <img
          src={product.image || dummyProductImage}
          className="aspect-video w-40 object-contain"
          alt="product image"
        />
        <div className="flex w-full flex-col justify-between px-4 py-2">
          <span>{product.title}</span>
          <RegisterAuctionDialog product={product}>
            <Button className="block w-full font-bold" size="sm">
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
