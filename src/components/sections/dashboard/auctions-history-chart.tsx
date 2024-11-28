'use client';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { FadeUp } from '@/components/utils/animations';
import { useAuctionsStats } from '@/queries/use-auctions-stats';
import dayjs from 'dayjs';
import { InfoIcon } from 'lucide-react';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

type ChartData = { month: string; completed: number; cancelled: number }[];
export default function AuctionsHistoryChart() {
  const { data: stats, error } = useAuctionsStats();

  const chartData = useMemo((): ChartData => {
    const date = new Date();

    const data: ChartData = [];
    for (let i = 0; i < 12; i++) {
      const currentDate = new Date(date);
      currentDate.setMonth(currentDate.getMonth() - i);
      const currentStat = stats?.find(
        (stat) => stat.date === currentDate.toISOString().slice(0, 7)
      );
      const chartDataItem: ChartData[number] = {
        month: dayjs(currentDate).format('MMMM'),
        cancelled: currentStat?.cancelled || 0,
        completed: currentStat?.completed || 0
      };
      data.push(chartDataItem);
    }

    return data.reverse();
  }, [stats]);

  const colors = {
    cancelled: '#9333ea',
    completed: '#4f46e5'
  };

  const chartConfig = {
    cancelled: {
      label: 'Cancelled',
      color: colors.cancelled
    },
    completed: {
      label: 'Completed',
      color: colors.completed
    }
  };

  return (
    <FadeUp className="w-full scroll-m-20" id="auctions-history">
      <h3>Auctions history</h3>
      {error && (
        <p className="my-2 text-sm text-indigo-200/80">
          <InfoIcon className="mr-0.5 inline size-3 -translate-y-0.5" /> No data to show
        </p>
      )}
      <ChartContainer config={chartConfig} className="mt-4 h-96 min-h-96 w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="cancelled" fill={colors.cancelled} radius={4} />
          <Bar dataKey="completed" fill={colors.completed} radius={4} />
        </BarChart>
      </ChartContainer>
    </FadeUp>
  );
}
