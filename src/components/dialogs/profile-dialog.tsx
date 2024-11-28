'use client';

import { cn } from '@/lib/utils';
import { useProfile } from '@/queries/use-profile';
import { createStore } from '@jodd/snap';
import { MailIcon, PhoneIcon } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import Avatar from '../utils/avatar';
import { openUpdateProfileDialog } from './update-profile-dialog';

const useProfileDialog = createStore<{
  isOpen: boolean;
}>(() => ({ isOpen: false }));

const onOpenChange = (isOpen: boolean) => useProfileDialog.setState({ isOpen });
export const openProfileDialog = () => onOpenChange(true);
export const closeProfileDialog = () => onOpenChange(false);

export default function ProfileDialog() {
  const { data: profile } = useProfile();
  const { isOpen } = useProfileDialog();

  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="text-indigo-100"
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Avatar src={profile.image} alt="profile image" />
            <span className="mx-auto">Your profile</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only" />

        <section>
          <h4 className="text-lg font-medium">{profile.name}</h4>
          <div className="mt-1 flex items-center space-x-2">
            <MailIcon className="size-4" />
            <p>{profile.email}</p>
          </div>
          <div className="mt-1 flex items-center space-x-2">
            <PhoneIcon className="size-4" />
            <p className={cn({ 'italic text-indigo-200/80': !profile.phone })}>
              {profile.phone || 'Not specified'}
            </p>
          </div>
        </section>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="text">Close</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button onClick={openUpdateProfileDialog} variant="secondary">
              Update Profile
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
