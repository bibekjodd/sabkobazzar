import { cn } from '@/lib/utils';
import { AutoAnimate } from '@jodd/auto-animate';
import { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { Label } from './label';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  IconLeft?: LucideIcon;
  IconRight?: LucideIcon;
  iconRightAction?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => unknown;
  error?: string;
  label?: string;
  parentClassName?: string;
  info?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      IconLeft,
      IconRight,
      iconRightAction,
      parentClassName,
      id,
      label,
      error,
      type,
      info,
      ...props
    },
    ref
  ) => {
    return (
      <AutoAnimate className={cn('flex flex-col space-y-2', parentClassName)}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="group relative">
          {IconLeft && (
            <IconLeft className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground" />
          )}
          <input
            id={id}
            type={type}
            className={cn(
              'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              {
                'pl-9': IconLeft,
                'pr-9': IconRight,
                'pl-3': !IconLeft,
                'pr-3': !IconRight
              },
              className
            )}
            ref={ref}
            {...props}
          />
          {IconRight && (
            <IconRight
              onClick={iconRightAction}
              className={cn(
                'absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground',
                { 'cursor-pointer': !!iconRightAction }
              )}
            />
          )}
        </div>
        {(error || info) && (
          <div className="flex flex-wrap gap-y-1">
            {error && <p className="text-sm text-error">{error}</p>}
            {info && (
              <p className="ml-auto w-fit text-xs italic text-muted-foreground/80">{info}</p>
            )}
          </div>
        )}
      </AutoAnimate>
    );
  }
);
Input.displayName = 'Input';

export { Input };
