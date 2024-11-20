'use client';

import ProductCard from '@/components/cards/product-card';
import AddProductDialog from '@/components/dialogs/add-product-dialog';
import InfiniteScrollObserver from '@/components/utils/infinite-scroll-observer';
import { useProducts } from '@/queries/use-products';
import { useProfile } from '@/queries/use-profile';
import { PackageIcon } from 'lucide-react';

export default function Page() {
  const { data: profile } = useProfile();
  const { data, isFetching, fetchNextPage, hasNextPage } = useProducts({ owner: profile?.id });
  const products = data?.pages.flat(1) || [];

  return (
    <main className="relative overflow-hidden">
      <div className="absolute left-0 top-20 h-24 w-48 rotate-45 bg-indigo-500/15 blur-3xl filter sm:h-40 sm:w-80 md:h-48 md:w-96 lg:w-[500px]" />
      <div className="absolute right-0 top-20 h-24 w-48 -rotate-45 bg-violet-500/15 blur-3xl filter sm:h-40 sm:w-80 md:h-48 md:w-96 lg:w-[500px]" />
      <div className="fixed inset-0 -z-10 bg-black/30 lg:left-64" />

      <div className="grid place-items-center px-4 pt-20 md:min-h-[calc(100vh-120px)]">
        <AddProductDialog>
          <button className="relative flex aspect-video w-full max-w-screen-sm flex-col items-center justify-center rounded-xl p-6">
            <div className="absolute inset-0 -z-20 scale-105 rounded-xl bg-gradient-to-r from-indigo-700 to-purple-900 blur-3xl brightness-[0.1] filter" />
            {/* <div className="absolute inset-0 -z-10 rounded-xl border-2 border-purple-950/50 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
            <div className="absolute inset-0 -z-10 rounded-xl border-2 border-purple-950/30 [mask-image:linear-gradient(to_top,black,transparent)]" /> */}

            <PackageIcon className="size-20 stroke-[0.75]" />
            <span className="mt-7 text-2xl font-medium">Add new Product</span>
          </button>
        </AddProductDialog>
      </div>
      {products.length > 0 && (
        <div className="mt-20 px-4">
          <h3 className="text-2xl font-medium xs:text-3xl sm:text-4xl">Your products</h3>
          <div className="mt-5 grid md:mt-7 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="pb-5 md:px-2.5">
                <ProductCard product={product} view="seller" />
              </div>
            ))}
          </div>
          <InfiniteScrollObserver
            showLoader
            isFetching={isFetching}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      )}
    </main>
  );
}
