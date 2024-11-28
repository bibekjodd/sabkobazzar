'use client';

import DashboardBreadcrumbs from '@/components/dashboard-breadcrumbs';
import SelectAuctionProductDialog from '@/components/dialogs/select-auction-product-dialog';
import DashboardMenuDrawer from '@/components/drawers/dashboard-menu-drawer';
import DashboardHeader from '@/components/layouts/dashboard-header';
import DashboardSidebar from '@/components/layouts/dashboard-sidebar';
import SearchDashboard from '@/components/search-dashboard';
import { useProfile } from '@/queries/use-profile';
import { redirect } from 'next/navigation';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: profile, isLoading, error } = useProfile();
  if (error) redirect('/');
  if (!isLoading && !profile) redirect('/');
  if (!profile) return;

  return (
    <>
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <div className="fixed left-64 top-0 z-50 hidden h-screen w-[1px] bg-gray-400/10 lg:block" />
        <div className="w-full">
          <div className="my-2 lg:hidden">
            <DashboardBreadcrumbs />
          </div>
          {children}
        </div>
      </div>

      <SearchDashboard />
      <DashboardMenuDrawer />
      <SelectAuctionProductDialog />
    </>
  );
}
