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
        "px-3 py-2 text-sm font-medium rounded-md text-muted-foreground transition-colors hover:text-foreground",
        isActive && "text-primary font-semibold border-b-2 border-primary rounded-none"
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
    <header className="h-16 flex-shrink-0 border-b border-border bg-card flex items-center px-6 justify-between">
      <div className="flex items-center gap-4">
        <Link href={getHomeLink()} className="font-bold text-lg text-mono-caps">Logo</Link>
      </div>

      <nav className="hidden lg:flex items-center gap-2 h-full">
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

      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-9" />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex flex-row items-center gap-2 justify-center cursor-pointer">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/profile.jpg" alt={user?.name || 'User'} />
                <AvatarFallback>{user ? getUserInitials(user.name) : 'U'}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block cursor-pointer">
                <span className="text-sm font-semibold">{user?.name || 'Loading...'}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-[280px] sm:w-80 bg-background border-border rounded-lg shadow-lg"
            >
              <Profile avatar="/profile.jpg" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ThemeToggle />
        <NotificationButton />
        <button className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">EN <ChevronDown className="h-4 w-4" /></button>
      </div>
    </header>
  );
}