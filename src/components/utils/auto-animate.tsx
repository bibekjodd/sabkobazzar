'use client';
import { AutoAnimateOptions } from '@formkit/auto-animate';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { HTMLAttributes } from 'react';

type Props = {
  animationOptions?: Partial<AutoAnimateOptions>;
} & HTMLAttributes<HTMLDivElement>;

export default function AutoAnimate({ animationOptions, children, ...props }: Props) {
  const [ref] = useAutoAnimate({
    ...(animationOptions || {}),
    duration: animationOptions?.duration || 300
  });
  return (
    <div {...props} ref={ref}>
      {children}
    </div>
  );
}
