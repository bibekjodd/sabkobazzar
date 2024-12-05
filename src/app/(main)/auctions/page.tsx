import Filter from '@/components/sections/auctions/filter';
import SearchResult from '@/components/sections/auctions/search-result';
import { Suspense } from 'react';

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-20 pt-16">
      <div className="fixed left-0 top-16 -z-10 h-screen w-full bg-gradient-to-b from-indigo-950/10" />
      <div className="fixed bottom-60 left-0 -z-10 size-80 rounded-full bg-indigo-500/10 blur-3xl filter" />
      <div className="fixed right-0 top-16 -z-10 size-60 rounded-full bg-violet-500/15 blur-3xl filter" />
      <div className="cont">
        <Suspense>
          <Filter />
          <SearchResult />
        </Suspense>
      </div>
    </main>
  );
}
