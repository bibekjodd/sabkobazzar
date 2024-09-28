import { dummyUserImage } from '@/lib/constants';
import ProgressLink from './progress-link';

type Props = {
  src: string | null | undefined;
  className?: string;
  variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isLink?: boolean;
  href?: string;
};

/**
 * `variant` defaults to `md`
 */
export default function Avatar({ src, className, variant, isLink, href }: Props) {
  const image = (
    <div className="inline h-fit w-fit select-none">
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
