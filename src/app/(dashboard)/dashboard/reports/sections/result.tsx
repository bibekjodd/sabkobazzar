'use client';

import UserHoverCard from '@/components/cards/user-hover-card';
import { openReportDetailsDialog } from '@/components/dialogs/report-details-dialog';
import { openRespondReportDialog } from '@/components/dialogs/respond-report-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import Avatar from '@/components/utils/avatar';
import InfiniteScrollObserver from '@/components/utils/infinite-scroll-observer';
import { MILLIS } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { cn } from '@/lib/utils';
import { useReport } from '@/queries/use-report';
import { useReports } from '@/queries/use-reports';
import { userKey } from '@/queries/use-user';
import dayjs from 'dayjs';
import {
  ChartNoAxesGanttIcon,
  CheckCheckIcon,
  CheckIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  MessageCircleReplyIcon
} from 'lucide-react';
import { useFilters } from './filter';

export default function Result() {
  const filters = useFilters();
  const { isLoading, data: reports, isFetching, fetchNextPage, hasNextPage } = useReports(filters);

  return (
    <div className="mt-3 space-y-2">
      {!isLoading && reports?.length === 0 && (
        <p className="text-sm font-medium text-error">No results found.</p>
      )}
      {isLoading &&
        new Array(3).fill('nothing').map((_, i) => (
          <div
            key={i}
            className="space-y-2 rounded-md border border-indigo-300/10 bg-indigo-900/10 p-4"
          >
            <div className="flex items-center space-x-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="w-full max-w-60">
                <Skeleton className="h-8" />
              </div>
            </div>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}

      {reports?.map((report) => <ReportItem key={report.id} report={report} />)}
      <div className="pt-2">
        <InfiniteScrollObserver
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
}

function ReportItem(props: { report: DashboardReport }) {
  const { data } = useReport(props.report.id);
  const report = data || props.report;
  const filters = useFilters();

  return (
    <section className="relative space-y-1 rounded-md border border-indigo-300/10 bg-indigo-900/5 p-4">
      <UserHoverCard user={report.user}>
        <button className="flex w-fit items-center space-x-2 hover:underline">
          <Avatar src={report.user.image} size="sm" />
          <p className="font-medium">{report.user.name}</p>
        </button>
      </UserHoverCard>

      <h3 className="line-clamp-1 font-medium">{report.title}</h3>
      <p className="line-clamp-2 text-sm">{report.text}</p>
      <p className="text-sm text-muted-foreground">
        <ClockIcon className="mr-1 inline size-3" />
        {report.createdAt > new Date(Date.now() - 24 * MILLIS.HOUR).toISOString()
          ? dayjs(report.createdAt).fromNow()
          : dayjs(report.createdAt).format('MMMM DD')}
      </p>

      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 pt-2 text-sm">
        <button
          disabled={!!report.response}
          onClick={report.response ? undefined : () => openRespondReportDialog(report.id)}
          className={cn('flex items-center space-x-1.5 rounded-md px-3 py-1.5', {
            'bg-success/10 text-success hover:bg-success/20': report.response,
            'bg-info/10 text-info hover:bg-info/20': !report.response
          })}
        >
          <span>{report.response ? 'Already responded' : 'Add reponse'}</span>
          {report.response ? (
            <CheckCheckIcon className="size-4" />
          ) : (
            <MessageCircleReplyIcon className="size-4" />
          )}
        </button>

        <button
          onClick={() => openReportDetailsDialog(report.id)}
          className="flex items-center space-x-1.5 rounded-md bg-brand/10 px-3 py-1.5 text-brand hover:bg-brand/20"
        >
          <span>Details</span>
          <ChartNoAxesGanttIcon className="size-4" />
        </button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute right-2 top-2 p-2 ring-indigo-300/10 focus:outline-none focus:ring-1">
            <EllipsisVerticalIcon className="size-3.5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>View reports from</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex justify-between"
            onClick={() => {
              getQueryClient().setQueryData<User>(userKey(report.userId), { ...report.user });
              useFilters.setState((state) => ({
                user: state.user === report.userId ? undefined : report.userId
              }));
            }}
          >
            <span>Same user</span>
            {filters.user === report.userId && <CheckIcon />}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex justify-between"
            onClick={() =>
              useFilters.setState((state) => ({
                auction: state.auction === report.auctionId ? undefined : report.auctionId
              }))
            }
          >
            <span>Same auction</span>
            {filters.auction === report.auctionId && <CheckIcon />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}
