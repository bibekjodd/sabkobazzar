'use client';

import { extractErrorMessage } from '@/lib/utils';
import { useVerifyAccount } from '@/mutations/use-verify-account';
import { createStore } from '@jodd/snap';
import { Loader2Icon, ShieldCheckIcon } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp';

const useVerifyAccountDialog = createStore<{ isOpen: boolean }>(() => ({ isOpen: false }));
const onOpenChange = (isOpen: boolean) => useVerifyAccountDialog.setState({ isOpen });
export const openVerifyAccountDialog = () => onOpenChange(true);
export const closeVerifyAccountDialog = () => onOpenChange(false);

export default function VerifyAccountDialog() {
  const { isOpen } = useVerifyAccountDialog();
  const [otp, setOtp] = useState('');
  const { mutate, isPending, error } = useVerifyAccount();

  const onOtpInput = (otp: string) => {
    setOtp(otp);
    if (isPending) return;
    if (otp.length === 6)
      mutate(
        { otp },
        {
          onSuccess() {
            closeVerifyAccountDialog();
          }
        }
      );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center">
            <ShieldCheckIcon className="mr-2 size-5" />
            <span>Verify Account</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />

        <section className="flex flex-col items-center space-y-4 py-4">
          <p>Enter the 6 digit otp sent to your mail</p>

          <InputOTP maxLength={6} value={otp} onChange={onOtpInput} disabled={isPending}>
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
                <p>Verifying your account</p>
                <Loader2Icon className="size-4 animate-spin" />
              </div>
            )}

            {error && (
              <p className="text-rose-500">
                Could not verify account! {extractErrorMessage(error)}
              </p>
            )}
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
