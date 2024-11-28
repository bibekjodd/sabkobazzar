import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const productsStatsKey = ['products-stats'];

export const useProductsStats = () => {
  return useQuery({
    queryKey: productsStatsKey,
    queryFn: fetchProductsStats
  });
};

type FetchProductsStatsResult = {
  stats: { count: number; date: string }[];
};

export const fetchProductsStats = async ({
  signal
}: {
  signal: AbortSignal;
}): Promise<FetchProductsStatsResult['stats']> => {
  try {
    const res = await axios.get<FetchProductsStatsResult>(`${backendUrl}/api/stats/products`, {
      signal,
      withCredentials: true
    });
    return res.data.stats;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
