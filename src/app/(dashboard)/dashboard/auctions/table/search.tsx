import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFilters } from './filter';

export default function Search() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchInput = useDebounce(searchInput);

  useEffect(() => {
    useFilters.setState({ title: debouncedSearchInput || undefined });
  }, [debouncedSearchInput]);
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
