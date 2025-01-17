'use client';

import { useFilters } from '@/app/(main)/auctions/sections/filter';
import { useAuctionStore } from '@/stores/use-auction-store';
import { useLoadingBar } from '@jodd/next-top-loading-bar';
import { SearchIcon, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';

export default function SearchAuctions() {
  const pathname = usePathname();
  const isLive = useAuctionStore((state) => state.isLive);
  if (!pathname.startsWith('/auctions') || isLive) return null;

  return (
    <Suspense>
      <BaseComponent />
    </Suspense>
  );
}

function BaseComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('title') || '');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const startRouteTransition = useLoadingBar.getState().start;
    const url = `/auctions${searchInput ? `?title=${searchInput}` : ''}`;
    startRouteTransition(url);
    router.push(url);
    useFilters.setState({ ...useFilters.getInitialState(), title: searchInput || undefined });
  };

  useEffect(() => {
    const currentSearchInput = new URLSearchParams(location.search).get('title');
    setSearchInput(currentSearchInput || '');
  }, []);

  return (
    <form onSubmit={onSubmit} className="relative">
      <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search auctions..."
        className="h-11 w-full rounded-lg border-2 border-foreground/10 pl-9 pr-8 text-base ring-foreground/60 placeholder:text-muted-foreground focus:outline-none focus:ring-2"
      />
      {searchInput && (
        <X
          onClick={() => setSearchInput('')}
          className="absolute right-3 top-1/2 size-4 -translate-y-1/2 cursor-pointer text-muted-foreground"
        />
      )}
    </form>
  );
}
