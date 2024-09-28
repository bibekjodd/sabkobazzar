'use client';
import { logo } from '@/components/utils/logo';
import ProgressLink from '@/components/utils/progress-link';
import { useLoadingBar } from '@/hooks/use-loading-bar';
import { loginLink } from '@/lib/constants';
import { poppins } from '@/lib/fonts';
import { useProfile } from '@/queries/use-profile';
import { LogIn, Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import ProfileDropdown from '../dropdowns/profile-dropdown';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import Avatar from '../utils/avatar';

export default function Header() {
  const router = useRouter();
  const start = useLoadingBar((state) => state.start);
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('title') || '');
  const { data: profile, isLoading } = useProfile();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `/products${searchInput ? `?title=${searchInput}` : ''}`;
    start(url);
    router.push(url);
  };

  return (
    <div className="sticky left-0 top-0 z-10 flex h-16 w-full items-center border-b bg-white/80 text-sm font-medium filter backdrop-blur-2xl">
      <header className="cont flex items-center justify-between">
        <ProgressLink href="/" className="text-3xl">
          {logo}
        </ProgressLink>

        <form onSubmit={onSubmit} className="relative mx-10 w-full lg:mx-20">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className={`${poppins.className} h-11 w-full pr-8 text-base placeholder:font-normal focus:ring-4`}
          />
          {searchInput ? (
            <X
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 size-4 -translate-y-1/2 cursor-pointer text-gray-600"
            />
          ) : (
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-600" />
          )}
        </form>

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
            <button
              className="flex items-center space-x-1.5"
              onClick={() => window.open(loginLink, '_blank')}
            >
              <span>Login</span>
              <LogIn className="size-4" />
            </button>
          )}
        </div>
      </header>
    </div>
  );
}
