import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

type Props = {
  isFetching: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => unknown;
  className?: string;
  showLoader?: boolean;
};
export default function InfiniteScrollObserver({
  fetchNextPage,
  hasNextPage,
  isFetching,
  className,
  showLoader
}: Props) {
  const observerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const targetElement = observerRef.current;
    if (!targetElement) return;

    if (!hasNextPage || isFetching) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.at(0)?.isIntersecting) {
        fetchNextPage();
      }
    });
    observer.observe(targetElement);

    return () => {
      observer.unobserve(targetElement);
    };
  }, [fetchNextPage, hasNextPage, isFetching]);

  return (
    <>
      <span ref={observerRef} />
      {isFetching && hasNextPage && showLoader && (
        <div className="grid w-full place-items-center">
          <Loader2 className={cn('size-4 animate-spin', className)} />
        </div>
      )}
    </>
  );
}
