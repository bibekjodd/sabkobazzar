'use client';
import { useLoadingBar } from '@/hooks/use-loading-bar';
import Link, { LinkProps } from 'next/link';
import React, { AnchorHTMLAttributes, forwardRef } from 'react';

type Props = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;

const ProgressLink = forwardRef<HTMLAnchorElement, Props>(function Component(
  { children, href, onClick, ...props },
  ref
) {
  const start = useLoadingBar((state) => state.start);
  const finish = useLoadingBar((state) => state.finish);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    if (href === location.pathname + location.search) {
      finish();
    } else {
      start(href);
    }
  };

  return (
    <Link {...props} href={href} onClick={handleClick} ref={ref}>
      {children}
    </Link>
  );
});

export default ProgressLink;
