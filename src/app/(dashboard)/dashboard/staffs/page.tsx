import AddAdminDialog from '@/components/dialogs/add-admin-dialog';
import ConfirmAddAdminDialog from '@/components/dialogs/confirm-add-admin-dialog';
import RemoveAdminDialog from '@/components/dialogs/remove-admin-dialog';
import ManageStaffsTable from './table';

export default function page() {
  return (
    <>
      <main className="p-4">
        <ManageStaffsTable />
      </main>
      <AddAdminDialog />
      <ConfirmAddAdminDialog />
      <RemoveAdminDialog />
    </>
  );
}
