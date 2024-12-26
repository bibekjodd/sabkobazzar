import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2, LucideIcon } from 'lucide-react';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center relative justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-b from-gray-200 to-gray-300/80 hover:brightness-110 text-primary-foreground',
        brand:
          'bg-gradient-to-br from-brand-darker text-white [&_svg]:text-white to-brand-darker/80 hover:brightness-[1.15]',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-transparent shadow-sm hover:bg-muted/50 hover:text-accent-foreground',
        ghost:
          'hover:bg-accent/80 focus:bg-accent/80 focus:text-accent-foreground hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        'moving-border':
          'relative overflow-hidden rounded-full border-2 !h-12 !px-0.5 border-brand-darker/15 font-medium text-muted-foreground hover:border-brand-darker/80 group'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  Icon?: LucideIcon;
  IconLeft?: LucideIcon;
  IconRight?: LucideIcon;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      Icon,
      IconLeft,
      IconRight,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    Icon = IconRight || Icon;
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        <span className={cn(loading && 'opacity-0', 'inline-flex items-center justify-center')}>
          {IconLeft && (
            <IconLeft
              className={cn('mr-2', { 'size-3.5': size === 'sm', 'size-4': size !== 'sm' })}
            />
          )}
          <span
            className={cn('inline-flex items-center justify-center', {
              'h-10 rounded-full bg-background/95 px-10': variant === 'moving-border'
            })}
          >
            {children}
          </span>
          {Icon && (
            <Icon className={cn('ml-2', { 'size-3.5': size === 'sm', 'size-4': size !== 'sm' })} />
          )}
        </span>
        {loading && (
          <span className="absolute inset-0 grid place-items-center">
            {
              <Loader2
                className={cn('animate-spin', {
                  'size-3.5': size === 'sm',
                  'size-4': size !== 'sm'
                })}
              />
            }
          </span>
        )}

        {variant === 'moving-border' && (
          <>
            <span className="absolute inset-0 -z-10 animate-moving-border rounded-full bg-[conic-gradient(currentColor_20deg,transparent_120deg)] text-brand-darker/80 group-hover:opacity-0" />
            <span className="absolute inset-0 top-7 rounded-full bg-indigo-500/50 opacity-50 blur-md filter transition group-hover:opacity-75" />
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
