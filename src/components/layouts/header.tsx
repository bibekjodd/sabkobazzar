'use client';

import { logo } from '@/components/utils/logo';
import { useProfile } from '@/queries/use-profile';
import { clearFilterAuctions } from '@/stores/use-filter-auctions';
import { ProgressLink, useLoadingBar } from '@jodd/next-top-loading-bar';
import { LogIn, SearchIcon, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { openAuthDialog } from '../dialogs/auth-dialog';
import ProfileDropdown from '../dropdowns/profile-dropdown';
import { Skeleton } from '../ui/skeleton';
import Avatar from '../utils/avatar';

export default function Header() {
  const { data: profile, isFetched } = useProfile();
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 z-30 w-full border-b border-border/50 text-sm text-indigo-200 filter backdrop-blur-2xl">
      <header className="cont flex h-16 items-center justify-between">
        <ProgressLink href="/" className="text-3xl">
          {logo}
        </ProgressLink>

        {pathname !== '/auctions' && <NavItems />}
        {pathname === '/auctions' && (
          <div className="mx-10 hidden w-full md:block lg:mx-20">
            <Suspense>
              <Search />
            </Suspense>
          </div>
        )}

        <div className="flex items-center">
          {profile && (
            <ProfileDropdown>
              <button>
                <Avatar
                  src={profile?.image}
                  unreadNotifications={profile.totalUnreadNotifications}
                />
              </button>
            </ProfileDropdown>
          )}

          {!isFetched && !profile && <Skeleton className="size-8 rounded-full" />}

          {isFetched && !profile && (
            <button
              className="flex items-center space-x-1.5 hover:text-indigo-100"
              onClick={openAuthDialog}
            >
              <span>Login</span>
              <LogIn className="size-4" />
            </button>
          )}
        </div>
      </header>
      <Suspense>
        <div className="px-4 pb-2 md:hidden">
          <Search />
        </div>
      </Suspense>
    </div>
  );
}

function Search() {
  const router = useRouter();
  const start = useLoadingBar((state) => state.start);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchInput, setSearchInput] = useState(searchParams.get('title') || '');
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `/auctions${searchInput ? `?title=${searchInput}` : ''}`;
    const canStart = start(url);
    if (!canStart) return;
    clearFilterAuctions();
    router.push(url);
  };
  if (pathname !== '/auctions') return null;

  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search auctions..."
        className="h-11 w-full rounded-lg border-2 border-indigo-200/20 pl-9 pr-8 text-base text-gray-100 focus:border-2 focus:border-indigo-200/70 focus:outline-none"
      />
      {searchInput && (
        <X
          onClick={() => setSearchInput('')}
          className="absolute right-3 top-1/2 size-4 -translate-y-1/2 cursor-pointer text-gray-500"
        />
      )}
    </form>
  );
}

function NavItems() {
  const navLinks = [
    { title: 'How it works', href: '/#how-it-works' },
    { title: 'Benefits', href: '/#benefits' },
    { title: 'Testimonials', href: '/#testimonials' },
    { title: 'FAQs', href: '/#faqs' }
  ];

  return (
    <div className="ml-auto mr-5 hidden w-fit items-center justify-center space-x-5 md:flex lg:mr-7 lg:space-x-7">
      {navLinks.map((item) => (
        <ProgressLink key={item.href} href={item.href} className="hover:text-indigo-100">
          {item.title}
        </ProgressLink>
      ))}
    </div>
  );
}
