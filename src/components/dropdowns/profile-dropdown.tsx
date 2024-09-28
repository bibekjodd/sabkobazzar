import { LayoutGrid, LogOut } from 'lucide-react';
import React from 'react';
import LogoutDialog from '../dialogs/logout-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import ProgressButton from '../utils/progress-button';

export default function ProfileDropdown({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Profile</DropdownMenuLabel>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="w-full">
            <ProgressButton href="/dashboard" className="flex items-center">
              <LayoutGrid className="mr-2 size-4" />
              <span>Dashboard</span>
            </ProgressButton>
          </DropdownMenuSubTrigger>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="w-full">
            <LogoutDialog>
              <button className="flex w-full items-center">
                <LogOut className="mr-2 size-4" />
                <span>Logout</span>
              </button>
            </LogoutDialog>
          </DropdownMenuSubTrigger>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
