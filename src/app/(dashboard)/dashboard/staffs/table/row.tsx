import UserHoverCard from '@/components/cards/user-hover-card';
import { TableCell, TableRow } from '@/components/ui/table';
import Avatar from '@/components/utils/avatar';
import { useUser } from '@/queries/use-user';
import { BadgeAlertIcon, BadgeCheckIcon, KanbanIcon, MailIcon } from 'lucide-react';
import MoreOptions from './more-options';

export default function Row({ user: initialData }: { user: User }) {
  const { data } = useUser(initialData.id, { initialData });
  const user = data || initialData;
  if (user.role !== 'admin') return null;

  return (
    <TableRow className="text-sm">
      <TableCell>
        <UserHoverCard user={user}>
          <button className="flex items-center space-x-3 hover:underline">
            <Avatar src={user.image} size="sm" />
            <span className="line-clamp-1 whitespace-nowrap">{user.name}</span>
          </button>
        </UserHoverCard>
      </TableCell>

      <TableCell>
        <div className="flex items-center space-x-2">
          <MailIcon className="size-3.5" />
          <span>{user.email}</span>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center space-x-2">
          {user.isVerified && <BadgeCheckIcon className="size-3.5 fill-info text-foreground" />}
          {!user.isVerified && <BadgeAlertIcon className="size-3.5 fill-warning text-foreground" />}
          <span className="whitespace-nowrap">{user.isVerified ? 'Verified' : 'Not verified'}</span>
        </div>
      </TableCell>

      <TableCell>
        <MoreOptions user={user}>
          <button className="flex h-9 items-center space-x-2 disabled:opacity-40">
            <KanbanIcon className="size-3.5" />
            <span className="select-none whitespace-nowrap">More</span>
          </button>
        </MoreOptions>
      </TableCell>
    </TableRow>
  );
}
