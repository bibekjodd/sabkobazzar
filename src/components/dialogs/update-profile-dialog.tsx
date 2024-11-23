import { updateProfileSchema, UpdateProfileSchema } from '@/lib/form-schemas';
import { imageToDataUri } from '@/lib/utils';
import { useUpdateProfile } from '@/mutations/use-update-profile';
import { useProfile } from '@/queries/use-profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCheckIcon, PhoneIcon, UserIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';
import Avatar from '../utils/avatar';

export default function UpdateProfileDialog({ children }: { children: React.ReactNode }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
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
    mutate(
      { ...data, image: image || undefined },
      {
        onSuccess: () => closeButtonRef.current?.click()
      }
    );
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Update Profile</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only" />

        <form onSubmit={onSubmit} className="flex flex-col space-y-5">
          <Input
            id="name"
            label="Name"
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

            <Avatar src={imageUri} />

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
          <DialogClose asChild ref={closeButtonRef}>
            <Button variant="text">Cancel</Button>
          </DialogClose>
          <Button
            variant="secondary"
            onClick={onSubmit}
            disabled={isPending}
            loading={isPending}
            Icon={CheckCheckIcon}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}