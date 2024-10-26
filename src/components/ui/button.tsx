import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2, LucideIcon } from 'lucide-react';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center relative justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        theme: 'bg-gradient-to-br from-fuchsia-900 to-purple-950 hover:brightness-125',
        'theme-secondary':
          'bg-gradient-to-b from-gray-400 to-gray-500/90 hover:brightness-125 text-primary-foreground',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
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
  ({ className, variant, size, asChild = false, loading, children, Icon, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        <span className={cn(loading && 'opacity-0', 'inline-flex items-center justify-center')}>
          <span className="inline-flex items-center justify-center">{children}</span>
          {Icon && <Icon className={cn('ml-2', size === 'sm' ? 'size-3.5' : 'size-4')} />}
        </span>
        {loading && (
          <span className="absolute grid place-items-center">
            {<Loader2 className={cn('animate-spin', size === 'sm' ? 'size-3.5' : 'size-4')} />}
          </span>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
