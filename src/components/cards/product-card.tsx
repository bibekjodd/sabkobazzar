import { dummyProductImage } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { MoveRight } from 'lucide-react';
import AddProductDialog from '../dialogs/add-product-dialog';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import ProgressLink from '../utils/progress-link';

type Props = { product: Product } & (
  | { view: 'user'; queryKey?: undefined }
  | { view: 'seller'; queryKey: QueryKey }
);
export default function ProductCard({ product, view, queryKey }: Props) {
  const queryClient = useQueryClient();
  const updateProductCache = () => {
    queryClient.setQueryData<Product>(['product', product.id], {
      ...product
    });
  };
  const productLink = `/products/${product.id}`;

  return (
    <div className="m-4 flex flex-col overflow-hidden rounded-lg border shadow-xl shadow-gray-300/30">
      <ProgressLink href={productLink} onClick={updateProductCache} className="w-full">
        <img
          src={product.image || dummyProductImage}
          alt="product image"
          className="aspect-video max-h-96 w-full object-contain transition-all duration-300 ease-in-out hover:scale-110"
        />
      </ProgressLink>

      <div className="flex flex-col p-4">
        <h4 className="text-xl font-medium">{product.title}</h4>
        <h4 className="text-xl font-bold">Rs. {formatPrice(product.price)}</h4>
        {view === 'user' && (
          <ProgressLink href={productLink} className="mt-3 w-full" onClick={updateProductCache}>
            <Button Icon={MoveRight} className="w-full">
              See more
            </Button>
          </ProgressLink>
        )}

        {view === 'seller' && (
          <AddProductDialog product={product} queryKey={queryKey}>
            <Button className="mt-3 w-full">Update Product</Button>
          </AddProductDialog>
        )}
      </div>
    </div>
  );
}

export const productSkeleton = (
  <div className="w-full space-y-3 rounded-lg border p-4 shadow-xl shadow-gray-300/30">
    <Skeleton className="aspect-video w-full" />
    <Skeleton className="h-10" />
    <Skeleton className="h-10" />
    <Skeleton className="h-10" />
  </div>
);