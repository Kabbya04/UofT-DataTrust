'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown, Cog, Home, TrendingUp, Search, Users, LayoutDashboard, 
  MessageSquareWarning, FileClock, BarChart3, Shield, Sliders, BarChart2, Plus, Upload
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const dataCategories = [
  "Internet", "Games", "Technology", "Movies", "Pop Culture", "Television", "Medicine", "Songs"
];

const TextLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link 
            href={href}
            className={cn(
                "block text-base font-medium py-1 px-3 rounded-md text-foreground/80 hover:text-foreground",
                isActive && "text-primary font-bold"
            )}
        >
            {children}
        </Link>
    )
}

// Sidebar for Community Member AND the general pages of Researcher
const GeneralNav = ({ rolePrefix }: { rolePrefix: string }) => {
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    return (
        <>
            <div className="space-y-1 mb-2">
                <TextLink href={`${rolePrefix}/home`}>Home</TextLink>
                <TextLink href={`${rolePrefix}/popular`}>Popular</TextLink>
                <TextLink href={`${rolePrefix}/discover-community`}>Discover</TextLink>
            </div>
            <hr className="my-3 border-border" />
            <div className="space-y-1">
                {dataCategories.map((category) => (
                    <div key={category}>
                        <button onClick={() => toggleCategory(category)} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted text-base font-medium text-left">
                            <span>{category}</span>
                            <ChevronDown className={cn("h-5 w-5 transition-transform text-muted-foreground", openCategories[category] && "rotate-180")} />
                        </button>
                        {openCategories[category] && (
                            <div className="pl-6 mt-1"><p className="text-sm text-muted-foreground p-2">No items yet.</p></div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

// ... other role-specific nav components (ResearcherResearchNav, ProjectAdminNav, etc.) ...

export function SidebarWf() {
  const pathname = usePathname();
  const isResearcherWf = pathname.startsWith('/researcher-wf');
  const isCommunityMemberWf = pathname.startsWith('/community-member-wf');
  const isProjectAdminWf = pathname.startsWith('/project-admin-wf');
  const isSuperAdminWf = pathname.startsWith('/super-admin-wf');

  const isResearcherResearchSection = pathname.startsWith('/researcher-wf/overview') || pathname.startsWith('/researcher-wf/get-started');

  // ** FIX for Problem 2: Dynamic Settings Link **
  const getSettingsLink = () => {
    if (isSuperAdminWf) return "/super-admin-wf/settings"; // Add this page if it exists
    if (isProjectAdminWf) return "/project-admin-wf/settings"; // Add this page if it exists
    if (isResearcherWf) return "/researcher-wf/settings";
    if (isCommunityMemberWf) return "/community-member-wf/settings";
    return "/"; // Fallback
  };

  const ResearcherResearchNav = () => {/* ... same as before ... */return <div/>};
  const ProjectAdminNav = () => {/* ... same as before ... */return <div/>};
  const SuperAdminNav = () => {/* ... same as before ... */return <div/>};


  return (
    // The sidebar itself is a flex column that does NOT scroll
    <aside className="w-72 flex-shrink-0 border-r border-border bg-card flex flex-col p-4">
      {/* The <nav> element is now the scrollable container */}
      <nav className="flex-1 space-y-4 overflow-y-auto">
        {isCommunityMemberWf && <GeneralNav rolePrefix="/community-member-wf" />}
        {isResearcherWf && (
            isResearcherResearchSection 
                ? <ResearcherResearchNav /> 
                : <GeneralNav rolePrefix="/researcher-wf" />
        )}
        {isProjectAdminWf && <ProjectAdminNav />}
        {isSuperAdminWf && <SuperAdminNav />}
      </nav>

      {/* The Settings link is outside the scrollable area, pushed to the bottom */}
      <div className="mt-auto pt-4 flex-shrink-0">
        <Link 
          href={getSettingsLink()} 
          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted"
        >
          <span className="font-semibold text-base">Settings</span>
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>
    </aside>
  );
}