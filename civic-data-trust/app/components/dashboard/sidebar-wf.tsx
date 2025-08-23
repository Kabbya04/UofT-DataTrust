'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Cog, File, Folder, Home, Plus, Upload, BarChart2 } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const dataCategories = [
  "Internet", "Games", "Technology", "Movies", "Pop Culture", "Television", "Medicine", "Songs"
];

const SidebarLink = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: React.ElementType }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-foreground/80 transition-colors hover:bg-muted hover:text-foreground",
        isActive && "bg-primary/10 text-primary font-semibold"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </Link>
  );
};

export function SidebarWf() {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Technology': true, // Default open for demonstration
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <aside className="w-72 flex-shrink-0 border-r border-border bg-card flex flex-col p-4">
      <nav className="flex-1 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-2">
          <h2 className="px-3 text-lg font-semibold text-mono-caps">Overview</h2>
          <SidebarLink href="/researcher-wf/home" icon={Home}>Home</SidebarLink>
        </div>

        {/* Projects Section */}
        <div className="space-y-2">
          <h2 className="px-3 text-lg font-semibold text-mono-caps">Projects</h2>
          <SidebarLink href="/researcher-wf/overview" icon={BarChart2}>Projects Overview</SidebarLink>
          <SidebarLink href="/researcher-wf/get-started" icon={File}>Get Started</SidebarLink>
          <div className="px-3 pt-2">
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
        </div>

        {/* My Data Section */}
        <div className="space-y-2">
          <h2 className="px-3 text-lg font-semibold text-mono-caps">My Data</h2>
          {dataCategories.map((category) => (
            <div key={category}>
              <button onClick={() => toggleCategory(category)} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-foreground/60" />
                  <span>{category}</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openCategories[category] && "rotate-180")} />
              </button>
              {openCategories[category] && (
                <div className="pl-8 mt-1 space-y-1">
                  <p className="text-xs text-muted-foreground p-2">No datasets yet.</p>
                </div>
              )}
            </div>
          ))}
          <div className="px-3 pt-2">
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Upload from Computer
            </Button>
          </div>
        </div>
      </nav>

      {/* Settings Footer */}
      <div className="mt-auto">
        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted">
          <div className="flex items-center gap-3">
            <Cog className="h-5 w-5 text-foreground/60" />
            <span className="font-semibold">Settings</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isSettingsOpen && "rotate-180")} />
        </button>
        {isSettingsOpen && (
          <div className="p-2 mt-2 border rounded-lg">
             <p className="text-xs text-muted-foreground p-2">Setting options here.</p>
          </div>
        )}
      </div>
    </aside>
  );
}