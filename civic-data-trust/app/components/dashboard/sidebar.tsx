'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  BarChart3,
  Bell,
  BetweenHorizonalEndIcon,
  ChevronDown,
  ChevronLeft,
  Database,
  Eye,
  EyeOff,
  FileCheck,
  FileClock,
  FileIcon,
  FileJson2,
  FileSearch,
  FileText,
  GitBranch,
  History,
  KeyRound,
  LayoutGrid,
  Library,
  Lightbulb,
  NotebookTabsIcon,
  Search,
  Settings2,
  ShieldCheck,
  ShieldUserIcon,
  SlidersHorizontal,
  UploadCloud,
  User,
  UserCog,
  UserPlus,
  Users,
  Users2,
} from 'lucide-react';


const menuItems = [
  {
    id: "data-center",
    title: "Data Center",
    href: "/data-center",
    icon: Database,
    subItems: [
      { id: "upload-dataset", title: "Upload dataset", href: "/data-center/upload-dataset", icon: UploadCloud },
      { id: "file-management", title: "File Management", href: "/data-center/file-management", icon: FileIcon },
      { id: "metadata-configuration", title: "Metadata Configuration", href: "/data-center/metadata-configuration", icon: Settings2 },
      { id: "data-history", title: "Data History", href: "/data-center/data-history", icon: History },
    ],
  },
  {
    id: "request-center",
    title: "Request Center",
    href: "/request-center",
    icon: FileCheck,
    subItems: [
      { id: "request-review", title: "Request Review", href: "/request-center/request-review", icon: FileSearch },
      { id: "request-history", title: "Request History", href: "/request-center/request-history", icon: History },
    ],
  },
  {
    id: "plugin-configuration",
    title: "Plugin Configuration",
    href: "/plugin-configuration",
    icon: SlidersHorizontal,
    subItems: [
      { id: "access-control", title: "Access Control", href: "/plugin-configuration/access-control", icon: KeyRound },
      { id: "data-expose-control", title: "Data Expose Control", href: "/plugin-configuration/data-expose-control", icon: EyeOff },
      { id: "plugin-request-review", title: "Plugin Request Review", href: "/plugin-configuration/plugin-request-review", icon: FileSearch },
    ],
  },
  {
    id: "enhanced-data-features",
    title: "Enhanced Data features",
    href: "/enhanced-data-features",
    icon: LayoutGrid,
    subItems: [
      { id: "dataset-metadata", title: "Dataset Metadata", href: "/enhanced-data-features/dataset-metadata", icon: FileJson2 },
      { id: "history", title: "History", href: "/enhanced-data-features/history", icon: History },
      { id: "audit-log", title: "Audit Log", href: "/enhanced-data-features/audit-log", icon: FileClock },
    ],
  },
  {
    id: "terms-and-conditions",
    title: "Terms & Conditions",
    href: "/terms-and-conditions",
    icon: FileText,
    subItems: [
      { id: "tc", title: "T&C", href: "/terms-and-conditions/tc", icon: FileText },
      { id: "version-control", title: "Version Control", href: "/terms-and-conditions/version-control", icon: GitBranch },
      { id: "compliance-tracking", title: "Compliance Tracking", href: "/terms-and-conditions/compliance-tracking", icon: ShieldCheck },
    ],
  },
  {
    id: "authentication-profile",
    title: "Authentication & Profile",
    href: "/authentication-profile",
    icon: ShieldUserIcon,
    subItems: [
      { id: "profile-management", title: "Profile Management", href: "/authentication-profile/profile-management", icon: UserCog },
      { id: "notification-center", title: "Notification Center", href: "/authentication-profile/notification-center", icon: Bell },
    ],
  },
  {
    id: "community-discovery-and-membership",
    title: "Community Discovery & Membership",
    href: "/community-discovery-and-membership",
    icon: Users2,
    subItems: [
      { id: "community-discovery-portal", title: "Community Discovery Portal", href: "/community-discovery-and-membership/community-discovery-portal", icon: Search },
      // { id: "community-details-viewer", title: "Community Details Viewer", href: "/community-discovery-and-membership/community-details-viewer", icon: Library },
      { id: "membership-request-interface", title: "Membership Request Interface", href: "/community-discovery-and-membership/membership-request-interface", icon: UserPlus },
      { id: "membership-status-tracking", title: "Membership Status Tracking", href: "/community-discovery-and-membership/membership-status-tracking", icon: Users },
    ],
  },
  {
    id: "data-interaction",
    title: "Data Interaction",
    href: "/data-interaction",
    icon: BetweenHorizonalEndIcon,
    subItems: [
      { id: "community-data-viewer", title: "Community Data Viewer", href: "/data-interaction/community-data-viewer", icon: Eye },
      { id: "basic-data-viewing", title: "Basic Data Viewing", href: "/data-interaction/basic-data-viewing", icon: FileText },
      { id: "data-visualization-tools", title: "Data Visualization Tools", href: "/data-interaction/data-visualization-tools", icon: BarChart3 },
      { id: "audit-log-viewer", title: "Audit Log Viewer", href: "/data-interaction/audit-log-viewer", icon: FileClock },
      { id: "basic-log-viewing", title: "Basic Log Viewing", href: "/data-interaction/basic-log-viewing", icon: History },
      { id: "usage-pattern-analysis", title: "Usage Pattern Analysis", href: "/data-interaction/usage-pattern-analysis", icon: Activity },
    ],
  },
  {
    id: "simplified-data-viewing",
    title: "Simplified Data Viewing",
    href: "/simplified-data-viewing",
    icon: NotebookTabsIcon,
    subItems: [
      { id: "community-specific-data-access", title: "Community Specific Data Access", href: "/simplified-data-viewing/community-specific-data-access", icon: KeyRound },
      { id: "basic-community-insight", title: "Basic Community Insight", href: "/simplified-data-viewing/basic-community-insight", icon: Lightbulb },
    ],
  },
];


export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("overview")
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
      className={`flex flex-col bg-background border-r border-border transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'
        }`}
    >
      <div className={`flex items-center p-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <Link href="/">
            <h1 className="text-xl font-bold text-mono-caps text-primary">
              Data Trust
            </h1>
          </Link>
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

      <nav className="flex-1 px-4 pb-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isMenuOpen = openMenu === item.title;

          return (
            <div key={item.id} onClick={() => setActiveSection(item.id)}>
              <button
                className={`w-full flex justify-between items-center gap-3 p-3 rounded transition-colors ${activeSection === item.id
                    ? "bg-orange-500 text-white"
                    : " dark:hover:text-white hover:bg-neutral-800"
                  }`}
                onClick={() => toggleMenu(item.title)}
              >
                <div 
                className="flex items-center justify-start gap-3">
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span className="font-medium text-mono-caps text-start text-sm">{item.title}</span>}
                </div>
                {!isCollapsed && item.subItems.length > 0 && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''
                      }`}
                  />
                )}
              </button>
              {!isCollapsed && isMenuOpen && (
                <div className={`pl-8 mt-2 space-y-2 border-l-2 border-primary/20 ml-4 `}>
                  {item.subItems.map((sub) => (
                    <Link
                      href={sub.href}
                      key={sub.id}
                      className={`flex items-center gap-3 p-3 rounded text-sm transition-colors text-mono-caps ${
                        activeSection === sub.id
                          ? "bg-orange-500 text-white"
                          : "text-foreground/80 hover:text-foreground hover:bg-neutral-800"
                      }`}
                    >
                      <sub.icon className="h-4 w-4 shrink-0" />
                      {sub.title}
                    </Link>
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