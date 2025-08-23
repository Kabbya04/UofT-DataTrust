'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, X, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 text-sm font-medium rounded-md text-muted-foreground transition-colors hover:text-foreground",
        isActive && "text-primary font-semibold"
      )}
    >
      {children}
    </Link>
  );
};

export function NavbarWf() {
  return (
    <header className="h-16 flex-shrink-0 border-b border-border bg-card flex items-center px-6 justify-between">
      {/* Left Section: Logo & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Link href="/researcher-wf/home" className="font-bold text-lg text-mono-caps">Logo</Link>
        <div className="hidden md:flex items-center text-sm text-muted-foreground">
          {/* You can dynamically generate this later */}
          <span className="font-mono">Researcher / Research / Get Started</span>
        </div>
      </div>

      {/* Center Section: Navigation */}
      <nav className="hidden lg:flex items-center gap-2">
        <NavLink href="/researcher-wf/communities">My Communities</NavLink>
        <NavLink href="/researcher-wf/data-usage">Data Usage</NavLink>
        <NavLink href="/researcher-wf/statistics">Statistics</NavLink>
        <NavLink href="/researcher-wf/overview">Research</NavLink>
      </nav>

      {/* Right Section: Search & Profile */}
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-9" />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/profile.jpg" alt="Jhon Doe" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold">Jhon Doe</p>
          </div>
          <button className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
            EN <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}