import { closeReportAuctionDialog } from '@/components/dialogs/report-auction-dialog';
import { apiClient } from '@/lib/api-client';
import { ReportAuctionSchema } from '@/lib/form-schemas';
import { extractErrorMessage, uploadImage } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useReportAuction = (auctionId: string) => {
  return useMutation({
    mutationKey: ['report-auction', auctionId],
    mutationFn: (data: ReportAuctionSchema & { images: File[] | undefined }) =>
      reportAuction({ ...data, auctionId }),
    onError(err) {
      toast.error(`Could not report auction! ${extractErrorMessage(err)}`);
    },
    onSuccess() {
      closeReportAuctionDialog();
      toast.success('Your report has been submitted! Thank you for reporting');
    }
  });
};

type Options = ReportAuctionSchema & { auctionId: string; images: File[] | undefined };
const reportAuction = async ({ auctionId, images, ...data }: Options) => {
  const productImagesPromise: Promise<unknown>[] = [];
  for (const image of images || []) {
    productImagesPromise.push(uploadImage(image));
  }

  const imagesUrls = await Promise.all(productImagesPromise);
  await apiClient.post(
    `/api/reports/${auctionId}`,
    { ...data, images: imagesUrls },
    { withCredentials: true }
  );
};
