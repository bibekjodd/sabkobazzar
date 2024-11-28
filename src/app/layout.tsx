import RequireLoginDialog from '@/components/dialogs/require-login-dialog';
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
          <RequireLoginDialog />
          <LoadingBar waitingTime={200} color="#701a75" />
          <Toaster toastOptions={{ duration: 3000 }} theme="dark" richColors closeButton />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
