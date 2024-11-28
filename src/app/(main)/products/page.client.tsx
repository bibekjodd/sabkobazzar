'use client';

import ProductCard, { ProductCardSkeleton } from '@/components/cards/product-card';
import FilterProducts, { SearchProductsParams } from '@/components/filter-products';
import FilterProductsDrawer from '@/components/sheets/filter-products-sheet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import InfiniteScrollObserver from '@/components/utils/infinite-scroll-observer';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useWindowSize } from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';
import { useProducts } from '@/queries/use-products';
import { AlignJustifyIcon, CircleAlert, FilterIcon, Grid2X2Icon, Info } from 'lucide-react';
import React from 'react';

export default function Client({ searchParams }: { searchParams: SearchProductsParams }) {
  const { data, isLoading, error, isFetching, hasNextPage, fetchNextPage } =
    useProducts(searchParams);

  const [view, setView] = useLocalStorage<'list' | 'grid'>('products-view', 'grid');
  const { width: windowWidth } = useWindowSize();

  return (
    <>
      <aside className="fixed left-0 top-16 hidden h-full max-h-[calc(100vh-64px)] w-60 overflow-y-auto border-r border-gray-400/10 p-4 lg:block">
        <FilterProducts searchParams={searchParams} />
      </aside>
      <main className="z-20 min-h-screen pb-20 pt-32 md:pt-20 lg:pl-60">
        {!isLoading && data?.pages[0].products.length === 0 && (
          <div className="p-4">
            <Alert>
              <Info className="size-4" />
              <AlertTitle>No products found</AlertTitle>
              <AlertDescription>Try applying different title or filters</AlertDescription>
            </Alert>
          </div>
        )}

        {error && (
          <div className="p-4">
            <Alert variant="destructive">
              <CircleAlert className="size-4" />
              <AlertTitle>Could not find products</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="mx-4 hidden w-fit grid-cols-2 rounded-md bg-muted/40 p-1 sm:grid">
          <button
            onClick={() => setView('grid')}
            className={cn('flex items-center space-x-2 rounded-md px-6 py-1.5 text-sm', {
              'bg-background': view === 'grid'
            })}
          >
            <Grid2X2Icon className="size-3.5" />
            <span>Grid view</span>
          </button>

          <button
            onClick={() => setView('list')}
            className={cn('flex items-center space-x-2 rounded-md px-6 py-1.5 text-sm', {
              'bg-background': view === 'list'
            })}
          >
            <AlignJustifyIcon className="size-3.5" />
            <span>List view</span>
          </button>
        </div>

        <section
          className={cn('grid gap-x-5 gap-y-10 p-4', {
            'md:grid-cols-2 xl:grid-cols-3': view === 'grid'
          })}
        >
          {isLoading &&
            new Array(8)
              .fill('nothing')
              .map((_, i) => (
                <ProductCardSkeleton key={i} view={windowWidth <= 640 ? 'grid' : view || 'grid'} />
              ))}

          {data?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  view={windowWidth <= 640 ? 'grid' : view || 'grid'}
                />
              ))}
            </React.Fragment>
          ))}
        </section>
        <InfiniteScrollObserver
          isFetching={isFetching}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          showLoader
        />

        <FilterProductsDrawer searchParams={searchParams}>
          <button className="fixed bottom-5 left-5 rounded-full bg-background/90 p-2.5 filter backdrop-blur-3xl lg:hidden">
            <FilterIcon className="size-5" />
          </button>
        </FilterProductsDrawer>
      </main>
    </>
  );
}
