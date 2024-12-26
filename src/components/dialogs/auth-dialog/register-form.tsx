import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Avatar from '@/components/utils/avatar';
import { RegisterSchema, registerSchema } from '@/lib/form-schemas';
import { cn, imageToDataUri } from '@/lib/utils';
import { useRegister } from '@/mutations/use-register';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  EyeIcon,
  EyeOffIcon,
  LockKeyholeIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  XIcon
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function RegisterForm() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema)
  });
  const [hidePassword, setHidePassword] = useState(true);
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const imagePickerRef = useRef<HTMLInputElement>(null);

  const unPickImage = () => {
    setImageUri(undefined);
    if (imagePickerRef.current) imagePickerRef.current.value = '';
  };

  const onPickImage = async () => {
    const imageFile = imagePickerRef.current?.files && imagePickerRef.current.files[0];
    if (!imageFile) {
      unPickImage();
      return;
    }
    const imageUri = await imageToDataUri(imageFile);
    setImageUri(imageUri);
  };

  const { mutate, isPending } = useRegister();

  const onSubmit = handleSubmit((data) => {
    if (isPending) return;
    const image = imagePickerRef.current?.files && imagePickerRef.current.files[0];
    mutate(
      { ...data, image: image || undefined },
      {
        onSuccess() {
          unPickImage();
          reset();
        }
      }
    );
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col space-y-6">
      <Input
        IconLeft={UserIcon}
        label="Name"
        placeholder="Donald Trump"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        IconLeft={MailIcon}
        label="Email"
        placeholder="xyz@gmail.com"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        IconLeft={PhoneIcon}
        label="Phone"
        placeholder="9812382450"
        {...register('phone')}
        error={errors.phone?.message}
      />
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

      <div className="flex items-center space-x-2">
        <Label htmlFor="image">Display Image</Label>
        <Input
          id="image"
          type="file"
          ref={imagePickerRef}
          onChange={onPickImage}
          className={cn('w-full', { hidden: !!imageUri })}
        />
        {imageUri && (
          <button onClick={unPickImage} type="button" className="relative size-fit rounded-full">
            <div className="absolute right-0 top-0 z-10 size-fit rounded-full bg-foreground text-primary-foreground">
              <XIcon className="size-3" />
            </div>
            <Avatar src={imageUri} />
          </button>
        )}
      </div>

      <Button variant="brand" disabled={isPending} loading={isPending}>
        Register
      </Button>
    </form>
  );
}
