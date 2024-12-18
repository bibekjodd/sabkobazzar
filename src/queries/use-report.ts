import { backendUrl } from '@/lib/constants';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
  const res = await axios.get<{ report: DashboardReport }>(
    `${backendUrl}/api/reports/${reportId}`,
    { withCredentials: true, signal }
  );
  return res.data.report;
};
