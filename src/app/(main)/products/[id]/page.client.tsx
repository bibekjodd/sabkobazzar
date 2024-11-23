'use client';

import ProductCard from '@/components/cards/product-card';
import ProductOverview, { productOverviewSkeleton } from '@/components/product-overview';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useProduct } from '@/queries/use-product';
import { useProducts } from '@/queries/use-products';
import { CircleAlert } from 'lucide-react';
import { useMemo } from 'react';

export default function Client({ productId }: { productId: string }) {
  const { data: product, isLoading, error } = useProduct(productId);
  useProducts({ owner: product?.ownerId });
  useProducts({});

  return (
    <main className="cont py-4 pb-20 pt-20">
      {error && (
        <Alert variant="destructive">
          <CircleAlert className="size-4" />
          <AlertTitle>Could not find product</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col space-y-20 pt-4">
        {isLoading && <div>{productOverviewSkeleton}</div>}
        {product && <ProductOverview product={product} />}
        {product && <MoreProductsFromOwner currentProduct={product} ownerId={product.owner.id} />}
      </div>
    </main>
  );
}

function MoreProductsFromOwner({
  ownerId,
  currentProduct
}: {
  ownerId: string;
  currentProduct: Product;
}) {
  const { data } = useProducts({ owner: ownerId });
  const products = (data?.pages.map((page) => page.products).flat(1) || [])
    .filter((product) => product.id !== currentProduct.id)
    .slice(0, 4);

  if (!products.length) return <MoreProducts skipProducts={[currentProduct]} />;

  return (
    <>
      <section>
        <h3 className="line-clamp-1 text-xl font-medium">
          More Products from {currentProduct.owner.name}
        </h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className={cn({ 'last:hidden md:last:block xl:last:hidden': products.length === 4 })}
            >
              <ProductCard product={product} view="user" />
            </div>
          ))}
        </div>
      </section>

      <MoreProducts skipProducts={[...products, currentProduct]} />
    </>
  );
}

function MoreProducts({ skipProducts }: { skipProducts: Product[] }) {
  const { data } = useProducts({});

  const products = useMemo((): Product[] => {
    let products = data?.pages.map((page) => page.products).flat(1) || [];
    products = products.filter((product) => {
      const exists = skipProducts.find((curr) => curr.id === product.id);
      return !exists;
    });

    return products.slice(0, 4);
  }, [data?.pages, skipProducts]);
  if (!products.length) return null;

  return (
    <section>
      <h3 className="text-xl font-medium">Explore more products</h3>
      <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className={cn({ 'last:hidden md:last:block xl:last:hidden': products.length === 4 })}
          >
            <ProductCard product={product} view="user" />
          </div>
        ))}
      </div>
    </section>
  );
}
