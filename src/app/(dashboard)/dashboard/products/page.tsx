'use client';
import ProductCard from '@/components/cards/product-card';
import AddProductDialog from '@/components/dialogs/add-product-dialog';
import { Button } from '@/components/ui/button';
import InfiniteScrollObserver from '@/components/utils/infinite-scroll-observer';
import { useProducts } from '@/queries/use-products';
import { useProfile } from '@/queries/use-profile';
import { Plus } from 'lucide-react';
import React from 'react';

export default function Page() {
  const { data: profile } = useProfile();
  const {
    data: products,
    isFetching,
    fetchNextPage,
    hasNextPage
  } = useProducts(`?owner=${profile?.id}`);
  return (
    <main>
      <div className="flex w-full items-center justify-between p-4 filter backdrop-blur-2xl">
        <span className="text-xl font-semibold">Your products</span>
        <AddProductDialog>
          <Button Icon={Plus} variant="white">
            Add product
          </Button>
        </AddProductDialog>
      </div>

      <div className="pb-4">
        <div className="grid md:grid-cols-2 xl:grid-cols-3">
          {products?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.map((product) => (
                <div key={product.id} className="pb-5 md:px-2.5">
                  <ProductCard
                    product={product}
                    view="seller"
                    queryKey={['products', `?owner=${profile?.id}`]}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <InfiniteScrollObserver
          showLoader
          isFetching={isFetching}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </main>
  );
}
