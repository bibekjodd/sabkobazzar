import { apiClient } from '@/lib/api-client';
import { concatenateSearchParams } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

type KeyOptions = Partial<{
  user: string;
  resource: 'self';
}>;

export const auctionsStatsKey = (options: KeyOptions) => [
  'auctions-stats',
  {
    user: options.user,
    resource: options.resource
  }
];

export const useAuctionsStats = (options: KeyOptions) => {
  return useQuery({
    queryKey: auctionsStatsKey(options),
    queryFn: ({ signal }) => fetchAuctionsStats({ signal, ...options })
  });
};

export type FetchAuctionsStatsResult = {
  stats: {
    cancelled: number;
    completed: number;
    date: string;
    revenue: number;
    interests: number;
  }[];
};

type Options = KeyOptions & {
  signal: AbortSignal;
};

export const fetchAuctionsStats = async ({
  signal,
  ...query
}: Options): Promise<FetchAuctionsStatsResult['stats']> => {
  const res = await apiClient.get<FetchAuctionsStatsResult>(
    concatenateSearchParams('/api/stats/auctions', query),
    {
      withCredentials: true,
      signal
    }
  );
  return res.data.stats;
};
