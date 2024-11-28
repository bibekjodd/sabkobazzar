import LogoutDialog from '@/components/dialogs/logout-dialog';
import ProfileDialog from '@/components/dialogs/profile-dialog';
import RequireLoginDialog from '@/components/dialogs/require-login-dialog';
import UpdateProfileDialog from '@/components/dialogs/update-profile-dialog';
import NotificationsDrawer from '@/components/drawers/notifications-drawer';
import QueryProvider from '@/providers/query-provider';
import { LoadingBar } from '@jodd/next-top-loading-bar';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import React from 'react';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sabkobazzar',
  description: 'Online auction platform'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`antialiased ${GeistSans.className} text-indigo-100`}>
        <QueryProvider>
          {children}

          <LoadingBar waitingTime={200} color="#701a75" />
          <Toaster toastOptions={{ duration: 3000 }} theme="dark" richColors closeButton />

          <ProfileDialog />
          <UpdateProfileDialog />
          <RequireLoginDialog />
          <LogoutDialog />

          <NotificationsDrawer />
        </QueryProvider>
      </body>
    </html>
  );
}
