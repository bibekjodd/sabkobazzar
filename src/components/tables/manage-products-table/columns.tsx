import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KeyOptions } from '@/queries/use-products';
import { ArrowUpDownIcon } from 'lucide-react';
import React from 'react';

type Props = {
  setFilters: React.Dispatch<React.SetStateAction<KeyOptions>>;
};
export default function Columns({ setFilters }: Props) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-24">Image</TableHead>

        <TableHead className="min-w-52">
          <button
            className="flex items-center space-x-2"
            onClick={() =>
              setFilters((options) => ({
                ...options,
                sort: options.sort === 'title_asc' ? 'title_desc' : 'title_asc'
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
                sort: options.sort === 'price_asc' ? 'price_desc' : 'price_asc'
              }))
            }
          >
            <span>Price</span>
            <ArrowUpDownIcon className="size-3.5" />
          </button>
        </TableHead>

        <TableHead>Category</TableHead>

        <TableHead className="min-w-28">
          <button
            className="flex items-center space-x-2"
            onClick={() =>
              setFilters((options) => ({
                ...options,
                sort: options.sort === 'added_at_asc' ? 'added_at_desc' : 'added_at_asc'
              }))
            }
          >
            <span>Added at</span>
            <ArrowUpDownIcon className="size-3.5" />
          </button>
        </TableHead>

        <TableHead />
      </TableRow>
    </TableHeader>
  );
}
