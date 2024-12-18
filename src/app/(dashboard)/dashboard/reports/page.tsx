import RespondReportDialog from '@/components/dialogs/respond-report-dialog';
import Filter from './sections/filter';
import Result from './sections/result';

export default function page() {
  return (
    <>
      <main className="px-4 pb-4">
        <Filter />
        <Result />
      </main>
      <RespondReportDialog />
    </>
  );
}
