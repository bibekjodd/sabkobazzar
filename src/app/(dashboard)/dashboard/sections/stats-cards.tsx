'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { FadeUp } from '@/components/utils/animations';
import { formatPrice } from '@/lib/utils';
import { FetchAuctionsStatsResult, useAuctionsStats } from '@/queries/use-auctions-stats';
import { useProfile } from '@/queries/use-profile';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { useMemo } from 'react';

export default function StatsCards() {
  const { data: profile } = useProfile();
  const { isLoading, data: stats } = useAuctionsStats({
    resource: profile?.role === 'user' ? 'self' : undefined
  });

  return (
    <div>
      <FadeUp className="grid gap-x-4 gap-y-2 md:grid-cols-2 xl:grid-cols-3">
        {isLoading && (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="col-span-2 h-32 xl:col-span-1" />
          </>
        )}
        {stats && (
          <>
            <RevenueCard stats={stats} />
            <AuctionStatsCard stats={stats} />
            <ProductInterestsCard stats={stats} />
          </>
        )}
      </FadeUp>
    </div>
  );
}

function RevenueCard({ stats }: FetchAuctionsStatsResult) {
  const { revenueCurrentMonth, revenueLastMonth } = useMemo(() => {
    const currentMonthDate = new Date();
    const lastMonthDate = new Date(currentMonthDate);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    const revenueLastMonth =
      stats.find((stat) => stat.date === lastMonthDate.toISOString().slice(0, 7))?.revenue || 0;

    const revenueCurrentMonth =
      stats.find((stat) => stat.date === currentMonthDate.toISOString().slice(0, 7))?.revenue || 0;

    const totalRevenue = stats.reduce((prev, curr) => prev + curr.revenue, 0);
    return { revenueCurrentMonth, revenueLastMonth, totalRevenue };
  }, [stats]);

  const increment = revenueCurrentMonth - revenueLastMonth;
  const incrementPercentage = ((increment * 100) / revenueLastMonth).toFixed(0);

  return (
    <section className="rounded-lg bg-indigo-900/10 p-6 shadow-2xl">
      <div className="flex items-end justify-between">
        <h3 className="text-sm">Total Revenue</h3>
        {increment > 0 && <TrendingUpIcon className="size-5" />}
        {increment < 0 && <TrendingDownIcon className="size-5" />}
      </div>
      <p className="mt-2 text-2xl font-semibold">{formatPrice(revenueCurrentMonth)}</p>
      {increment === 0 ? (
        <p className="mt-1 text-xs text-muted-foreground">No changes compared to past month</p>
      ) : (
        <p className="mt-1 text-xs text-muted-foreground">
          {increment > 0 && '+'}
          {Number(incrementPercentage) === Infinity
            ? formatPrice(increment, false)
            : `${incrementPercentage}%`}{' '}
          compared to past month
        </p>
      )}
    </section>
  );
}

function AuctionStatsCard({ stats }: FetchAuctionsStatsResult) {
  const { totalAuctions, totalAuctionsCurrentMonth, totalAuctionsLastMonth } = useMemo(() => {
    const currentMonthDate = new Date();
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    const lastMonthStats = stats.find(
      (stat) => stat.date === lastMonthDate.toISOString().slice(0, 7)
    ) || { cancelled: 0, completed: 0, date: '', revenue: 0 };

    const currentMonthStats = stats.find(
      (stat) => stat.date === currentMonthDate.toISOString().slice(0, 7)
    ) || { cancelled: 0, completed: 0, date: '', revenue: 0 };

    const totalAuctions = stats.reduce((prev, curr) => {
      return prev + curr.cancelled + curr.completed;
    }, 0);

    const totalAuctionsLastMonth = lastMonthStats.cancelled + lastMonthStats.completed;
    const totalAuctionsCurrentMonth = currentMonthStats.cancelled + currentMonthStats.completed;

    return {
      totalAuctions,
      totalAuctionsLastMonth,
      totalAuctionsCurrentMonth
    };
  }, [stats]);

  return (
    <section className="rounded-lg bg-indigo-900/10 p-6">
      <h3 className="text-sm">Auctions</h3>
      <div className="mt-2">
        <p className="text-2xl font-semibold">
          {totalAuctionsCurrentMonth || totalAuctionsLastMonth || totalAuctions}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {totalAuctionsCurrentMonth !== 0 && <span>Auctions carried this month</span>}
          {totalAuctionsCurrentMonth === 0 && totalAuctionsLastMonth !== 0 && (
            <span>Auctions carried last month</span>
          )}
          {totalAuctionsCurrentMonth === 0 && totalAuctionsLastMonth === 0 && (
            <span>Auctions carried from past one year</span>
          )}
        </p>
      </div>
    </section>
  );
}

function ProductInterestsCard({ stats }: FetchAuctionsStatsResult) {
  const { currentMonthInterests, lastMonthInterests, totalInterests } = useMemo(() => {
    const currentMonthDate = new Date();
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    const currentMonthInterests =
      stats.find((stat) => stat.date === currentMonthDate.toISOString().slice(0, 6))?.interests ||
      0;

    const lastMonthInterests =
      stats.find((stat) => stat.date === lastMonthDate.toISOString().slice(0, 6))?.interests || 0;

    const totalInterests = stats.reduce((prev, curr) => {
      return prev + curr.interests;
    }, 0);
    return { currentMonthInterests, lastMonthInterests, totalInterests };
  }, [stats]);

  return (
    <section className="col-span-2 rounded-lg bg-indigo-900/10 p-6 xl:col-span-1">
      <h3 className="text-sm">Visitors Interests</h3>
      <div className="mt-2">
        <p className="text-2xl font-semibold">
          {currentMonthInterests || lastMonthInterests || totalInterests}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {currentMonthInterests !== 0 && 'visitors shown interests to auctions this month'}
          {currentMonthInterests === 0 &&
            lastMonthInterests !== 0 &&
            'visitors shown interests to auctions last month'}
          {currentMonthInterests === 0 &&
            lastMonthInterests === 0 &&
            'visitors shown interests to auctions last year'}
        </p>
      </div>
    </section>
  );
}
