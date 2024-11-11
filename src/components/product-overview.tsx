'use client';

import { dummyProductImage, MILLIS } from '@/lib/constants';
import { cn, formatPrice } from '@/lib/utils';
import { useInterested } from '@/mutations/use-interested';
import { useProduct } from '@/queries/use-product';
import { CircleCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import Avatar from './utils/avatar';

type Props = { product: Product };
export default function ProductOverview({ product: productData }: Props) {
  const { data } = useProduct(productData.id, {
    initialData: productData,
    refetchInterval: MILLIS.MINUTE
  });
  const product = data || productData;
  const { mutate, isPending } = useInterested(product.id);
  const updateInterested = () => {
    mutate(!product.isInterested);
  };

  return (
    <div className="grid w-full space-y-5 lg:grid-cols-2 lg:space-y-0">
      <img
        src={product.image || dummyProductImage}
        alt="product image"
        className="aspect-video w-full object-contain"
      />

      <div className="flex flex-col text-sm text-gray-400/90 lg:pl-10">
        <h4 className="text-xl font-medium text-primary">{product.title}</h4>
        <h4 className="text-lg font-semibold text-primary">Rs. {formatPrice(product.price)}</h4>

        <div className="mt-2 space-y-1">
          <span className="">Owner - </span>
          <div className="inline-flex items-center space-x-3">
            <p> {product.owner.name}</p>
            <Avatar src={product.owner.image} size="sm" />
          </div>
        </div>

        {product.description && (
          <div className="mt-2">
            <p>Description</p>
            <p className="text-gray-400/60">{product.description}</p>
          </div>
        )}

        <div className="mt-auto pt-5">
          <Button
            disabled={isPending}
            loading={isPending}
            onClick={updateInterested}
            variant={product.isInterested ? 'outline' : 'secondary'}
            className={cn('w-full', !product.isInterested && 'bg-transparent')}
            Icon={product.isInterested ? undefined : CircleCheck}
          >
            {product.isInterested ? 'Remove from interested' : 'Add to interested'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export const productOverviewSkeleton = (
  <div className="grid space-y-5 lg:grid-cols-2 lg:space-y-0">
    <Skeleton className="aspect-video w-full" />
    <div className="flex flex-col space-y-2 lg:pl-10">
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
      <Skeleton className="h-28" />
      <div className="pt-5">
        <Skeleton className="h-9" />
      </div>
    </div>
  </div>
);
