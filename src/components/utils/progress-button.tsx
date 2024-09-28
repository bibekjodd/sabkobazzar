'use client';
import { useLoadingBar } from '@/hooks/use-loading-bar';
import { useRouter } from 'next/navigation';
import React, { ButtonHTMLAttributes, forwardRef } from 'react';

type Props = { href: string } & ButtonHTMLAttributes<HTMLButtonElement>;

const ProgressButton = forwardRef<HTMLButtonElement, Props>(function Component(
  { children, onClick, href, ...props },
  ref
) {
  const start = useLoadingBar((state) => state.start);
  const finish = useLoadingBar((state) => state.finish);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }

    if (location.pathname + location.search === href) {
      finish();
    } else {
      router.push(href);
      start(href);
    }
  };

  return (
    <button {...props} onClick={handleClick} ref={ref}>
      {children}
    </button>
  );
});

export default ProgressButton;
