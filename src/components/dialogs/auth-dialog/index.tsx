'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { redirectToLogin } from '@/lib/utils';
import { createStore } from '@jodd/snap';
import { openLoginWithOtpDialog } from '../login-with-otp-dialog';
import LoginForm from './login-form';
import RegisterForm from './register-form';

type AuthMode = 'login' | 'register';
const useAuthDialog = createStore<{ isOpen: boolean; mode: AuthMode }>(() => ({
  isOpen: false,
  mode: 'login'
}));
const onOpenChange = (isOpen: boolean, mode?: AuthMode) =>
  useAuthDialog.setState({ isOpen, mode: mode || 'login' });

export const openAuthDialog = (mode?: AuthMode) => onOpenChange(true, mode);
export const closeAuthDialog = () => onOpenChange(false);

export default function AuthDialog() {
  const { isOpen, mode } = useAuthDialog();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-screen flex-col text-sm">
        <DialogHeader>
          <DialogTitle className="text-center">
            {mode === 'login' ? 'Login to Sabkobazzar' : 'Register to Sabkobazzar'}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />

        <ScrollArea className="-mx-3 h-full">
          <section className="flex max-h-[calc(100vh-96px)] flex-col space-y-3 px-3 pt-4">
            {mode === 'login' && <LoginForm />}
            {mode === 'register' && <RegisterForm />}

            <div className="flex items-center space-x-4">
              <div className="h-0.5 flex-grow rounded-full bg-foreground/15" />
              <p>or</p>
              <div className="h-0.5 flex-grow rounded-full bg-foreground/15" />
            </div>

            <div className="flex flex-col space-y-1.5">
              <button
                onClick={() => {
                  closeAuthDialog();
                  redirectToLogin();
                }}
                className="flex h-9 w-full items-center justify-center space-x-1 rounded-md bg-gradient-to-b from-gray-200 to-gray-300/80 font-medium text-primary-foreground hover:brightness-110"
              >
                <img src="/google.png" alt="google icon" className="size-6" />
                <span>Continue with Google</span>
              </button>

              <Button onClick={openLoginWithOtpDialog}>Login with OTP</Button>
            </div>

            <p className="text-center">
              {`${mode === 'login' ? "Don't have an account?" : 'Already have an account?'} `}
              <button
                onClick={() =>
                  useAuthDialog.setState((state) => ({
                    mode: state.mode === 'login' ? 'register' : 'login'
                  }))
                }
                className="font-medium text-brand hover:underline"
              >
                {mode === 'login' ? 'Register' : 'Login'}
              </button>
            </p>
          </section>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
