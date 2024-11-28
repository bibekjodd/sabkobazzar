import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const auctionsStatsKey = ['auctions-stats'];

export const useAuctionsStats = () => {
  return useQuery({
    queryKey: auctionsStatsKey,
    queryFn: fetchAuctionsStats
  });
};

type FetchAuctionsStatsResult = {
  stats: {
    cancelled: number;
    completed: number;
    date: string;
    revenue: number;
  }[];
};

export const fetchAuctionsStats = async ({
  signal
}: {
  signal: AbortSignal;
}): Promise<FetchAuctionsStatsResult['stats']> => {
  try {
    const res = await axios.get<FetchAuctionsStatsResult>(`${backendUrl}/api/stats/auctions`, {
      withCredentials: true,
      signal
    });
    return res.data.stats;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
