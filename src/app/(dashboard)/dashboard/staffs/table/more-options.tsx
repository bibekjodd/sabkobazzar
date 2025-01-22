import { openRemoveAdminDialog } from '@/components/dialogs/remove-admin-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CircleSlashIcon } from 'lucide-react';
import React from 'react';

export default function MoreOptions({ children, user }: { children: React.ReactNode; user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>More options</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => openRemoveAdminDialog(user)}>
          <CircleSlashIcon />
          <span>Remove admin</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
