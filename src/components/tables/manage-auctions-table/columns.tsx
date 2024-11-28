import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KeyOptions } from '@/queries/use-auctions';
import { ArrowUpDownIcon } from 'lucide-react';
import React from 'react';

type Props = {
  setFilters: React.Dispatch<React.SetStateAction<KeyOptions>>;
};

export default function Columns({ setFilters }: Props) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-24">Banner</TableHead>
        <TableHead className="min-w-52 max-w-72">
          <button
            className="flex items-center space-x-2"
            onClick={() =>
              setFilters((options) => ({
                ...options,
                sort: options?.sort === 'title_asc' ? 'title_desc' : 'title_asc'
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
              setFilters((options) => ({
                ...options,
                sort: options?.sort === 'starts_at_asc' ? 'starts_at_desc' : 'starts_at_asc'
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
              setFilters((options) => ({
                ...options,
                sort: options.sort === 'bid_asc' ? 'bid_desc' : 'bid_asc'
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
