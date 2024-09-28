'use client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { dummyProductImage } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { useProduct } from '@/queries/use-product';
import { CircleAlert } from 'lucide-react';

export default function Page({ params }: { params: { id: string } }) {
  const { data: product, isLoading, error } = useProduct(params.id);
  return (
    <main className="cont py-4">
      {error && (
        <Alert variant="destructive">
          <CircleAlert className="size-4" />
          <AlertTitle>Could not find product</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {product && (
        <div className="grid lg:grid-cols-2">
          <img src={product.image || dummyProductImage} alt="product image" />

          <div className="flex flex-col space-y-3">
            <h4 className="text-xl font-medium">{product.title}</h4>
            <h4 className="text-xl font-bold">Rs. {formatPrice(product.price)}</h4>
          </div>
        </div>
      )}
    </main>
  );
}
