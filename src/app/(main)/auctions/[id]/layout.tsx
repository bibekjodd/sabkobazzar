import React from 'react';
import Live from './sections/live';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Live />
    </>
  );
}
