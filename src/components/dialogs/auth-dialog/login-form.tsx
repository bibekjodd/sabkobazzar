import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoginSchema, loginSchema } from '@/lib/form-schemas';
import { useLogin } from '@/mutations/use-login';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, LockKeyholeIcon, MailIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { openLoginWithOtpDialog } from '../login-with-otp-dialog';

export default function LoginForm() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  });
  const [hidePassword, setHidePassword] = useState(true);
  const { mutate, isPending } = useLogin();

  const onSubmit = handleSubmit((data) => {
    if (isPending) return;
    mutate(data, {
      onSuccess() {
        reset();
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col space-y-6">
      <Input
        IconLeft={MailIcon}
        label="Email"
        placeholder="xyz@gmail.com"
        {...register('email')}
        error={errors.email?.message}
      />
      <div className="flex flex-col space-y-2">
        <Input
          IconLeft={LockKeyholeIcon}
          label="Password"
          type={hidePassword ? 'password' : 'text'}
          placeholder="trump@gmail.com"
          {...register('password')}
          iconRightAction={() => setHidePassword(!hidePassword)}
          IconRight={hidePassword ? EyeOffIcon : EyeIcon}
          error={errors.password?.message}
        />
        <button
          type="button"
          onClick={openLoginWithOtpDialog}
          className="mx-auto w-fit text-purple-500 hover:underline"
        >
          Forgot password?
        </button>
      </div>

      <Button variant="brand" disabled={isPending} loading={isPending}>
        Login
      </Button>
    </form>
  );
}
