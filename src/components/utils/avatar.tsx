import { dummyUserImage } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { JSX } from 'react';

type Props = Omit<JSX.IntrinsicElements['img'], 'src'> & {
  src: string | null | undefined;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showOnlineIndicator?: boolean;
  unreadNotifications?: number;
} & ({ isLink?: undefined | false; href?: undefined } | { isLink: true; href: string });

/**
 * `size` defaults to `md`
 */
export default function Avatar({
  src,
  className,
  size,
  isLink,
  href,
  showOnlineIndicator,
  unreadNotifications,
  ...props
}: Props) {
  const image = (
    <div
      className={cn(
        'relative select-none',
        {
          'aspect-square h-4 min-h-4': size === 'xs',
          'aspect-square h-6 min-h-6': size === 'sm',
          'aspect-square h-8 min-h-8': size === 'md' || !size,
          'aspect-square h-10 min-h-10': size === 'lg',
          'aspect-square h-12 min-h-12': size === 'xl',
          'aspect-square h-14 min-h-14': size === '2xl'
        },
        className
      )}
    >
      <img
        src={src || dummyUserImage}
        loading="lazy"
        decoding="async"
        alt="user avatar"
        className="h-full w-full rounded-full object-cover"
        {...props}
      />

      {showOnlineIndicator && (
        <div className="absolute bottom-0 right-0 size-2 scale-90 rounded-full border border-background bg-green-600" />
      )}

      {!!unreadNotifications && (
        <div
          className={cn(
            'absolute -right-1 -top-1 grid h-4 place-items-center overflow-hidden rounded-full bg-brand-darker px-1 text-foreground',
            unreadNotifications <= 9 && 'aspect-square'
          )}
        >
          <span className="-translate-y-0.5 text-[10px] text-white">
            {unreadNotifications <= 9 ? unreadNotifications : '9+'}
          </span>
        </div>
      )}
    </div>
  );
  if (isLink) {
    return <ProgressLink href={href}>{image}</ProgressLink>;
  }
  return image;
}
