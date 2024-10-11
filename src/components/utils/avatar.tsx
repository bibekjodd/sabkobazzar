import { dummyUserImage } from '@/lib/constants';
import ProgressLink from './progress-link';

type Props = {
  src: string | null | undefined;
  className?: string;
  variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isLink?: boolean;
  href?: string;
  showOnlineIndicator?: boolean;
  unreadNotifications?: number;
};

/**
 * `variant` defaults to `md`
 */
export default function Avatar({
  src,
  className,
  variant,
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
          className={`absolute -right-1 -top-1 grid h-4 place-items-center overflow-hidden rounded-full bg-purple-700 px-1 ${unreadNotifications <= 9 ? 'aspect-square' : ''}`}
        >
          <span className="-translate-y-0.5 text-[10px] text-white">
            {unreadNotifications <= 9 ? unreadNotifications : '9+'}
          </span>
        </div>
      )}

      <div
        className={` ${variant === 'xs' ? 'size-4' : ''} ${variant === 'sm' ? 'size-6' : ''} ${variant === 'md' || !variant ? 'size-8' : ''} ${variant === 'lg' ? 'size-10' : ''} ${variant === 'xl' ? 'size-12' : ''} ${variant === 'xl' ? 'size-14' : ''} ${className || ''} ${variant === '2xl' ? 'size-16' : ''}`}
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
