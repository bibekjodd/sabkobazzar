import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Manage Staffs - Sabkobazzar'
};

export default function layout({ children }: { children: React.ReactNode }) {
  return children;
}
