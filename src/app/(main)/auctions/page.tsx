'use client';

import { isShallowEqual } from '@/lib/utils';
import { KeyOptions } from '@/queries/use-auctions';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Filter, { useFilters } from './sections/filter';
import FilterSuggestions from './sections/filter-suggestions';
import SearchResult from './sections/result';

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-20 pt-28 md:pt-16">
      <div className="fixed left-0 top-16 -z-10 h-screen w-full bg-gradient-to-b from-indigo-950/10" />
      <div className="fixed bottom-60 left-0 -z-10 size-80 rounded-full bg-indigo-500/10 blur-3xl filter" />
      <div className="fixed right-0 top-16 -z-10 size-60 rounded-full bg-brand-darker/15 blur-3xl filter" />
      <Suspense>
        <BaseComponent />
      </Suspense>
    </main>
  );
}

function BaseComponent() {
  const searchParams = useSearchParams();
  const [isSetInitialSearchParams, setIsSetInitialSearchParams] = useState(false);

  useEffect(() => {
    const currentSearchParams = {
      title: searchParams.get('title') || undefined,
      category: (searchParams.get('category') as KeyOptions['category']) || undefined,
      owner: searchParams.get('owner') || undefined,
      sort: (searchParams.get('sort') as KeyOptions['sort']) || undefined,
      status: (searchParams.get('status') as KeyOptions['status']) || undefined,
      condition: (searchParams.get('condition') as KeyOptions['condition']) || undefined
    } satisfies KeyOptions;

    if (!isSetInitialSearchParams || !isShallowEqual(currentSearchParams, useFilters.getState())) {
      useFilters.setState(currentSearchParams);
      setIsSetInitialSearchParams(true);
    }
  }, [searchParams, isSetInitialSearchParams]);

  if (!isSetInitialSearchParams) return null;

  return (
    <div className="cont">
      <div className="flex gap-x-3 py-4">
        <Filter />
        <FilterSuggestions />
      </div>
      <SearchResult />
    </div>
  );
}
