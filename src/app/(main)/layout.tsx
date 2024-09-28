import Header from '@/components/layouts/header';
import React, { Suspense } from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      {children}
    </>
  );
}
