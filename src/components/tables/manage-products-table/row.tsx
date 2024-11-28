import AddProductDialog from '@/components/dialogs/add-product-dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { dummyProductImage, productsCategories } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { useProduct } from '@/queries/use-product';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import dayjs from 'dayjs';
import { KanbanIcon } from 'lucide-react';

export default function Row({ product: productData }: { product: Product }) {
  const { data } = useProduct(productData.id, { initialData: productData });
  const product = data || productData;

  return (
    <TableRow className="h-16">
      <TableCell>
        <ProgressLink href={`/products/${product.id}`}>
          <img
            src={product.image || dummyProductImage}
            alt="product image"
            className="aspect-video object-cover"
          />
        </ProgressLink>
      </TableCell>

      <TableCell className="max-w-72">
        <ProgressLink href={`/products/${product.id}`} className="line-clamp-1 hover:underline">
          {product.title}
        </ProgressLink>
      </TableCell>

      <TableCell className="whitespace-nowrap">{formatPrice(product.price)}</TableCell>

      <TableCell>
        {productsCategories.find((category) => category.value === product.category)?.title}
      </TableCell>

      <TableCell className="whitespace-nowrap">
        {dayjs(product.addedAt).format('MMM DD, YYYY')}
      </TableCell>

      <TableCell>
        <AddProductDialog product={product}>
          <button className="flex items-center space-x-2">
            <KanbanIcon className="size-4" />
            <span>Manage</span>
          </button>
        </AddProductDialog>
      </TableCell>
    </TableRow>
  );
}