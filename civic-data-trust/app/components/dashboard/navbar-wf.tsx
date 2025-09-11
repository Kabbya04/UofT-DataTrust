'use client';

import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import Image from "next/image"
import { usePathname } from 'next/navigation';
import { Search, X, ChevronDown, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import ThemeToggle from "../theme-toggle";
import { NotificationButton } from "../dashboard/notification-button"
import Profile from "./profile-icon-dropdown-menu"
import { useAuth } from '../contexts/auth-context';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors",
        isActive && "text-gray-900 font-semibold"
      )}
    >
      {children}
    </Link>
  );
};

export function NavbarWf() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isResearcherWf = pathname.startsWith('/researcher-wf');
  const isCommunityMemberWf = pathname.startsWith('/community-member-wf');
  const isProjectAdminWf = pathname.startsWith('/project-admin-wf');
  const isSuperAdminWf = pathname.startsWith('/super-admin-wf');

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getHomeLink = () => {
    if (isResearcherWf) return "/researcher-wf/home";
    if (isCommunityMemberWf) return "/community-member-wf/home";
    if (isProjectAdminWf) return "/project-admin-wf/dashboard";
    if (isSuperAdminWf) return "/super-admin-wf/dashboard";
    return "/";
  }

  return (
    <header className="h-16 flex-shrink-0 bg-gray-100 flex items-center px-6 justify-between">
      <div className=' flex items-center'>
        <Link href={getHomeLink()} className="font-semibold text-lg  text-gray-500 ">LOGO</Link>
      </div>


      <div className="flex items-center justify-between gap-8">
        <nav className="hidden lg:flex items-center gap-1">
          {/* Updated Nav Links for Researcher */}
          {isResearcherWf && (<>
            <NavLink href="/researcher-wf/my-communities">My Communities</NavLink>
            <NavLink href="/researcher-wf/statistics">Statistics</NavLink>
            <NavLink href="/researcher-wf/research/get-started">Research</NavLink>
          </>)}

          {isCommunityMemberWf && (<>
            <NavLink href="/community-member-wf/my-communities">My Communities</NavLink>
            {/* <NavLink href="/community-member-wf/data-usage">Data Usage</NavLink> */}
            <NavLink href="/community-member-wf/statistics">Statistics</NavLink>
          </>)}
        </nav>
        <div className="relative lg:w-90">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search anything"
            className="pl-10 pr-4 py-2 bg-white border border-white rounded-4xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex flex-row items-center gap-2 cursor-pointer py-2 bg-white border border-transparent hover:border-gray-300 px-3 rounded-4xl">
              <span className="text-sm text-gray-600">English</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </DropdownMenuTrigger>
          </DropdownMenu>

          <ThemeToggle />
          <NotificationButton />

          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex flex-row items-center gap-2 cursor-pointer bg-white border border-transparent hover:border-gray-300 px-2 py-1 rounded-4xl">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/profile.jpg" alt={user?.name || 'User'} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-medium">
                  {user ? getUserInitials(user.name) : 'JD'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-900 hidden sm:block">
                {user?.name || 'Jane Doe'}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-[280px] sm:w-80 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <Profile avatar="/profile.jpg" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}