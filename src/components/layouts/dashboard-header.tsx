'use client';
import DashboardMenuDrawer from '@/components/drawers/dashboard-menu-drawer';
import { poppins } from '@/lib/fonts';
import { useProfile } from '@/queries/use-profile';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import ProfileDropdown from '../dropdowns/profile-dropdown';
import Avatar from '../utils/avatar';
import { logo } from '../utils/logo';
import ProgressLink from '../utils/progress-link';
import { dashboardLinks } from './dashboard-sidebar';

export default function DashboardHeader() {
  const pathname = usePathname();
  const { data: profile } = useProfile();
  const currentPage = dashboardLinks.find((link) => link.href === pathname);

  if (!profile) return null;
  return (
    <header
      className={`${poppins.className} sticky left-0 top-0 z-30 flex h-16 w-full items-center border-b px-4 text-sm lg:left-64 lg:w-[calc(100%-256px)]`}
    >
      <h3 className="hidden text-lg font-semibold lg:block">{currentPage?.title || 'Dashboard'}</h3>

      <ProgressLink href="/" className="text-2xl xs:text-3xl lg:hidden">
        {logo}{' '}
      </ProgressLink>

      <div className="ml-auto flex items-center space-x-2">
        <span className="hidden sm:inline">Welcome, </span>
        <span className="hidden font-semibold sm:inline">{profile.name.split(' ')[0]}</span>

        <ProfileDropdown>
          <button>
            <Avatar src={profile.image} />
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
