'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { KeyOptions, useAuctions } from '@/queries/use-auctions';
import { useProfile } from '@/queries/use-profile';
import { useState } from 'react';
import Columns from './columns';
import Filter from './filter';
import Row from './row';
import Search from './search';

export default function ManageAuctionsTable() {
  const { data: profile } = useProfile();
  const [filters, setFilters] = useState<KeyOptions>({ owner: profile?.id });
  const {
    data: auctions,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useAuctions(filters);

  const showMore = () => {
    if (isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  };

  return (
    <div>
      <div className="flex items-end space-x-3 lg:space-x-4">
        <Search setFilters={setFilters} />
        <Filter filters={filters} setFilters={setFilters} />
      </div>

      <ScrollArea className="pb-1">
        <Table className="mt-4 filter backdrop-blur-lg">
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

            {auctions?.map((auction) => <Row key={auction.id} auction={auction} />)}
            {!isLoading && auctions?.length === 0 && (
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

      {auctions && auctions.length > 0 && (
        <div className="mt-4 flex justify-between">
          <span className="text-sm text-muted-foreground">{auctions?.length} Results</span>
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
