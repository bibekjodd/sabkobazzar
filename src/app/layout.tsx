import QueryProvider from '@/providers/query-provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import { Toaster } from 'sonner';
import './globals.css';
import { LoadingBar } from '@jodd/next-top-loading-bar';

export const metadata: Metadata = {
  title: 'Sabkobazzar',
  description: 'Online auction platform'
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`antialiased ${inter.className}`}>
        <QueryProvider>
          <LoadingBar waitingTime={200} color="#701a75" />
          <Toaster toastOptions={{ duration: 3000 }} theme="dark" richColors closeButton />
          {modal}
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
