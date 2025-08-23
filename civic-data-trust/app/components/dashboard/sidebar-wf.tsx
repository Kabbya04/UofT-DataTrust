'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    ChevronDown, Cog, File, Folder, Home, Plus, Upload, BarChart2, 
    TrendingUp, Search, Users, LayoutDashboard, MessageSquareWarning, FileClock 
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const dataCategories = [
  "Internet", "Games", "Technology", "Movies", "Pop Culture", "Television", "Medicine", "Songs"
];

const SidebarLink = ({ href, children, icon: Icon, count }: { href: string; children: React.ReactNode; icon: React.ElementType; count?: number }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between px-3 py-2 rounded-lg text-foreground/80 transition-colors hover:bg-muted hover:text-foreground",
        isActive && "bg-primary/10 text-primary font-semibold"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5" />
        <span>{children}</span>
      </div>
      {count !== undefined && <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{count}</span>}
    </Link>
  );
};

export function SidebarWf() {
  const pathname = usePathname();
  const isResearcherWf = pathname.startsWith('/researcher-wf');
  const isCommunityMemberWf = pathname.startsWith('/community-member-wf');
  const isProjectAdminWf = pathname.startsWith('/project-admin-wf');

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Technology': true,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const ResearcherNav = () => (
    <>
      <div className="space-y-2">
        <h2 className="px-3 text-lg font-semibold text-mono-caps">Overview</h2>
        <SidebarLink href="/researcher-wf/home" icon={Home}>Home</SidebarLink>
      </div>
      <div className="space-y-2">
        <h2 className="px-3 text-lg font-semibold text-mono-caps">Projects</h2>
        <SidebarLink href="/researcher-wf/overview" icon={BarChart2}>Projects Overview</SidebarLink>
        <SidebarLink href="/researcher-wf/get-started" icon={File}>Get Started</SidebarLink>
        <div className="px-3 pt-2"><Button className="w-full"><Plus className="w-4 h-4 mr-2" />Add Project</Button></div>
      </div>
    </>
  );

  const CommunityMemberNav = () => (
    <>
      <div className="space-y-2">
          <SidebarLink href="/community-member-wf/home" icon={Home}>Home</SidebarLink>
          <SidebarLink href="/community-member-wf/popular" icon={TrendingUp}>Popular</SidebarLink>
          <SidebarLink href="/community-member-wf/discover-community" icon={Search}>Discover</SidebarLink>
      </div>
      <div className="space-y-2 pt-4">
        {dataCategories.map((category) => (
          <div key={category}>
            <button onClick={() => toggleCategory(category)} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted">
              <div className="flex items-center gap-3"><span>{category}</span></div>
              <ChevronDown className={cn("h-4 w-4 transition-transform", openCategories[category] && "rotate-180")} />
            </button>
            {openCategories[category] && (<div className="pl-8 mt-1 space-y-1"><p className="text-xs text-muted-foreground p-2">No items yet.</p></div>)}
          </div>
        ))}
      </div>
    </>
  );

  const ProjectAdminNav = () => (
    <div className="space-y-1">
        <SidebarLink href="/project-admin-wf/dashboard" icon={LayoutDashboard}>Dashboard</SidebarLink>
        <SidebarLink href="/project-admin-wf/membership-requests" icon={Users} count={240}>Membership Requests</SidebarLink>
        <SidebarLink href="/project-admin-wf/post-review" icon={MessageSquareWarning} count={320}>Post Review</SidebarLink>
        <SidebarLink href="/project-admin-wf/community-audit-logs" icon={FileClock}>Community Audit Logs</SidebarLink>
        <SidebarLink href="/project-admin-wf/community-analytics" icon={BarChart2}>Community Analytics</SidebarLink>
    </div>
  );

  return (
    <aside className="w-72 flex-shrink-0 border-r border-border bg-card flex flex-col p-4">
      <nav className="flex-1 space-y-6">
        {isResearcherWf && <ResearcherNav />}
        {isCommunityMemberWf && <CommunityMemberNav />}
        {isProjectAdminWf && <ProjectAdminNav />}
      </nav>
      <div className="mt-auto">
        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted">
          <div className="flex items-center gap-3"><Cog className="h-5 w-5 text-foreground/60" /><span className="font-semibold">Settings</span></div>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isSettingsOpen && "rotate-180")} />
        </button>
        {isSettingsOpen && (<div className="p-2 mt-2 border rounded-lg"><p className="text-xs text-muted-foreground p-2">Setting options here.</p></div>)}
      </div>
    </aside>
  );
}