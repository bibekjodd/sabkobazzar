'use client';
import ProductOverview, { productOverviewSkeleton } from '@/components/product-overview';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useProduct } from '@/queries/use-product';
import { CircleAlert } from 'lucide-react';

export default function Page({ params }: { params: { id: string } }) {
  const { data: product, isLoading, error } = useProduct(params.id);
  return (
    <main className="cont py-4 pb-20">
      {error && (
        <Alert variant="destructive">
          <CircleAlert className="size-4" />
          <AlertTitle>Could not find product</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid min-h-screen place-items-center py-7 pt-16">
        {isLoading && <div className="w-full">{productOverviewSkeleton}</div>}
        {product && <ProductOverview product={product} />}
      </div>
    </main>
  );
}
