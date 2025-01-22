import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Columns() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Verified</TableHead>
        <TableHead />
      </TableRow>
    </TableHeader>
  );
}
