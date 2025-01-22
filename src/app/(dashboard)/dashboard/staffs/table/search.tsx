import { Input } from '@/components/ui/input';
import { createStore } from '@jodd/snap';
import { SearchIcon, XIcon } from 'lucide-react';

export const useSearch = createStore<{ q: string | undefined }>(() => ({ q: undefined }));

export default function Search() {
  const { q } = useSearch();

  return (
    <div className="w-full flex-shrink flex-grow">
      <Input
        label="Admins"
        IconLeft={SearchIcon}
        IconRight={q ? XIcon : undefined}
        iconRightAction={() => useSearch.setState({ q: undefined })}
        value={q || ''}
        onChange={(e) => useSearch.setState({ q: e.target.value.trim() || undefined })}
        placeholder="Enter name or email..."
      />
    </div>
  );
}
