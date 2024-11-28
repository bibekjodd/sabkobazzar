import AuctionsHistoryChart from '@/components/sections/dashboard/auctions-history-chart';
import RecentActivities from '@/components/sections/dashboard/recent-activities';
import RecentAuctions from '@/components/sections/dashboard/recent-autions';
import RevenueChart from '@/components/sections/dashboard/revenue-chart';
import StatsCards from '@/components/sections/dashboard/stats-cards';

export default function page() {
  return (
    <main className="relative scroll-m-16 p-4" id="analytics">
      <StatsCards />
      <div className="mt-10 flex w-full flex-col items-start gap-x-6 gap-y-16 md:mt-8 2xl:flex-row">
        <AuctionsHistoryChart />
        <RecentAuctions />
      </div>
      <RevenueChart />
      <RecentActivities />
    </main>
  );
}
