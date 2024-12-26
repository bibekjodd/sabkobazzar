'use client';

import { UpdatePasswordSchema, updatePasswordSchema } from '@/lib/form-schemas';
import { useUpdatePassword } from '@/mutations/use-update-password';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStore } from '@jodd/snap';
import { EyeIcon, EyeOffIcon, LockKeyholeIcon } from 'lucide-react';
import { useState } from 'react';
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

const useUpdatePasswordDialog = createStore<{ isOpen: boolean }>(() => ({ isOpen: false }));
const onOpenChange = (isOpen: boolean) => useUpdatePasswordDialog.setState({ isOpen });
export const openUpdatePasswordDialog = () => onOpenChange(true);
export const closeUpdatePasswordDialog = () => onOpenChange(false);

export default function UpdatePasswordDialog() {
  const { isOpen } = useUpdatePasswordDialog();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema)
  });

  const { mutate, isPending } = useUpdatePassword();

  const onSubmit = handleSubmit((data) => {
    if (isPending) return;

    mutate(data, {
      onSuccess() {
        reset();
      }
    });
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Update password</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />

        <section className="py-4">
          <form onSubmit={onSubmit} className="flex flex-col space-y-5">
            <Input
              IconLeft={LockKeyholeIcon}
              {...register('password')}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              IconRight={showPassword ? EyeIcon : EyeOffIcon}
              iconRightAction={() => setShowPassword(!showPassword)}
              error={errors.password?.message}
            />
            <Input
              IconLeft={LockKeyholeIcon}
              {...register('confirmPassword')}
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              IconRight={showConfirmPassword ? EyeIcon : EyeOffIcon}
              iconRightAction={() => setShowConfirmPassword(!showConfirmPassword)}
              error={errors.confirmPassword?.message}
            />
          </form>
        </section>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onSubmit} loading={isPending} disabled={isPending}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
