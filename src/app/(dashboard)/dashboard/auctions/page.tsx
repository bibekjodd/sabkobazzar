import CancelAuctionDialog from '@/components/dialogs/cancel-auction-dialog';
import ManageAuctionDialog from '@/components/dialogs/manage-auction-dialog';
import ManageAuctionsTable from './table';

export default function page() {
  return (
    <>
      <main className="p-4">
        <ManageAuctionsTable />
      </main>
      <ManageAuctionDialog />
      <CancelAuctionDialog />
    </>
  );
}
