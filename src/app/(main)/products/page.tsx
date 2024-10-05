'use client';
import ProductCard, { productSkeleton } from '@/components/cards/product-card';
import ProductsFilterSidebar, {
  SearchProductsParams
} from '@/components/layouts/products-filter-sidebar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import InfiniteScrollObserver from '@/components/utils/infinite-scroll-observer';
import { getSearchString } from '@/lib/utils';
import { useProducts } from '@/queries/use-products';
import { CircleAlert, Info } from 'lucide-react';
import React, { useMemo } from 'react';

export default function Page({ searchParams }: { searchParams: SearchProductsParams }) {
  const searchString = useMemo(() => getSearchString(searchParams), [searchParams]);
  const {
    data: products,
    isLoading,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage
  } = useProducts(searchString);

  return (
    <>
      <aside className="fixed left-0 top-16 -z-10 hidden h-[calc(100vh-64px)] w-60 overflow-y-auto border-r lg:block">
        <ProductsFilterSidebar searchParams={searchParams} />
      </aside>
      <main className="min-h-screen pb-4 lg:pl-60">
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
              <div key={i} className="p-4">
                {productSkeleton}
              </div>
            ))}

          {products?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.map((product) => (
                <ProductCard key={product.id} product={product} view="user" />
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
      </main>
    </>
  );
}
