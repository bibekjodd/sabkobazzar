'use client';
import { useLoadingBar } from '@/hooks/use-loading-bar';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import TopLoadingBar from 'react-top-loading-bar';

export default function LoadingBar() {
  return (
    <Suspense>
      <BaseLoadingBar />
    </Suspense>
  );
}

function BaseLoadingBar() {
  const progress = useLoadingBar((state) => state.progress);
  const finish = useLoadingBar((state) => state.finish);
  const initial = useLoadingBar((state) => state.initial);
  const initialLoaded = useLoadingBar((state) => state.initialLoaded);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (initial) initialLoaded();
    else finish();

    const timeout = setTimeout(() => {
      finish();
    }, 3000);

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [pathname, searchParams, finish, initial, initialLoaded]);

  return <TopLoadingBar progress={progress} waitingTime={200} color="#701a75" />;
}
