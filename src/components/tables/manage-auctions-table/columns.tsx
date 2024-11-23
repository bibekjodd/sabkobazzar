import { Button } from '@/components/ui/button';
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
        <TableHead>Banner</TableHead>
        <TableHead>
          <Button
            variant="text"
            Icon={ArrowUpDownIcon}
            onClick={() =>
              setFilters((options) => ({
                ...options,
                sort: options?.sort === 'title_asc' ? 'title_desc' : 'title_asc'
              }))
            }
          >
            Title
          </Button>
        </TableHead>

        <TableHead>Schedule</TableHead>

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
