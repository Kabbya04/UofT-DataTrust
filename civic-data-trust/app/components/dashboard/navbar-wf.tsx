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
        "px-5 py-2 text-figma-lg font-normal text-muted-foreground hover:text-foreground transition-colors",
        isActive && "text-foreground font-bold"
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
  const getUserInitials = (name: string | undefined | null): string => {
    // Handle edge cases where name is undefined, null, or empty
    if (!name || typeof name !== 'string') {
      return '??';
    }
    
    // Clean and process the name
    const cleanName = name.trim();
    if (!cleanName) {
      return '??';
    }
    
    const initials = cleanName
      .split(' ')
      .filter(part => part.length > 0) // remove empty parts
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
      
    return initials.slice(0, 2);
  };

  const getHomeLink = () => {
    if (isResearcherWf) return "/researcher-wf/home";
    if (isCommunityMemberWf) return "/community-member-wf/home";
    if (isProjectAdminWf) return "/project-admin-wf/dashboard";
    if (isSuperAdminWf) return "/super-admin-wf/dashboard";
    return "/";
  }

  return (
    <header className="h-16 flex-shrink-0 flex items-center px-6 justify-between" style={{ backgroundColor: '#F1F1F1' }}>
      <div className=' flex items-center'>
        <Link href={getHomeLink()} className="font-bold text-2xl text-muted-foreground uppercase tracking-wide">LOGO</Link>
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
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search anything"
            className="pl-12 pr-6 py-3 bg-card border border-border rounded-4xl text-figma-base text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex flex-row items-center gap-2 cursor-pointer py-3 bg-card border border-border hover:border-border/80 px-4 rounded-4xl transition-all duration-200 shadow-sm">
              <span className="text-figma-base text-muted-foreground">English</span>
              <CaretDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
          </DropdownMenu>

          <ThemeToggle />
          <NotificationButton />

          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex flex-row items-center gap-3 cursor-pointer bg-card border border-border hover:border-border/80 px-2 py-2 rounded-4xl transition-all duration-200 shadow-sm">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/profile.jpg" alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-civic-accent-green text-white text-xs font-medium">
                    {user ? getUserInitials(user.name) : 'JD'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-civic-accent-green rounded-full border-2 border-white dark:border-[#1A1A1A]"></div>
              </div>
              <span className="text-figma-base font-medium text-foreground hidden sm:block">
                {user?.name || 'Jane Doe'}
              </span>
              <CaretDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-[280px] sm:w-80 border border-border rounded-2xl shadow-figma-card"
              style={{ backgroundColor: '#F1F1F1', color: 'black' }}
            >
              <Profile avatar="/profile.jpg" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}