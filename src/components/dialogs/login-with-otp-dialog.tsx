'use client';

import { RequestLoginOtpSchema, requestLoginOtpSchema } from '@/lib/form-schemas';
import { extractErrorMessage } from '@/lib/utils';
import { useLoginWithOtp } from '@/mutations/use-login-with-otp';
import { useRequestLoginOtp } from '@/mutations/use-request-login-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStore } from '@jodd/snap';
import { Loader2Icon, MailIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { Input } from '../ui/input';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp';
import { closeAuthDialog } from './auth-dialog';

const useRequestLoginOtpDialog = createStore<{ isOpen: boolean }>(() => ({ isOpen: false }));
const onOpenChange = (isOpen: boolean) => useRequestLoginOtpDialog.setState({ isOpen });
export const openLoginWithOtpDialog = () => onOpenChange(true);
export const closeLoginWithOtpDialog = () => onOpenChange(false);

export default function RequestLoginOtpDialog() {
  const { isOpen } = useRequestLoginOtpDialog();
  const [email, setEmail] = useState('');

  const {
    mutate: requestLoginOtp,
    isPending,
    isSuccess,
    reset: clearMutationCache
  } = useRequestLoginOtp();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<RequestLoginOtpSchema>({ resolver: zodResolver(requestLoginOtpSchema) });

  const onSubmit = handleSubmit((data) => {
    if (isPending) return;
    requestLoginOtp(data, {
      onSuccess() {
        setEmail(data.email);
        reset();
      }
    });
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Login with Otp</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />

        <section className="pt-4">
          {!isSuccess && (
            <>
              <p className="mb-2 text-sm text-indigo-200/90">
                Enter your email to receive password reset OTP
              </p>
              <form onSubmit={onSubmit}>
                <Input
                  id="email"
                  IconLeft={MailIcon}
                  {...register('email')}
                  placeholder="xyz@gmail.com"
                  error={errors.email?.message}
                />
              </form>
            </>
          )}

          {isSuccess && <LoginWithOtp email={email} clearMutationCache={clearMutationCache} />}
        </section>

        {!isSuccess && (
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={onSubmit}
              loading={isPending}
              disabled={isPending}
              className="w-full"
            >
              Request OTP
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

function LoginWithOtp({
  email,
  clearMutationCache
}: {
  email: string;
  clearMutationCache: () => unknown;
}) {
  const [otp, setOtp] = useState('');
  const { mutate, isPending, error } = useLoginWithOtp();

  const onOtpInput = (otp: string) => {
    if (isPending) return;
    setOtp(otp);
    if (otp.length !== 6) return;
    mutate(
      { email, otp },
      {
        onSuccess() {
          closeLoginWithOtpDialog();
          closeAuthDialog();
          clearMutationCache();
        }
      }
    );
  };

  return (
    <section className="flex flex-col items-center">
      <p className="mb-2 text-center text-sm text-indigo-200/90">
        Enter the 6 digit otp sent to {email}
      </p>

      <InputOTP maxLength={6} value={otp} onChange={onOtpInput} disabled={isPending} autoFocus>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <div className="pt-2 text-sm font-medium">
        {isPending && (
          <div className="flex items-center space-x-2">
            <p>Logging in...</p>
            <Loader2Icon className="size-4 animate-spin" />
          </div>
        )}

        {error && (
          <p className="text-rose-500">Could not login with otp! {extractErrorMessage(error)}</p>
        )}
      </div>
    </section>
  );
}
