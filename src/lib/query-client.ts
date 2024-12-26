import { QueryClient } from '@tanstack/react-query';
import { MILLIS } from './constants';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: false,
        gcTime: 3 * MILLIS.MINUTE,
        refetchIntervalInBackground: false,
        maxPages: 10
      },
      mutations: {
        retry: false,
        gcTime: MILLIS.MINUTE / 2
      }
    }
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient();

  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
