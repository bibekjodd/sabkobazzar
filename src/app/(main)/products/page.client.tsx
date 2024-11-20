'use client';

import ProductCard, { productSkeleton } from '@/components/cards/product-card';
import FilterProducts, { SearchProductsParams } from '@/components/filter-products';
import FilterProductsDrawer from '@/components/sheets/filter-products-sheet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import InfiniteScrollObserver from '@/components/utils/infinite-scroll-observer';
import { useProducts } from '@/queries/use-products';
import { CircleAlert, FilterIcon, Info } from 'lucide-react';
import React from 'react';

export default function Client({ searchParams }: { searchParams: SearchProductsParams }) {
  const {
    data: products,
    isLoading,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage
  } = useProducts(searchParams);

  return (
    <>
      <aside className="fixed left-0 top-16 hidden h-full max-h-[calc(100vh-64px)] w-60 overflow-y-auto border-r p-4 lg:block">
        <FilterProducts searchParams={searchParams} />
      </aside>
      <main className="z-20 min-h-screen pb-20 pt-32 md:pt-20 lg:pl-60">
        {!isLoading && products?.pages[0].length === 0 && (
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

        <div className="grid md:grid-cols-2 xl:grid-cols-3">
          {isLoading &&
            new Array(8).fill('nothing').map((_, i) => (
              <div key={i} className="pb-5 md:px-2.5">
                {productSkeleton}
              </div>
            ))}

          {products?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.map((product) => (
                <div key={product.id} className="pb-5 md:px-2.5">
                  <ProductCard product={product} view="user" />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
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
