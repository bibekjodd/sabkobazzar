'use client';

import { logo } from '@/components/utils/logo';
import { getQueryClient } from '@/lib/query-client';
import { redirectToLogin } from '@/lib/utils';
import { fetchProducts, productsKey } from '@/queries/use-products';
import { useProfile } from '@/queries/use-profile';
import { ProgressLink, useLoadingBar } from '@jodd/next-top-loading-bar';
import { LogIn, SearchIcon, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
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

        {pathname !== '/products' && <NavItems />}
        {pathname === '/products' && (
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
              onClick={redirectToLogin}
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
    const url = `/products${searchInput ? `?title=${searchInput}` : ''}`;
    start(url);
    router.push(url);
  };
  if (pathname !== '/products') return null;

  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search products..."
        className="h-11 w-full rounded-lg border border-indigo-200/20 px-3 pr-8 text-base text-gray-100 focus:border-2 focus:border-indigo-200/70 focus:outline-none"
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

function NavItems() {
  const navLinks = [
    { title: 'How it works', href: '/#how-it-works' },
    { title: 'Benefits', href: '/#benefits' },
    { title: 'Testimonials', href: '/#testimonials' },
    { title: 'Explore Products', href: '/products' }
  ];

  const queryClient = getQueryClient();
  const prefetchProducts = () => {
    if (queryClient.getQueryData(productsKey({}))) return;
    queryClient.prefetchInfiniteQuery({
      queryKey: productsKey({}),
      initialPageParam: undefined,
      queryFn: ({ signal, pageParam }) => fetchProducts({ pageParam, signal })
    });
  };

  return (
    <div className="ml-auto mr-5 hidden w-fit items-center justify-center space-x-5 md:flex lg:mr-7 lg:space-x-7">
      {navLinks.map((item) => (
        <ProgressLink
          key={item.href}
          href={item.href}
          onClick={item.href === '/products' ? prefetchProducts : undefined}
          className="hover:text-indigo-100"
        >
          {item.title}
        </ProgressLink>
      ))}
    </div>
  );
}
