'use client';

import DashboardBreadcrumbs from '@/components/dashboard-breadcrumbs';
import DashboardMenuDrawer from '@/components/drawers/dashboard-menu-drawer';
import DashboardHeader from '@/components/layouts/dashboard-header';
import DashboardSidebar from '@/components/layouts/dashboard-sidebar';
import SearchDashboard from '@/components/search-dashboard';
import { dashboardLinks } from '@/lib/dashboard-links';
import { useProfile } from '@/queries/use-profile';
import { redirect, usePathname } from 'next/navigation';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: profile, isLoading, error } = useProfile();
  const pathname = usePathname();
  if (error) redirect('/');
  if (!isLoading && !profile) redirect('/');
  if (!profile) return null;

  const currentPage = dashboardLinks.find((link) => link.href === pathname);
  if (currentPage?.allowedRole !== 'any' && profile?.role !== currentPage?.allowedRole)
    redirect('/dashboard');

  return (
    <>
      <DashboardHeader />
      <div className="fixed left-64 top-0 z-50 hidden h-screen w-[1px] bg-gray-400/10 lg:block" />
      <div className="flex">
        <DashboardSidebar />
        <div className="w-full lg:w-[calc(100%-256px)]">
          <div className="my-2 lg:hidden">
            <DashboardBreadcrumbs />
          </div>
          {children}
        </div>
      </div>

      <SearchDashboard />
      <DashboardMenuDrawer />

      <div className="fixed left-20 top-40 -z-10 aspect-[2/3] h-40 bg-blue-600/10 blur-3xl filter md:h-60 lg:left-80 lg:h-80" />
      <div className="fixed right-10 top-24 -z-10 aspect-[2/1] h-32 -rotate-45 rounded-full bg-brand-darker/15 blur-3xl filter md:h-48" />
      <div className="fixed bottom-24 right-10 -z-10 aspect-[2/1] h-32 rotate-45 rounded-full bg-indigo-500/10 blur-3xl filter md:right-40 md:h-48" />
      <div className="fixed -bottom-20 left-10 -z-10 size-32 rotate-45 rounded-full bg-info/[0.07] blur-3xl filter md:size-48 lg:-bottom-40 lg:left-80 lg:size-72" />
      <div className="fixed inset-0 -z-10 bg-gray-950/10 lg:ml-64" />
    </>
  );
}
