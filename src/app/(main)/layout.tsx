import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import RealtimeListener from '@/components/utils/realtime-listener';
import React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <RealtimeListener />
      {children}
      <Footer />
    </>
  );
}
