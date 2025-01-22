import CancelAuctionDialog from '@/components/dialogs/cancel-auction-dialog';
import ManageAuctionsTable from './table';
import InviteUsers from './table/invite-users';

export default function page() {
  return (
    <>
      <main className="p-4">
        <ManageAuctionsTable />
      </main>
      <InviteUsers />
      <CancelAuctionDialog />
    </>
  );
}
