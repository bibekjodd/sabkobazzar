import AuthDialog from '@/components/dialogs/auth-dialog';
import ImageDialog from '@/components/dialogs/image-dialog';
import JoinAuctionDialog from '@/components/dialogs/join-auction-dialog';
import LeaveAuctionDialog from '@/components/dialogs/leave-auction.dialog';
import RequestLoginOtpDialog from '@/components/dialogs/login-with-otp-dialog';
import LogoutDialog from '@/components/dialogs/logout-dialog';
import PostFeedbackDialog from '@/components/dialogs/post-feedback-dialog';
import ProfileDialog from '@/components/dialogs/profile-dialog';
import QrCodeDialog from '@/components/dialogs/qr-code-dialog';
import ReportAuctionDialog from '@/components/dialogs/report-auction-dialog';
import UpdatePasswordDialog from '@/components/dialogs/update-password-dialog';
import UpdateProfileDialog from '@/components/dialogs/update-profile-dialog';
import VerifyAccountDialog from '@/components/dialogs/verify-account-dialog';
import AuctionDetailsDrawer from '@/components/drawers/auction-details-drawer';
import NotificationsDrawer from '@/components/drawers/notifications-drawer';
import RealtimeListener from '@/components/utils/realtime-listener';
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

          <PostFeedbackDialog />
          <ReportAuctionDialog />

          <NotificationsDrawer />
          <AuctionDetailsDrawer />
        </QueryProvider>
      </body>
    </html>
  );
}
