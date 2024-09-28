'use client';
import DashboardHeader from '@/components/layouts/dashboard-header';
import DashboardSidebar from '@/components/layouts/dashboard-sidebar';
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
      <DashboardSidebar />
      <div className="lg:pl-64">{children}</div>
    </>
  );
}
