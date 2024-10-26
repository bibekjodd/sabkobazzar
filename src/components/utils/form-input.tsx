import { cn } from '@/lib/utils';
import { AutoAnimate } from '@jodd/auto-animate';
import { LucideIcon } from 'lucide-react';
import { InputHTMLAttributes, forwardRef } from 'react';
import { Label } from '../ui/label';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  Icon: LucideIcon | null;
  error: string | undefined;
  IconRight?: LucideIcon;
  IconRightOnClick?: () => void;
};

export const FormInput = forwardRef<HTMLInputElement, Props>(function Component(
  { Icon, label, error, className, IconRight, IconRightOnClick, ...props },
  ref
) {
  return (
    <AutoAnimate className={cn(className, 'space-y-1')}>
      <Label htmlFor={props.id}>{label}</Label>
      <div className="group flex h-10 items-center space-x-3 rounded-md border-2 border-gray-700 border-input px-3 py-1 text-sm focus-within:ring-2 focus-within:ring-ring">
        {Icon && <Icon className="size-4 text-gray-900" />}
        <input
          {...props}
          ref={ref}
          className="flex-1 outline-none placeholder:text-gray-500 placeholder:text-muted-foreground focus:outline-none"
        />
        {IconRight && (
          <button onClick={IconRightOnClick} type="button">
            <IconRight className="size-4 text-gray-500" />
          </button>
        )}
      </div>
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </AutoAnimate>
  );
});
