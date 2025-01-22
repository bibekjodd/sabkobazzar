'use client';

import UserHoverCard from '@/components/cards/user-hover-card';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import Avatar from '@/components/utils/avatar';
import { useAuctions } from '@/queries/use-auctions';
import { useProfile } from '@/queries/use-profile';
import { useUser } from '@/queries/use-user';
import { XIcon } from 'lucide-react';
import Columns from './columns';
import Filter, { useFilters } from './filter';
import Row from './row';
import Search from './search';

export default function ManageAuctionsTable() {
  const { data: profile } = useProfile();
  const filters = useFilters();
  const {
    data: auctions,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage
  } = useAuctions({
    ...filters,
    owner: filters.owner,
    resource: profile?.role === 'user' ? 'host' : undefined
  });
  const { data: selectedAuctionHost, isLoading: isLoadingAuctionHost } = useUser(filters.owner!, {
    enabled: !!filters.owner
  });

  const showMore = () => {
    if (isFetching || !hasNextPage) return;
    fetchNextPage();
  };

  return (
    <div>
      <div className="flex items-end space-x-3 lg:space-x-4">
        <Search />
        <Filter />
      </div>

      <div className="mt-3">
        {filters.owner && isLoadingAuctionHost && <Skeleton className="h-7 w-44 rounded-lg" />}
        {selectedAuctionHost && (
          <button
            onClick={() => useFilters.setState({ owner: undefined })}
            className="flex items-center space-x-2 rounded-lg bg-brand/10 px-2.5 py-1 text-sm text-brand hover:bg-rose-400/10 hover:text-error"
          >
            <span>Viewing all results for host</span>
            <UserHoverCard user={selectedAuctionHost}>
              <button>
                <Avatar src={selectedAuctionHost?.image} size="xs" />
              </button>
            </UserHoverCard>
            <XIcon className="size-3.5" />
          </button>
        )}
      </div>

      <ScrollArea className="pb-1">
        <Table className="mt-2 filter backdrop-blur-lg">
          <Columns />
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
            loading={isFetching}
            onClick={showMore}
            disabled={isFetching || !hasNextPage}
          >
            Show More
          </Button>
        </div>
      )}
    </div>
  );
}
