import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProfile } from '@/queries/use-profile';
import { ArrowUpDownIcon } from 'lucide-react';
import { useFilters } from './filter';

export default function Columns() {
  const { data: profile } = useProfile();

  return (
    <TableHeader>
      <TableRow>
        {profile?.role === 'admin' && <TableHead>Host</TableHead>}
        <TableHead className="w-24">Banner</TableHead>
        <TableHead className="min-w-52 max-w-72">
          <button
            className="flex items-center space-x-2"
            onClick={() =>
              useFilters.setState((filters) => ({
                sort: filters?.sort === 'title_asc' ? 'title_desc' : 'title_asc'
              }))
            }
          >
            <span>Title</span>
            <ArrowUpDownIcon className="size-3.5" />
          </button>
        </TableHead>

        <TableHead>
          <button
            className="flex items-center space-x-2"
            onClick={() =>
              useFilters.setState((filters) => ({
                sort: filters?.sort === 'starts_at_asc' ? 'starts_at_desc' : 'starts_at_asc'
              }))
            }
          >
            <span>Schedule</span>
            <ArrowUpDownIcon className="size-3.5" />
          </button>
        </TableHead>

        <TableHead>Status</TableHead>

        <TableHead>Condition</TableHead>
        <TableHead>
          <button
            className="flex items-center space-x-2"
            onClick={() =>
              useFilters.setState((filters) => ({
                sort: filters.sort === 'bid_asc' ? 'bid_desc' : 'bid_asc'
              }))
            }
          >
            <span>Bid</span>
            <ArrowUpDownIcon className="size-3.5" />
          </button>
        </TableHead>

        <TableHead />
      </TableRow>
    </TableHeader>
  );
}
