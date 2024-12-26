import { apiClient } from '@/lib/api-client';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export const reportKey = (reportId: string) => ['report', reportId];

export const useReport = (reportId: string, queryOptions?: UseQueryOptions<DashboardReport>) => {
  return useQuery({
    queryKey: reportKey(reportId),
    queryFn: async ({ signal }) => fetchReport({ signal, reportId }),
    ...queryOptions
  });
};

type Options = { reportId: string; signal: AbortSignal };
export const fetchReport = async ({ reportId, signal }: Options) => {
  const res = await apiClient.get<{ report: DashboardReport }>(`/api/reports/${reportId}`, {
    withCredentials: true,
    signal
  });
  return res.data.report;
};
