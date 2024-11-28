'use client';

import DashboardMenuDrawer from '@/components/drawers/dashboard-menu-drawer';
import { useProfile } from '@/queries/use-profile';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { Menu } from 'lucide-react';
import ProfileDropdown from '../dropdowns/profile-dropdown';
import Avatar from '../utils/avatar';
import { logo } from '../utils/logo';

export default function DashboardHeader() {
  const { data: profile } = useProfile();
  if (!profile) return null;
  return (
    <header className="sticky left-0 top-0 z-30 flex h-16 w-full items-center border-b border-gray-400/10 px-4 text-sm filter backdrop-blur-3xl">
      <div className="w-60">
        <ProgressLink href="/" className="text-3xl">
          {logo}
        </ProgressLink>
      </div>

      <div className="ml-auto flex items-center space-x-2">
        <span className="hidden sm:inline">Welcome, </span>
        <span className="hidden font-semibold sm:inline">{profile.name.split(' ')[0]}</span>

        <ProfileDropdown>
          <button>
            <Avatar src={profile.image} unreadNotifications={profile.totalUnreadNotifications} />
          </button>
        </ProfileDropdown>
      </div>

      <DashboardMenuDrawer>
        <button className="ml-3 lg:hidden">
          <Menu className="size-6 text-primary/90" />
        </button>
      </DashboardMenuDrawer>
    </header>
  );
}
