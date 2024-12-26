'use client';

import { updateProfileSchema, UpdateProfileSchema } from '@/lib/form-schemas';
import { imageToDataUri } from '@/lib/utils';
import { useUpdateProfile } from '@/mutations/use-update-profile';
import { useProfile } from '@/queries/use-profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStore } from '@jodd/snap';
import { CheckCheckIcon, PhoneIcon, UserIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Input } from '../ui/input';
import Avatar from '../utils/avatar';

const useUpdateProfileDialog = createStore<{
  isOpen: boolean;
}>(() => ({ isOpen: false }));

const onOpenChange = (isOpen: boolean) => useUpdateProfileDialog.setState({ isOpen });

export const openUpdateProfileDialog = () => onOpenChange(true);
export const closeUpdateProfileDialog = () => onOpenChange(false);

export default function UpdateProfileDialog() {
  const { data: profile } = useProfile();
  if (!profile) return null;
  return <BaseDialog />;
}

function BaseDialog() {
  const { isOpen } = useUpdateProfileDialog();
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { data: profile } = useProfile();
  const { isPending, mutate } = useUpdateProfile();

  const {
    handleSubmit,
    formState: { errors },
    register
  } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: profile?.name,
      phone: Number(profile?.phone) || undefined
    }
  });

  const unpickImage = () => {
    setImageUri(null);
    if (!imagePickerRef.current) return;
    imagePickerRef.current.value = '';
  };

  const pickImage = () => {
    if (!imagePickerRef.current || !imagePickerRef.current.files) return;
    const imageFile = imagePickerRef.current.files[0];
    imageToDataUri(imageFile).then(setImageUri).catch(unpickImage);
  };

  const onSubmit = handleSubmit((data) => {
    if (isPending) return;
    const image = imagePickerRef.current?.files && imagePickerRef.current.files[0];
    mutate({ ...data, image: image || undefined });
  });
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Update Profile</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only" />
        <form onSubmit={onSubmit} className="flex flex-col space-y-6 py-4">
          <Input
            id="name"
            label="Display Name"
            IconLeft={UserIcon}
            error={errors.name?.message}
            placeholder="Enter your name..."
            {...register('name')}
          />

          <Input
            id="phone"
            label="Phone"
            IconLeft={PhoneIcon}
            error={errors.phone?.message}
            placeholder="Enter your phone number..."
            {...register('phone')}
          />

          <input
            className="sr-only"
            type="file"
            ref={imagePickerRef}
            accept="image/*"
            onChange={pickImage}
          />

          <div
            onClick={() => imagePickerRef.current?.click()}
            className="flex w-fit items-center space-x-3 px-1 text-sm font-medium leading-none"
          >
            <span>Display Picture</span>

            <Avatar src={imageUri || profile?.image} />

            <input
              type="file"
              hidden
              id="image"
              accept="image/*"
              className="hidden"
              ref={imagePickerRef}
              onChange={pickImage}
            />
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={isPending} loading={isPending} Icon={CheckCheckIcon}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
