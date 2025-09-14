'use client';

import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import Image from "next/image"
import { usePathname } from 'next/navigation';
import { MagnifyingGlass, X, CaretDown, Bell } from 'phosphor-react';
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
        "px-5 py-2 text-figma-lg font-normal text-civic-gray-500 hover:text-civic-gray-900 transition-colors",
        isActive && "text-civic-gray-900 font-bold"
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
    <header className="h-16 flex-shrink-0 bg-civic-gray-100 flex items-center px-6 justify-between">
      <div className=' flex items-center'>
        <Link href={getHomeLink()} className="font-bold text-2xl text-civic-gray-500 uppercase tracking-wide">LOGO</Link>
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
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-civic-gray-400" />
          <Input
            placeholder="Search anything"
            className="pl-12 pr-6 py-3 bg-white border border-white rounded-4xl text-figma-base text-civic-gray-500 placeholder-civic-gray-400 focus:outline-none focus:ring-2 focus:ring-civic-gray-400 focus:border-transparent shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex flex-row items-center gap-2 cursor-pointer py-3 bg-white border border-transparent hover:border-civic-gray-300 px-4 rounded-4xl transition-all duration-200 shadow-sm">
              <span className="text-figma-base text-civic-gray-500">English</span>
              <CaretDown className="h-4 w-4 text-civic-gray-400" />
            </DropdownMenuTrigger>
          </DropdownMenu>

          <ThemeToggle />
          <NotificationButton />

          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex flex-row items-center gap-3 cursor-pointer bg-white border border-transparent hover:border-civic-gray-300 px-2 py-2 rounded-4xl transition-all duration-200 shadow-sm">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/profile.jpg" alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-civic-accent-green text-white text-xs font-medium">
                    {user ? getUserInitials(user.name) : 'JD'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-civic-accent-green rounded-full border-2 border-white"></div>
              </div>
              <span className="text-figma-base font-medium text-civic-gray-900 hidden sm:block">
                {user?.name || 'Jane Doe'}
              </span>
              <CaretDown className="h-4 w-4 text-civic-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-[280px] sm:w-80 bg-white border border-civic-gray-200 rounded-2xl shadow-figma-card"
            >
              <Profile avatar="/profile.jpg" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}