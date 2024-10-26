'use client';
import { getQueryClient } from '@/lib/query-client';
import { fetchProfile } from '@/queries/use-profile';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function QueryProvider({ children }: Props) {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
