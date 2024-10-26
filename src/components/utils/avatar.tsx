import { dummyUserImage } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ProgressLink } from '@jodd/next-top-loading-bar';

type Props = {
  src: string | null | undefined;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isLink?: boolean;
  href?: string;
  showOnlineIndicator?: boolean;
  unreadNotifications?: number;
};

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
  unreadNotifications
}: Props) {
  const image = (
    <div className="relative inline size-fit select-none rounded-full">
      {showOnlineIndicator && (
        <div className="absolute bottom-0 right-0 size-2 scale-90 rounded-full border border-background bg-green-600" />
      )}

      {!!unreadNotifications && (
        <div
          className={cn(
            'absolute -right-1 -top-1 grid h-4 place-items-center overflow-hidden rounded-full bg-purple-700 px-1',
            unreadNotifications <= 9 && 'aspect-square'
          )}
        >
          <span className="-translate-y-0.5 text-[10px] text-white">
            {unreadNotifications <= 9 ? unreadNotifications : '9+'}
          </span>
        </div>
      )}

      <div
        className={cn(
          {
            'size-4': size === 'xs',
            'size-6': size === 'sm',
            'size-8': size === 'md' || !size,
            'size-10': size === 'lg',
            'size-12': size === 'xl',
            'size-14': size === '2xl'
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
        />
      </div>
    </div>
  );
  if (isLink && href) {
    return <ProgressLink href={href}>{image}</ProgressLink>;
  }
  return image;
}
