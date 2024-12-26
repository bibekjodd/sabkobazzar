import { closeRespondReortDialog } from '@/components/dialogs/respond-report-dialog';
import { apiClient } from '@/lib/api-client';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { reportKey } from '@/queries/use-report';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useRespondReport = (reportId: string) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: ['respond-report', reportId],
    mutationFn: async (data: { response: string }) => {
      await apiClient.post(`/api/reports/${reportId}/response`, data, {
        withCredentials: true
      });
    },
    onSuccess(_, { response }) {
      closeRespondReortDialog();
      toast.success('Response sent to user successfully');
      const reportData = queryClient.getQueryData<DashboardReport>(reportKey(reportId));
      if (!reportData) return;
      queryClient.setQueryData<DashboardReport>(reportKey(reportId), { ...reportData, response });
    },
    onError(err) {
      queryClient.invalidateQueries({ queryKey: reportKey(reportId) });
      toast.error(`Could not respond to report! ${extractErrorMessage(err)}`);
    }
  });
};
