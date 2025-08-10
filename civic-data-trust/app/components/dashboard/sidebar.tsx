'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronLeft,
  Database,
  FileCheck,
  LayoutGrid,
  Settings2,
  SlidersHorizontal,
  FileText,
  User,
} from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';

const menuItems = [
  {
    title: 'Data Center',
    href: '/data-center',
    icon: Database,
    subItems: ['Upload dataset', 'File Management', 'Metadata Configuration', 'Data History'],
  },
  {
    title: 'Request Center',
    href: '/request-center',
    icon: FileCheck,
    subItems: ['Request Review', 'Request History'],
  },
  {
    title: 'Plugin Configuration',
    href: '/plugin-configuration',
    icon: SlidersHorizontal,
    subItems: ['Access Control', 'Data Expose Control', 'Plugin Request Review'],
  },
  {
    title: 'Enhanced Data features',
    href: '/enhanced-data-features',
    icon: LayoutGrid,
    subItems: ['Dataset Metadata', 'History', 'Audit Log'],
  },
  {
    title: 'Terms & Conditions',
    href: '/terms-and-conditions',
    icon: FileText,
    subItems: ['T&C', 'Version Control', 'Compliance Tracking'],
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleMenu = (title: string) => {
    setOpenMenu(openMenu === title ? null : title);
  };

  const user = {
    id: 'USR-734-B',
    name: 'Alex Ryder',
    email: 'a.ryder@datatrust.org',
    role: 'Project Admin',
  };

  return (
    <aside
      className={`flex flex-col bg-background border-r border-border transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className={`flex items-center p-4 border-b border-border ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-mono-caps text-primary">
            Data Trust
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-muted"
        >
          <ChevronLeft
            className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const isMenuOpen = openMenu === item.title;

          return (
            <div key={item.title}>
              <div
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                  isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                }`}
                onClick={() => toggleMenu(item.title)}
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span className="font-medium text-mono-caps text-sm">{item.title}</span>}
                </Link>
                {!isCollapsed && item.subItems.length > 0 && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </div>
              {!isCollapsed && isMenuOpen && (
                <div className="pl-8 mt-2 space-y-2 border-l-2 border-primary/20 ml-4">
                  {item.subItems.map((sub) => (
                    <div
                      key={sub}
                      className="block p-1.5 text-sm text-muted-foreground hover:text-foreground cursor-not-allowed"
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted text-left">
              <div className="p-2 bg-muted rounded-full">
                <User className="h-5 w-5" />
              </div>
              {!isCollapsed && (
                <div className="flex-1">
                  <p className="text-sm font-semibold text-mono-caps">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.id}</p>
                </div>
              )}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="top"
              align={isCollapsed ? 'start' : 'center'}
              className="w-64 bg-card border border-border rounded-lg shadow-lg p-4 z-50 text-mono-caps"
            >
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">{user.name}</h4>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">{user.role}</p>
              </div>
              <Popover.Arrow className="fill-border" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </aside>
  );
}