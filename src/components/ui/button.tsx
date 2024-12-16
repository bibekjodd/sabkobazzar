import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2, LucideIcon } from 'lucide-react';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-br from-purple-600 to-violet-600 text-indigo-100 hover:brightness-125',
        secondary:
          'bg-gradient-to-b from-gray-200 to-gray-400/90 hover:brightness-110 text-primary-foreground',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-transparent shadow-sm hover:bg-muted/50 hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        'moving-border':
          'relative overflow-hidden rounded-full border-2 !h-12 !px-0.5 border-violet-700/20  font-medium text-indigo-200 hover:border-purple-700/80 group',
        text: ''
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, Icon, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        <span className={cn(loading && 'opacity-0', 'inline-flex items-center justify-center')}>
          <span
            className={cn('inline-flex items-center justify-center', {
              'h-10 rounded-full bg-background/95 px-10': variant === 'moving-border'
            })}
          >
            {children}
          </span>
          {Icon && <Icon className={cn('ml-2', size === 'sm' ? 'size-3.5' : 'size-4')} />}
        </span>
        {loading && (
          <span className="absolute grid place-items-center">
            {<Loader2 className={cn('animate-spin', size === 'sm' ? 'size-3.5' : 'size-4')} />}
          </span>
        )}

        {variant === 'moving-border' && (
          <>
            <span className="absolute inset-0 -z-10 animate-moving-border rounded-full bg-[conic-gradient(#7e22ce_20deg,transparent_120deg)] group-hover:opacity-0" />
            <span className="absolute inset-0 top-7 rounded-full bg-indigo-500/50 opacity-50 blur-md filter transition group-hover:opacity-75" />
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
