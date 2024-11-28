import { dummyProductImage } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { useProduct } from '@/queries/use-product';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { MoveRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import Avatar from '../utils/avatar';

type Props = { product: Product; view: 'list' | 'grid' };
export default function ProductCard({ product: productData, view }: Props) {
  const { data } = useProduct(productData.id, { initialData: productData });
  const product = data || productData;
  if (view === 'grid') return <GridView product={product} />;
  return <ListView product={product} />;
}

function GridView({ product }: { product: Product }) {
  const productLink = `/products/${product.id}`;
  return (
    <section className="relative flex h-full flex-col overflow-hidden rounded-lg p-0.5">
      <div className="absolute inset-0 -z-10 rounded-lg border-2 border-purple-700/5 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="absolute inset-0 -z-10 rounded-lg border-2 border-purple-700/20 [mask-image:linear-gradient(to_top,black,transparent)]" />
      <div className="absolute left-0 top-0 -z-10 size-40 rounded-full bg-indigo-500/20 blur-3xl filter" />
      <div className="absolute right-0 top-0 -z-10 size-40 rounded-full bg-purple-500/20 blur-3xl filter" />
      <div className="absolute bottom-0 left-0 -z-10 size-40 rounded-full bg-sky-500/10 blur-3xl filter" />
      <div className="absolute bottom-0 right-0 -z-10 size-40 rounded-full bg-white/5 blur-3xl filter" />
      <div className="absolute inset-0 -z-10 bg-background/25" />

      <ProgressLink href={productLink} className="w-full overflow-hidden rounded-sm">
        <img
          src={product.image || dummyProductImage}
          alt="product image"
          className="aspect-video max-h-96 w-full object-contain transition-all duration-300 ease-in-out hover:scale-110"
        />
      </ProgressLink>

      <div className="flex flex-col p-4 pb-0">
        <h3 className="line-clamp-2 text-xl text-indigo-100/90">{product.title}</h3>
        <p className="mt-2 text-xl font-semibold text-indigo-100">{formatPrice(product.price)}</p>
      </div>

      <div className="mt-auto flex flex-col p-4 pt-2">
        <ProgressLink href={productLink} className="mt-3 w-full">
          <Button Icon={MoveRight} className="w-full">
            See more
          </Button>
        </ProgressLink>
      </div>
    </section>
  );
}

function ListView({ product }: { product: Product }) {
  const productLink = `/products/${product.id}`;

  return (
    <ProgressLink
      href={productLink}
      className="relative flex max-w-screen-lg gap-x-6 overflow-hidden rounded-lg p-6"
    >
      <div className="absolute inset-0 -z-10 rounded-lg border-2 border-purple-800/15 [mask-image:linear-gradient(to_bottom_right,transparent,black)]" />
      <div className="absolute bottom-0 left-0 -z-10 h-1/2 w-6/12 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="absolute right-0 top-0 -z-10 h-1/2 w-6/12 rounded-full bg-purple-600/10 blur-3xl" />
      <div className="absolute inset-0 -z-10 bg-background/30" />

      <div className="grid min-w-48 max-w-48 place-items-center md:min-w-60 md:max-w-60">
        <img
          src={product.image || dummyProductImage}
          alt="product image"
          className="aspect-video size-full object-contain"
        />
      </div>

      <div className="flex-grow">
        <h3 className="line-clamp-2 text-lg font-medium hover:text-purple-500">{product.title}</h3>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span>Seller: </span>
          <Avatar src={product.owner.image} size="sm" />
          <span>{product.owner.name}</span>
        </div>
        <p className="mt-2 text-xl font-medium">{formatPrice(product.price)}</p>
      </div>
    </ProgressLink>
  );
}

export function ProductCardSkeleton({ view }: { view: 'list' | 'grid' }) {
  if (view === 'grid')
    return (
      <div className="w-full space-y-3 rounded-lg border p-4 shadow-2xl shadow-white/5">
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
        <Skeleton className="h-9" />
      </div>
    );

  return (
    <div className="relative flex w-full max-w-screen-lg space-x-6 p-6">
      <Skeleton className="aspect-video w-48 md:w-60" />
      <div className="flex flex-grow flex-col space-y-3">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}
