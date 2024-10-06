import { dummyProductImage } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import Avatar from './utils/avatar';

export default function ProductOverview({ product }: { product: Product }) {
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
            <Avatar src={product.owner.image} variant="sm" />
          </div>
        </div>

        {product.description && (
          <div className="mt-2">
            <p>Description</p>
            <p className="text-gray-400/60">{product.description}</p>
          </div>
        )}

        <div className="mt-auto pt-5">
          <button className="h-9 w-full rounded-lg bg-gradient-to-b from-gray-400 to-gray-500/90 text-sm font-medium text-primary-foreground hover:brightness-125">
            Interested
          </button>
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
