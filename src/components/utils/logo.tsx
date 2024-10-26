import { poppins } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export const logo = (
  <span
    className={cn(
      poppins.className,
      'bg-gradient-to-br from-purple-800 to-purple-900 bg-clip-text font-bold text-transparent'
    )}
  >
    Sabkobazzar
  </span>
);
