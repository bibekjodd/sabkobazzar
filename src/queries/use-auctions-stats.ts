import { backendUrl } from '@/lib/constants';
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
  const res = await axios.get<FetchAuctionsStatsResult>(`${backendUrl}/api/stats/auctions`, {
    withCredentials: true,
    signal
  });
  return res.data.stats;
};
