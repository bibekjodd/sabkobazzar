'use client';
import { logo } from '@/components/utils/logo';
import ProgressLink from '@/components/utils/progress-link';
import { useLoadingBar } from '@/hooks/use-loading-bar';
import { useTimeout } from '@/hooks/use-timeout';
import { poppins } from '@/lib/fonts';
import { redirectToLogin } from '@/lib/utils';
import { useProfile } from '@/queries/use-profile';
import { useUpcomingAuctions } from '@/queries/use-upcoming-auctions';
import { Dot, LogIn, SearchIcon, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useRef, useState } from 'react';
import ProfileDropdown from '../dropdowns/profile-dropdown';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import AutoAnimate from '../utils/auto-animate';
import Avatar from '../utils/avatar';

export default function Header() {
  const { data: profile, isLoading } = useProfile();
  const pathname = usePathname();

  return (
    <div
      className={`left-0 top-0 z-30 w-full border-b text-sm font-medium filter backdrop-blur-2xl ${pathname === '/' ? 'fixed' : 'sticky bg-background/70'} `}
    >
      <LiveIndicator />

      <div>
        <header className="cont flex h-16 items-center justify-between">
          <ProgressLink href="/" className="text-3xl">
            {logo}
          </ProgressLink>

          <div className="mx-10 hidden w-full md:block lg:mx-20">
            <Suspense>
              <Search />
            </Suspense>
          </div>

          <div className="flex items-center">
            {profile && (
              <ProfileDropdown>
                <button>
                  <Avatar src={profile?.image} />
                </button>
              </ProfileDropdown>
            )}
            {isLoading && <Skeleton className="size-8 rounded-full" />}

            {!isLoading && !profile && (
              <button className="flex items-center space-x-1.5" onClick={redirectToLogin}>
                <span>Login</span>
                <LogIn className="size-4" />
              </button>
            )}
          </div>
        </header>
      </div>
      <div className="mb-2 px-4 md:hidden">
        <Suspense>
          <Search />
        </Suspense>
      </div>
    </div>
  );
}

function Search() {
  const router = useRouter();
  const start = useLoadingBar((state) => state.start);
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('title') || '');
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `/products${searchInput ? `?title=${searchInput}` : ''}`;
    start(url);
    router.push(url);
  };

  return (
    <form onSubmit={onSubmit} className="relative">
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search products..."
        className={`${poppins.className} h-11 w-full border-primary/20 pr-8 text-base placeholder:font-normal`}
      />
      {searchInput ? (
        <X
          onClick={() => setSearchInput('')}
          className="absolute right-3 top-1/2 size-4 -translate-y-1/2 cursor-pointer text-gray-500"
        />
      ) : (
        <SearchIcon className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
      )}
    </form>
  );
}

function LiveIndicator() {
  const pathname = usePathname();
  const isShownLiveIndicatorRef = useRef(false);
  const [showLiveIndicator, setShowLiveIndicator] = useState(false);
  const { data: upcomingAuctions, isLoading: isLoadingAuction } = useUpcomingAuctions({
    ownerId: null,
    productId: null
  });
  const totalUpcomingAuctions = upcomingAuctions?.pages.at(0)?.length || 0;

  useTimeout(
    () => {
      if (isShownLiveIndicatorRef.current) return;
      setShowLiveIndicator(true);
      isShownLiveIndicatorRef.current = true;
    },
    1000,
    !isShownLiveIndicatorRef.current && !isLoadingAuction
  );

  useTimeout(
    () => {
      setShowLiveIndicator(false);
    },
    5000,
    isShownLiveIndicatorRef.current && !isLoadingAuction
  );

  return (
    <AutoAnimate>
      {showLiveIndicator && totalUpcomingAuctions !== 0 && pathname === '/' && (
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
