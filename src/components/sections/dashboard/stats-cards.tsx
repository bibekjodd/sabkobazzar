'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { FadeUp } from '@/components/utils/animations';
import { formatPrice } from '@/lib/utils';
import { useAuctionsStats } from '@/queries/use-auctions-stats';
import { useProductsStats } from '@/queries/use-products-stats';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { useMemo } from 'react';

export default function StatsCards() {
  return (
    <div className="grid gap-x-4 gap-y-2 md:grid-cols-2 xl:grid-cols-3">
      <RevenueCard />
      <AuctionStatsCard />
      <ProductInterestsCard />
    </div>
  );
}

function RevenueCard() {
  const { data: stats, isLoading } = useAuctionsStats();

  const { revenueCurrentMonth, revenueLastMonth } = useMemo(() => {
    if (!stats) return { revenueCurrentMonth: 0, revenueLastMonth: 0, totalRevenue: 0 };

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
    <FadeUp>
      {isLoading && <Skeleton className="h-32" />}
      {!isLoading && (
        <section className="rounded-lg bg-indigo-900/10 p-6 shadow-2xl">
          <div className="flex items-end justify-between">
            <h3 className="text-sm">Total Revenue</h3>
            {increment > 0 && <TrendingUpIcon className="size-5" />}
            {increment < 0 && <TrendingDownIcon className="size-5" />}
          </div>
          <p className="mt-2 text-2xl font-semibold">{formatPrice(revenueCurrentMonth)}</p>
          {increment === 0 ? (
            <p className="mt-1 text-xs text-indigo-200/80">No changes compared to past month</p>
          ) : (
            <p className="mt-1 text-xs text-indigo-200/80">
              {increment > 0 && '+'}
              {Number(incrementPercentage) === Infinity
                ? formatPrice(increment, false)
                : `${incrementPercentage}%`}{' '}
              compared to past month
            </p>
          )}
        </section>
      )}
    </FadeUp>
  );
}

function AuctionStatsCard() {
  const { data: stats, isLoading } = useAuctionsStats();

  const { totalAuctions, totalAuctionsCurrentMonth, totalAuctionsLastMonth } = useMemo(() => {
    if (!stats)
      return { totalAuctions: 0, totalAuctionsCurrentMonth: 0, totalAuctionsLastMonth: 0 };

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
    <FadeUp>
      {isLoading && <Skeleton className="h-32" />}
      {!isLoading && (
        <section className="rounded-lg bg-indigo-900/10 p-6">
          <h3 className="text-sm">Auctions</h3>
          <div className="mt-2">
            <p className="text-2xl font-semibold">
              {totalAuctionsCurrentMonth || totalAuctionsLastMonth || totalAuctions}
            </p>
            <p className="mt-1 text-xs text-indigo-200/80">
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
      )}
    </FadeUp>
  );
}

function ProductInterestsCard() {
  const { data: stats, isLoading } = useProductsStats();

  const { currentMonthInterests, totalInterests } = useMemo(() => {
    if (!stats) return { currentMonthInterests: 0, totalInterests: 0 };
    const totalInterests = stats.reduce((prev, curr) => prev + curr.count, 0);
    const currentMonthInterests =
      stats.find((stat) => stat.date === new Date().toISOString().slice(0, 7))?.count || 0;
    return { totalInterests, currentMonthInterests };
  }, [stats]);

  return (
    <FadeUp className="md:col-span-2 xl:col-span-1">
      {isLoading && <Skeleton className="h-32" />}
      <section className="rounded-lg bg-indigo-900/10 p-6">
        <h3 className="text-sm">Visitor Interests</h3>
        <div className="mt-2">
          <p className="text-2xl font-semibold">{currentMonthInterests || totalInterests}</p>
          <p className="mt-1 text-xs text-indigo-200/80">
            {currentMonthInterests !== 0 && 'Visitors showed interest on your products this month'}
            {currentMonthInterests === 0 &&
              'Visitors showed interest on your products from past year'}
          </p>
        </div>
      </section>
    </FadeUp>
  );
}
