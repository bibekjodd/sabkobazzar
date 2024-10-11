'use client';
import { fetchProfile } from '@/queries/use-profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function QueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            retry: false,
            gcTime: 5 * 60 * 1000
          },
          mutations: {
            retry: false,
            gcTime: 5 * 60 * 1000
          }
        }
      })
  );

  queryClient.prefetchQuery({
    queryKey: ['profile'],
    queryFn: ({ signal }) => fetchProfile({ queryClient, signal })
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
