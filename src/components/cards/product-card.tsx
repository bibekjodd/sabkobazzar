import { dummyProductImage } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { useProduct } from '@/queries/use-product';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { ChevronsUp, MoveRight } from 'lucide-react';
import AddProductDialog from '../dialogs/add-product-dialog';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

type Props = { product: Product; view: 'seller' | 'user' };
export default function ProductCard({ product: productData, view }: Props) {
  const { data } = useProduct(productData.id, { initialData: productData });
  const product = data || productData;

  const productLink = `/products/${product.id}`;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-lg p-0.5 shadow-2xl">
      <div className="absolute inset-0 -z-10 rounded-lg border-2 border-primary/[0.07] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="absolute inset-0 -z-10 rounded-lg border-2 border-primary/15 [mask-image:linear-gradient(to_top,black,transparent)]" />
      <div className="absolute left-0 top-0 -z-10 size-40 rounded-full bg-indigo-500/20 blur-3xl filter" />
      <div className="absolute right-0 top-0 -z-10 size-40 rounded-full bg-purple-500/20 blur-3xl filter" />
      <div className="absolute bottom-0 left-0 -z-10 size-40 rounded-full bg-sky-500/10 blur-3xl filter" />
      <div className="absolute bottom-0 right-0 -z-10 size-40 rounded-full bg-white/5 blur-3xl filter" />

      <ProgressLink href={productLink} className="w-full overflow-hidden rounded-sm">
        <img
          src={product.image || dummyProductImage}
          alt="product image"
          className="aspect-video max-h-96 w-full object-contain transition-all duration-300 ease-in-out hover:scale-110"
        />
      </ProgressLink>

      <div className="flex flex-col p-4 pb-0">
        <h4 className="line-clamp-2 text-xl font-medium">{product.title}</h4>
        <h4 className="text-xl font-bold">Rs. {formatPrice(product.price)}</h4>
      </div>

      <div className="mt-auto flex flex-col p-4">
        {view === 'user' && (
          <ProgressLink href={productLink} className="mt-3 w-full">
            <Button Icon={MoveRight} className="w-full">
              See more
            </Button>
          </ProgressLink>
        )}

        {view === 'seller' && (
          <AddProductDialog product={product}>
            <Button className="mt-3 w-full" variant="secondary" Icon={ChevronsUp}>
              Update Product
            </Button>
          </AddProductDialog>
        )}
      </div>
    </div>
  );
}

export const productSkeleton = (
  <div className="w-full space-y-3 rounded-lg border p-4 shadow-2xl shadow-white/5">
    <Skeleton className="aspect-video w-full" />
    <Skeleton className="h-8" />
    <Skeleton className="h-8" />
    <Skeleton className="h-10" />
  </div>
);
