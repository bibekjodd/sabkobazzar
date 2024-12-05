'use client';

import { useProfile } from '@/queries/use-profile';
import { createStore } from '@jodd/snap';
import { LogOutIcon, MailIcon, PhoneIcon, SettingsIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import Avatar from '../utils/avatar';
import { openLogoutDialog } from './logout-dialog';
import { openUpdateProfileDialog } from './update-profile-dialog';

const useProfileDialog = createStore<{
  isOpen: boolean;
}>(() => ({ isOpen: false }));

const onOpenChange = (isOpen: boolean) => useProfileDialog.setState({ isOpen });
export const openProfileDialog = () => onOpenChange(true);
export const closeProfileDialog = () => onOpenChange(false);

export default function ProfileDialog() {
  const { data: profile, isLoading } = useProfile();
  const { isOpen } = useProfileDialog();

  useEffect(() => {
    if (!isLoading && !profile) closeProfileDialog();
  }, [isLoading, profile]);

  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-md text-indigo-100"
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
      >
        <DialogHeader className="sr-only">
          <DialogTitle />
        </DialogHeader>
        <DialogDescription className="sr-only" />

        <section className="[&_svg]:size-4">
          <div className="flex items-center space-x-4">
            <div className="size-fit rounded-full border-2 border-gray-300">
              <Avatar src={profile.image} size="2xl" />
            </div>
            <div>
              <p className="text-lg font-semibold">{profile.name}</p>
              <p className="text-muted-foreground">
                <MailIcon className="mr-2 inline" />
                {profile.email}
              </p>
            </div>
          </div>

          <div className="mb-3 mt-5 border-b border-indigo-200/15" />

          <div className="flex flex-col space-y-2">
            <div className="flex items-center rounded-md px-3 py-1.5 hover:bg-muted/50">
              <PhoneIcon />
              <p className="ml-2 mr-auto">Phone</p>
              <p className="text-sm text-muted-foreground">{profile.phone || 'Not specified'}</p>
            </div>

            <button
              onClick={openUpdateProfileDialog}
              className="flex items-center rounded-md px-3 py-1.5 hover:bg-muted/50"
            >
              <SettingsIcon />
              <p className="ml-2 mr-auto">Update profile</p>
            </button>

            <button
              onClick={openLogoutDialog}
              className="flex items-center rounded-md px-3 py-1.5 hover:bg-muted/50"
            >
              <LogOutIcon />
              <p className="ml-2 mr-auto">Logout</p>
            </button>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
