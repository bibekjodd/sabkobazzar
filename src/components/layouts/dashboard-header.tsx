'use client';

import { openDashbordMenuDrawer } from '@/components/drawers/dashboard-menu-drawer';
import { useProfile } from '@/queries/use-profile';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { CommandIcon, MenuIcon, SearchIcon } from 'lucide-react';
import DashboardBreadcrumbs from '../dashboard-breadcrumbs';
import ProfileDropdown from '../dropdowns/profile-dropdown';
import { openSearchDashboard } from '../search-dashboard';
import Avatar from '../utils/avatar';
import { logo } from '../utils/logo';

export default function DashboardHeader() {
  const { data: profile } = useProfile();

  if (!profile) return null;
  return (
    <header className="sticky left-0 top-0 z-30 flex h-16 w-full items-center border-gray-400/10 px-4 text-sm filter backdrop-blur-3xl">
      <div className="w-60">
        <ProgressLink href="/" className="text-3xl lg:px-2 lg:text-2xl">
          {logo}
        </ProgressLink>
      </div>

      <div className="hidden lg:block">
        <DashboardBreadcrumbs />
      </div>

      <div className="ml-auto flex items-center space-x-2">
        <div className="hidden md:block">
          <button
            onClick={openSearchDashboard}
            className="relative mr-2 hidden h-9 w-60 cursor-pointer items-center rounded-lg border border-indigo-200/10 bg-indigo-900/10 px-2 md:flex"
          >
            <SearchIcon className="size-4" />
            <span className="ml-2 mr-auto">Search...</span>
            <kbd className="hidden items-center space-x-2 rounded-lg bg-black/20 p-1.5 lg:flex">
              <CommandIcon className="size-3" />
              <span className="text-xs">K</span>
            </kbd>
          </button>
        </div>

        <span className="hidden sm:inline lg:hidden xl:inline">Welcome, </span>
        <span className="hidden font-semibold sm:inline lg:hidden xl:inline">
          {profile.name.split(' ')[0]}
        </span>

        <ProfileDropdown>
          <button>
            <Avatar src={profile.image} unreadNotifications={profile.totalUnreadNotifications} />
          </button>
        </ProfileDropdown>
      </div>

      <button onClick={openDashbordMenuDrawer} className="ml-3 lg:hidden">
        <MenuIcon className="size-6 text-primary/90" />
      </button>
    </header>
  );
}
