import QueryProvider from '@/providers/query-provider';
import LoadingBar from '@/components/utils/loading-bar';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sabkobazzar',
  description: 'Online auction platform'
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${inter.className}`}>
        <QueryProvider>
          <LoadingBar />
          <Toaster toastOptions={{ duration: 3000 }} theme="dark" richColors closeButton />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
