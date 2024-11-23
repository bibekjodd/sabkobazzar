'use client';

import ManageProductsTable from '@/components/tables/manage-products-table';

export default function Page() {
  return (
    <main className="p-4">
      <ManageProductsTable />
      <div className="fixed left-20 top-40 -z-10 aspect-[2/3] h-40 bg-sky-600/15 blur-3xl filter md:h-60 lg:left-80" />
      <div className="fixed right-10 top-24 -z-10 aspect-[2/1] h-32 -rotate-45 rounded-full bg-purple-500/15 blur-3xl filter md:h-48" />
      <div className="fixed bottom-24 right-10 -z-10 aspect-[2/1] h-32 rotate-45 rounded-full bg-indigo-500/10 blur-3xl filter md:right-40 md:h-48" />
      <div className="fixed inset-0 -z-10 bg-gray-950/10 lg:ml-64" />
    </main>
  );
}
