import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { KeyOptions } from '@/queries/use-auctions';
import { SearchIcon, XIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {
  setFilters: React.Dispatch<React.SetStateAction<KeyOptions>>;
};

export default function Search({ setFilters }: Props) {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchInput = useDebounce(searchInput);

  useEffect(() => {
    setFilters((options) => ({ ...options, title: debouncedSearchInput }));
  }, [debouncedSearchInput, setFilters]);
  return (
    <div className="w-full">
      <Input
        id="title"
        label="Title"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Auction title..."
        className="w-full"
        IconRight={searchInput ? XIcon : undefined}
        iconRightAction={() => setSearchInput('')}
        IconLeft={SearchIcon}
      />
    </div>
  );
}
