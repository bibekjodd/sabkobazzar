import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { productsCategories } from '@/lib/constants';
import { KeyOptions } from '@/queries/use-products';
import { FilterXIcon } from 'lucide-react';
import React from 'react';

type Props = {
  filters: KeyOptions;
  setFilters: React.Dispatch<React.SetStateAction<KeyOptions>>;
};

export default function Filter({ filters, setFilters }: Props) {
  return (
    <div className="flex items-end justify-between space-x-4">
      <section className="flex flex-col">
        <Label className="mb-2">Category</Label>
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) => setFilters((options) => ({ ...options, category: value }))}
        >
          <SelectTrigger className="min-w-32">
            <SelectValue placeholder="All" />
          </SelectTrigger>

          <SelectContent className="bg-background/40 filter backdrop-blur-3xl">
            <SelectItem value="all">All</SelectItem>
            {productsCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.title}{' '}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <Button
        Icon={FilterXIcon}
        onClick={() => setFilters((options) => ({ owner: options.owner, title: options.title }))}
        variant="outline"
      >
        Clear Filters
      </Button>
    </div>
  );
}
