'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronLeft,
  Database,
  FileCheck,
  LayoutGrid,
  SlidersHorizontal,
  FileText,
  User,
} from 'lucide-react';

const menuItems = [
  // ... (menuItems array remains the same)
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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
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

  // Effect to handle clicks outside of the popover to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    // Unbind the event listener on clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef]);


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
        {/* Menu items rendering remains the same */}
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

      {/* --- Custom Popover Implementation --- */}
      <div className="p-4 border-t border-border mt-auto relative" ref={popoverRef}>
        {isPopoverOpen && (
          <div className="absolute bottom-full mb-2 w-64 bg-card border border-border rounded-lg shadow-lg p-4 z-50 text-mono-caps left-1/2 -translate-x-1/2">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">{user.name}</h4>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </div>
            {/* CSS-based arrow */}
            <div className="absolute bottom-[-9px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-border"></div>
             <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-card"></div>
          </div>
        )}

        <button
          onClick={() => setIsPopoverOpen((prev) => !prev)}
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted text-left"
        >
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
      </div>
    </aside>
  );
}