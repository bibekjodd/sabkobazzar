import AuthDialog from '@/components/dialogs/auth-dialog';
import ImageDialog from '@/components/dialogs/image-dialog';
import JoinAuctionDialog from '@/components/dialogs/join-auction-dialog';
import LeaveAuctionDialog from '@/components/dialogs/leave-auction.dialog';
import RequestLoginOtpDialog from '@/components/dialogs/login-with-otp-dialog';
import LogoutDialog from '@/components/dialogs/logout-dialog';
import ProfileDialog from '@/components/dialogs/profile-dialog';
import QrCodeDialog from '@/components/dialogs/qr-code-dialog';
import ReportDetailsDialog from '@/components/dialogs/report-details-dialog';
import UpdatePasswordDialog from '@/components/dialogs/update-password-dialog';
import UpdateProfileDialog from '@/components/dialogs/update-profile-dialog';
import VerifyAccountDialog from '@/components/dialogs/verify-account-dialog';
import AuctionDetailsDrawer from '@/components/drawers/auction-details-drawer';
import NotificationsDrawer from '@/components/drawers/notifications-drawer';
import RealtimeListener from '@/components/utils/realtime-listener';
import QueryProvider from '@/providers/query-provider';
import { LoadingBar } from '@jodd/next-top-loading-bar';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import React from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const geist = Geist({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '900'] });

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
      <body className={`antialiased ${geist.className}`}>
        <QueryProvider>
          {children}

          <LoadingBar waitingTime={200} color="#701a75" />
          <Toaster toastOptions={{ duration: 3000 }} theme="dark" richColors closeButton />

          <RealtimeListener />

          <ProfileDialog />
          <UpdateProfileDialog />
          <AuthDialog />
          <VerifyAccountDialog />
          <LogoutDialog />
          <RequestLoginOtpDialog />
          <UpdatePasswordDialog />

          <JoinAuctionDialog />
          <LeaveAuctionDialog />

          <QrCodeDialog />
          <ImageDialog />

          <ReportDetailsDialog />

          <NotificationsDrawer />
          <AuctionDetailsDrawer />
        </QueryProvider>
      </body>
    </html>
  );
}
