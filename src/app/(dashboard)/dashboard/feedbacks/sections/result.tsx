'use client';

import UserHoverCard from '@/components/cards/user-hover-card';
import { Skeleton } from '@/components/ui/skeleton';
import Avatar from '@/components/utils/avatar';
import InfiniteScrollObserver from '@/components/utils/infinite-scroll-observer';
import { useFeedbacks } from '@/queries/use-feedbacks';
import dayjs from 'dayjs';
import { StarIcon } from 'lucide-react';
import { useFilters } from './filter';

export default function Result() {
  const filters = useFilters();
  const {
    data: feedbacks,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching
  } = useFeedbacks(filters);

  return (
    <div className="mt-3 space-y-2">
      {!isLoading && feedbacks?.length === 0 && (
        <p className="text-sm font-medium text-error">No results found.</p>
      )}
      {isLoading &&
        new Array(6).fill('nothing').map((_, i) => (
          <div
            key={i}
            className="space-y-2 rounded-md border border-indigo-300/10 bg-indigo-900/10 p-4"
          >
            <div className="flex items-center space-x-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="w-full max-w-60">
                <Skeleton className="h-9" />
              </div>
            </div>
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}

      {feedbacks?.map((feedback) => (
        <section
          key={feedback.id}
          className="rounded-md border border-indigo-300/10 bg-indigo-900/5 p-4"
        >
          <div className="flex items-center space-x-3">
            <UserHoverCard user={feedback.user}>
              <button>
                <Avatar src={feedback.user.image} />
              </button>
            </UserHoverCard>
            <div className="flex flex-col -space-y-1">
              <UserHoverCard user={feedback.user}>
                <button className="font-semibold hover:underline">{feedback.user.name}</button>
              </UserHoverCard>
              <div>
                {new Array(Math.round(feedback.rating)).fill('nothing').map((val, i) => (
                  <StarIcon key={i} className="inline size-3.5 fill-amber-500 text-amber-500" />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-1">
            <h3 className="font-medium">{feedback.title}</h3>
            <p className="text-muted-foreground">{feedback.text}</p>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            {dayjs(feedback.createdAt).fromNow()}
          </p>
        </section>
      ))}

      <InfiniteScrollObserver
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetching={isFetching}
        className="mt-2"
      />
    </div>
  );
}
