import PostFeedbackDialog from '@/components/dialogs/post-feedback-dialog';
import ReportAuctionDialog from '@/components/dialogs/report-auction-dialog';
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />

      <PostFeedbackDialog />
      <ReportAuctionDialog />
    </>
  );
}
