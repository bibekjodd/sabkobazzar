'use client';
import LogoutDialog from '@/components/dialogs/logout-dialog';
import { poppins } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import { LayoutGrid, LogOut, LucideIcon, Route, UsersRound } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { logo } from '../utils/logo';

export const dashboardLinks: { title: string; href: string; icon: LucideIcon }[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid
  },
  {
    title: 'Manage Auctions',
    href: '/dashboard/auctions',
    icon: Route
  },
  {
    title: 'Manage Products',
    href: '/dashboard/products',
    icon: UsersRound
  }
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        poppins.className,
        'fixed left-0 top-0 z-50 hidden h-screen min-h-screen w-64 flex-col overflow-y-auto border-r py-3 text-sm font-medium text-gray-100 lg:flex'
      )}
    >
      {graphics}
      <ProgressLink href="/" className="px-5 text-2xl font-semibold">
        {logo}
      </ProgressLink>

      <nav className="mt-5 flex h-full flex-grow flex-col">
        {dashboardLinks.map((link) => (
          <ProgressLink
            key={link.title}
            href={link.href}
            className={`mb-1 flex h-12 items-center space-x-3 pl-4 hover:bg-purple-700/15 hover:text-purple-500 ${pathname === link.href ? 'border-l-4 border-purple-700 bg-purple-700/15 text-purple-500' : ''}`}
          >
            <link.icon className="size-5" />
            <span>{link.title}</span>
          </ProgressLink>
        ))}

        <LogoutDialog>
          <button className="mb-3 mt-auto flex w-fit items-center space-x-3 px-6 hover:text-purple-500">
            <LogOut className="size-5" />
            <span>Logout</span>
          </button>
        </LogoutDialog>
      </nav>
    </aside>
  );
}

const graphics = (
  <>
    <div className="fixed left-0 top-0 -z-10 hidden h-full w-64 bg-gradient-to-br from-sky-900/30 to-fuchsia-900/10 blur-3xl filter lg:block" />
  </>
);
