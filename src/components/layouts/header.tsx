'use client';

import { logo } from '@/components/utils/logo';
import { useProfile } from '@/queries/use-profile';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { UserIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { openAuthDialog } from '../dialogs/auth-dialog';
import ProfileDropdown from '../dropdowns/profile-dropdown';
import { Skeleton } from '../ui/skeleton';
import Avatar from '../utils/avatar';
import SearchAuctions from './search-auctions';

export default function Header() {
  const { data: profile, isFetched } = useProfile();
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 z-30 w-full border-b border-border/50 text-sm text-muted-foreground filter backdrop-blur-2xl">
      <header className="cont flex h-16 items-center justify-between">
        <ProgressLink href="/" className="text-3xl">
          {logo}
        </ProgressLink>

        <div className="hidden w-full md:mx-10 md:block lg:mx-20">
          <SearchAuctions />
        </div>

        <div className="flex items-center space-x-6 md:space-x-8">
          {!pathname.startsWith('/auctions') && (
            <ProgressLink
              href="/auctions"
              className="hidden whitespace-nowrap hover:text-foreground sm:block"
            >
              Explore Auctions
            </ProgressLink>
          )}

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
              className="flex items-center space-x-2 hover:text-foreground"
              onClick={() => openAuthDialog('register')}
            >
              <span className="whitespace-nowrap">Get Started</span>
              <UserIcon className="size-4" />
            </button>
          )}
        </div>
      </header>

      <div className="px-4 pb-2 md:hidden">
        <SearchAuctions />
      </div>
    </div>
  );
}
