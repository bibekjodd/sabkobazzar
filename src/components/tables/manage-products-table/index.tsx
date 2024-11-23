import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { KeyOptions, useProducts } from '@/queries/use-products';
import { useProfile } from '@/queries/use-profile';
import { useState } from 'react';
import Columns from './columns';
import Filter from './filter';
import Row from './row';
import Search from './search';

export default function ManageProductsTable() {
  const { data: profile } = useProfile();
  const [filters, setFilters] = useState<KeyOptions>({ owner: profile?.id });
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useProducts(filters);
  const products = data?.pages.map((page) => page.products).flat(1) || [];

  const showMore = () => {
    if (isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  };

  return (
    <div className="-mt-2.5">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-end sm:space-x-3 lg:space-x-4">
        <Search setFilters={setFilters} />
        <Filter filters={filters} setFilters={setFilters} />
      </div>

      <ScrollArea className="pb-1">
        <Table className="mt-4 border">
          <Columns setFilters={setFilters} />
          <TableBody>
            {isLoading &&
              new Array(5).fill('nothing').map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={10}>
                    <Skeleton className="h-12 rounded-sm" />
                  </TableCell>
                </TableRow>
              ))}

            {products.map((product) => (
              <Row key={product.id} product={product} />
            ))}

            {!isLoading && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {products.length > 0 && (
        <div className="mt-4 flex justify-between">
          <span className="text-sm text-muted-foreground">{products.length} Results</span>
          <Button
            size="sm"
            variant="outline"
            loading={isFetchingNextPage}
            onClick={showMore}
            disabled={isFetchingNextPage || !hasNextPage}
          >
            Show More
          </Button>
        </div>
      )}
    </div>
  );
}
