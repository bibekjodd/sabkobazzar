'use client';

import { openAddAdminDialog } from '@/components/dialogs/add-admin-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import { useUsers } from '@/queries/use-users';
import { UserPlusIcon } from 'lucide-react';
import Columns from './columns';
import Row from './row';
import Search, { useSearch } from './search';

export default function ManageStaffsTable() {
  const { q } = useSearch();
  const debouncedSearchQueryInput = useDebounce(q);
  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } = useUsers({
    q: debouncedSearchQueryInput,
    role: 'admin'
  });

  const users = [...(data || [])].sort((a, b) => a.name.localeCompare(b.name));

  const showMore = () => {
    if (isFetching || !hasNextPage) return;
    fetchNextPage();
  };

  return (
    <section>
      <div className="flex items-end gap-x-2">
        <Search />
        <Button variant="outline" onClick={openAddAdminDialog}>
          <span className="hidden pr-2 xs:inline">Add new admin</span>
          <UserPlusIcon />
        </Button>
      </div>
      <ScrollArea className="mt-3 pb-2">
        <Table>
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

            {users.map((user) => (
              <Row key={user.id} user={user} />
            ))}

            {!isLoading && users.length === 0 && (
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

      {users && users.length > 0 && (
        <div className="mt-4 flex justify-between">
          <span className="text-sm text-muted-foreground">{users?.length} Results</span>
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
    </section>
  );
}
