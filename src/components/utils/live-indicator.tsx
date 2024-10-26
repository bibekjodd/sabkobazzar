'use client';
import { useTimeout } from '@/hooks/use-timeout';
import { useAuctions } from '@/queries/use-auctions';
import { AutoAnimate } from '@jodd/auto-animate';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { Dot } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { create } from 'zustand';

type LiveIndicator = {
  show: boolean;
  isShown: boolean;
};
const useLiveIndicator = create<LiveIndicator>(() => ({
  show: false,
  isShown: false
}));

export default function LiveIndicator() {
  const pathname = usePathname();
  if (pathname !== '/') return null;
  return <BaseComponent />;
}

function BaseComponent() {
  const { show, isShown } = useLiveIndicator();
  const { data: upcomingAuctions, isLoading: isLoadingAuction } = useAuctions({
    ownerId: null,
    productId: null,
    order: 'asc'
  });
  const totalUpcomingAuctions = upcomingAuctions?.pages.at(0)?.length || 0;

  useTimeout(
    () => {
      if (isShown) return;
      useLiveIndicator.setState({ isShown: true, show: true });
    },
    1000,
    !isShown && !isLoadingAuction
  );

  useTimeout(
    () => {
      useLiveIndicator.setState({ show: false });
    },
    5000,
    isShown && !isLoadingAuction
  );

  return (
    <AutoAnimate>
      {show && totalUpcomingAuctions !== 0 && (
        <ProgressLink
          href="/auctions"
          className="mx-auto flex w-fit items-center border-b border-transparent px-2 pt-2 text-sm font-medium text-purple-600 hover:border-purple-600"
        >
          <span>
            {totalUpcomingAuctions < 4 ? totalUpcomingAuctions : '4+'} Auctions coming live
          </span>
          <Dot className="size-6 translate-y-[1px] scale-125 animate-pulse" />
        </ProgressLink>
      )}
    </AutoAnimate>
  );
}
