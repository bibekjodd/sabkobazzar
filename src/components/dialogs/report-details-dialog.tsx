'use client';

import { getQueryClient } from '@/lib/query-client';
import { auctionKey, fetchAuction } from '@/queries/use-auction';
import { useProfile } from '@/queries/use-profile';
import { useReport } from '@/queries/use-report';
import { createStore } from '@jodd/snap';
import dayjs from 'dayjs';
import {
  ChartNoAxesGanttIcon,
  DotIcon,
  MessageCircleMoreIcon,
  MessageCircleReplyIcon,
  ReplyAllIcon
} from 'lucide-react';
import { useEffect } from 'react';
import UserHoverCard from '../cards/user-hover-card';
import { openAuctionDetailsDrawer } from '../drawers/auction-details-drawer';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import Avatar from '../utils/avatar';
import { openImageDialog } from './image-dialog';
import { openRespondReportDialog } from './respond-report-dialog';

const useReportDetailsDialog = createStore<{ isOpen: boolean; reportId: string | null }>(() => ({
  isOpen: false,
  reportId: null
}));
const onOpenChange = (isOpen: boolean) =>
  useReportDetailsDialog.setState((state) => ({
    isOpen,
    reportId: isOpen ? state.reportId : null
  }));
export const openReportDetailsDialog = (reportId: string) =>
  useReportDetailsDialog.setState({ isOpen: true, reportId });
export const closeReportDetailsDialog = () => onOpenChange(false);

export default function ReportDetailsDialog() {
  const { isOpen, reportId } = useReportDetailsDialog();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center">Report</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />
        {reportId && <Details />}
      </DialogContent>
    </Dialog>
  );
}

function Details() {
  const reportId = useReportDetailsDialog((state) => state.reportId);
  const { data: report } = useReport(reportId!);
  const { data: profile } = useProfile();

  useEffect(() => {
    if (!report) return;
    const queryClient = getQueryClient();

    const timeout = setTimeout(() => {
      if (!queryClient.getQueryData(auctionKey(report.auctionId)))
        queryClient.prefetchQuery({
          queryKey: auctionKey(report.auctionId),
          queryFn: ({ signal }) => fetchAuction({ signal, auctionId: report.auctionId })
        });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [report]);

  if (!report) return null;

  return (
    <>
      <section className="pb-2">
        <div className="mt-2 flex items-start space-x-3">
          <UserHoverCard user={report.user}>
            <Avatar src={report.user.image} />
          </UserHoverCard>
          <div className="-mt-0.5">
            <div className="flex items-center">
              <UserHoverCard user={report.user}>
                <p className="w-fit font-medium hover:underline">{report.user.name}</p>
              </UserHoverCard>
              <DotIcon className="size-4" />
              <p className="inline text-sm text-indigo-100/90">
                {dayjs(report.createdAt).format('ddd, MMM DD, ha')}
              </p>
            </div>
            <p>{report.title}</p>
          </div>
        </div>

        {report.text && (
          <div className="mt-2 rounded-md bg-indigo-900/15 p-3">
            <div className="flex items-center space-x-2">
              <MessageCircleMoreIcon className="size-4" />
              <p>Remarks</p>
            </div>
            <p className="pl-1 text-indigo-100/90"> {report.text}</p>
          </div>
        )}

        {report.response && (
          <div className="mt-2 rounded-md bg-indigo-900/15 p-3">
            <div className="flex items-center space-x-2">
              <ReplyAllIcon className="size-4" />
              <p>Response</p>
            </div>
            <p className="pl-1 text-indigo-100/90"> {report.response}</p>
          </div>
        )}

        {report.images && report.images.length > 0 && (
          <div className="mt-3">
            <p>Reference Images:</p>
            <div className="mt-1 grid grid-cols-3">
              {report.images?.map((image) => (
                <button key={image} onClick={() => openImageDialog(image)}>
                  <img src={image} alt="reference image" className="max-h-20" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <DialogFooter>
        {profile?.role === 'admin' && !report.response && (
          <Button
            variant="outline"
            disabled={!!report?.response}
            onClick={() => openRespondReportDialog(report.id)}
            Icon={MessageCircleReplyIcon}
          >
            Respond
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={() => openAuctionDetailsDrawer(report.auctionId)}
          Icon={ChartNoAxesGanttIcon}
        >
          Auction Details
        </Button>
      </DialogFooter>
    </>
  );
}
