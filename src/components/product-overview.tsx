'use client';

import { openLoginDialog } from '@/hooks/use-login-dialog';
import { dummyProductImage, MILLIS } from '@/lib/constants';
import { cn, formatPrice } from '@/lib/utils';
import { useInterested } from '@/mutations/use-interested';
import { useProduct } from '@/queries/use-product';
import { useProfile } from '@/queries/use-profile';
import { CheckCheckIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import Avatar from './utils/avatar';

type Props = { product: Product };
export default function ProductOverview({ product: productData }: Props) {
  const { data: profile } = useProfile();
  const { data } = useProduct(productData.id, {
    initialData: productData,
    refetchInterval: MILLIS.MINUTE
  });
  const product = data || productData;
  const { mutate, isPending } = useInterested(product.id);

  const updateInterested = () => {
    if (!profile) return;
    mutate(!product.isInterested);
  };

  return (
    <div className="grid w-full space-y-5 lg:grid-cols-2 lg:space-y-0">
      <img
        src={product.image || dummyProductImage}
        alt="product image"
        className="aspect-video w-full object-contain"
      />

      <div className="flex flex-col text-sm text-indigo-200/80 lg:pl-10">
        <h4 className="text-2xl font-medium text-indigo-100">{product.title}</h4>
        <h4 className="text-lg font-semibold text-indigo-100">{formatPrice(product.price)}</h4>

        <div className="mt-2 space-y-1">
          <span className="">Seller - </span>
          <div className="inline-flex items-center space-x-3">
            <p> {product.owner.name}</p>
            <Avatar src={product.owner.image} size="sm" />
          </div>
        </div>

        {product.description && (
          <div className="mt-2">
            <p>Description</p>
            <p className="text-indigo-200/50">{product.description}</p>
          </div>
        )}

        <div className="mt-auto pt-5">
          <Button
            disabled={isPending}
            loading={isPending}
            onClick={profile ? updateInterested : openLoginDialog}
            variant={product.isInterested ? 'outline' : 'secondary'}
            className={cn('w-full', !product.isInterested && 'bg-transparent')}
            Icon={product.isInterested ? undefined : CheckCheckIcon}
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
