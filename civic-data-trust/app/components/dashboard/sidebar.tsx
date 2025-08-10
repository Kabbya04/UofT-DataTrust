'use client';

import React, { useState, useEffect, useRef, Children } from 'react';
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
  Users,
  Users2,
  LucideChartBarDecreasing,
  BetweenHorizonalEndIcon,
  UserPenIcon,
  ShieldUserIcon,
  NotebookTabsIcon,
  FileIcon,
} from 'lucide-react';


const menuItems = [
  {
    id: "data-center",
    title: "Data Center",
    href: "/data-center",
    icon: Database,
    subItems: [
      { id: "upload-dataset", 
        title: "Upload dataset", 
        href: "/data-center/upload-dataset", icon: FileIcon 
      },
      { id: "file-management", 
        title: "File Management", 
        href: "/data-center/file-management", icon: FileIcon 
      },
      { id: "metadata-configuration", 
        title: "Metadata Configuration", 
        href: "/data-center/metadata-configuration", 
        icon: FileIcon },
      { id: "data-history", 
        title: "Data History", 
        href: "/data-center/data-history", 
        icon: FileIcon 
      },
    ],
  },
  {
    id: "request-center",
    title: "Request Center",
    href: "/request-center",
    icon: FileCheck,
    subItems: [
      { id: "request-review", 
        title: "Request Review", 
        href: "/request-center/request-review", 
        icon: FileIcon 
      },
      { id: "request-history", 
        title: "Request History", 
        href: "/request-center/request-history", 
        icon: FileIcon 
      },
    ],
  },
  {
    id: "plugin-configuration",
    title: "Plugin Configuration",
    href: "/plugin-configuration",
    icon: SlidersHorizontal,
    subItems: [
      { id: "access-control", title: "Access Control", href: "/plugin-configuration/access-control", icon: FileIcon },
      { id: "data-expose-control", title: "Data Expose Control", href: "/plugin-configuration/data-expose-control", icon: FileIcon },
      { id: "plugin-request-review", title: "Plugin Request Review", href: "/plugin-configuration/plugin-request-review", icon: FileIcon },
    ],
  },
  {
    id: "enhanced-data-features",
    title: "Enhanced Data features",
    href: "/enhanced-data-features",
    icon: LayoutGrid,
    subItems: [
      { id: "dataset-metadata", title: "Dataset Metadata", href: "/enhanced-data-features/dataset-metadata", icon: FileIcon },
      { id: "history", title: "History", href: "/enhanced-data-features/history", icon: FileIcon },
      { id: "audit-log", title: "Audit Log", href: "/enhanced-data-features/audit-log", icon: FileIcon },
    ],
  },
  {
    id: "terms-and-conditions",
    title: "Terms & Conditions",
    href: "/terms-and-conditions",
    icon: FileText,
    subItems: [
      { id: "tc", title: "T&C", href: "/terms-and-conditions/tc", icon: FileIcon },
      { id: "version-control", title: "Version Control", href: "/terms-and-conditions/version-control", icon: FileIcon },
      { id: "compliance-tracking", title: "Compliance Tracking", href: "/terms-and-conditions/compliance-tracking", icon: FileIcon },
    ],
  },
  {
    id: "authentication-profile",
    title: "Authentication & Profile",
    href: "/authentication-profile",
    icon: ShieldUserIcon,
    subItems: [
      { id: "login-screen", 
        title: "Login Screen", 
        href: "/authentication-profile/login-screen", 
        icon: FileIcon 
      },
      { id: "profile-management", 
        title: "Profile Management", 
        href: "/authentication-profile/profile-management", 
        icon: FileIcon 
      },
      { id: "notification-center", 
        title: "Notification Center", 
        href: "/authentication-profile/notification-center", 
        icon: FileIcon 
      },
    ],
  },
  {
    id: "community-discovery-and-membership",
    title: "Community Discovery & Membership",
    href: "/community-discovery-and-membership",
    icon: Users2,
    subItems: [
      { id: "community-discovery-portal", title: "Community Discovery Portal", href: "/community-discovery-and-membership/community-discovery-portal", 
        icon: FileIcon 
      },
      { 
        id: "community-details-viewer", 
        title: "Community Details Viewer", href: "/community-discovery-and-membership/community-details-viewer", 
        icon: FileIcon 
      },
      { 
        id: "membership-request-interface", title: "Membership Request Interface", href: "/community-discovery-and-membership/membership-request-interface", icon: FileIcon },
      { 
        id: "membership-status-tracking", title: "Membership Status Tracking", href: "/community-discovery-and-membership/membership-status-tracking", icon: FileIcon },
    ],
  },
  {
    id: "data-interaction",
    title: "Data Interaction",
    href: "/data-interaction",
    icon: BetweenHorizonalEndIcon,
    subItems: [
      { id: "community-data-viewer", title: "Community Data Viewer", href: "/data-interaction/community-data-viewer", icon: FileIcon },
      { id: "basic-data-viewing", title: "Basic Data Viewing", href: "/data-interaction/basic-data-viewing", icon: FileIcon },
      { id: "data-visualization-tools", title: "Data Visualization Tools", href: "/data-interaction/data-visualization-tools", icon: FileIcon },
      { id: "audit-log-viewer", title: "Audit Log Viewer", href: "/data-interaction/audit-log-viewer", icon: FileIcon },
      { id: "basic-log-viewing", title: "Basic Log Viewing", href: "/data-interaction/basic-log-viewing", icon: FileIcon },
      { id: "usage-pattern-analysis", title: "Usage Pattern Analysis", href: "/data-interaction/usage-pattern-analysis", icon: FileIcon },
    ],
  },
  {
    id: "simplified-data-viewing",
    title: "Simplified Data Viewing",
    href: "/simplified-data-viewing",
    icon: NotebookTabsIcon,
    subItems: [
      {
        id: "community-specific-data-access",
        title: "Community Specific Data Access",
        href: "/simplified-data-viewing/community-specific-data-access",
        icon: FileIcon
      },
      {
        id: "basic-community-insight",
        title: "Basic Community Insight",
        href: "/simplified-data-viewing/basic-community-insight",
        icon: FileIcon
      },
    ],
  },
];




// const menuItems = [
//   // ... (menuItems array remains the same)
//   {
//     id:"data-center",
//     title: 'Data Center',
//     href: '/data-center',
//     icon: Database,
//     subItems: [
//       'Upload dataset', 
//       'File Management',
//       'Metadata Configuration', 
//       'Data History'
//     ],
//   },
//   {
//     id:'request-center',
//     title: 'Request Center',
//     href: '/request-center',
//     icon: FileCheck,
//     subItems: ['Request Review', 'Request History'],
//   },
//   {
//     id:'plugin-configuration',
//     title: 'Plugin Configuration',
//     href: '/plugin-configuration',
//     icon: SlidersHorizontal,
//     subItems: ['Access Control', 'Data Expose Control', 'Plugin Request Review'],
//   },
//   {
//     id:'enhanced-data-features',
//     title: 'Enhanced Data features',
//     href: '/enhanced-data-features',
//     icon: LayoutGrid,
//     subItems: ['Dataset Metadata', 'History', 'Audit Log'],
//   },
//   {
//     id:'terms-and-conditions',
//     title: 'Terms & Conditions',
//     href: '/terms-and-conditions',
//     icon: FileText,
//     subItems: ['T&C', 'Version Control', 'Compliance Tracking'],
//   },
//    {
//     id:'authentication-profile',
//     title: 'Authentication & Profile',
//     href: '/authentication-profile',
//     icon: ShieldUserIcon,
//     subItems: ['Login Screen', 'Profile Management', 'Notification Center'],
//   },
//   {
//     id:'community-discovery-and-membership',
//     title: 'Community Discovery & Membership',
//     href: '/community-discovery-and-membership',
//     icon: Users2,
//     subItems: ['Community Discovery Portal', 'Community Details Viewer', 'Membership Request Interface','Membership Status Tracking'],
//   },
//   {
//     id:'data-interaction',
//     title: 'Data Interaction',
//     href: '/data-interaction',
//     icon: BetweenHorizonalEndIcon,
//     subItems: ['Community Data Viewer', 'Basic Data Viewing', 'Data Visualization Tools','Audit Log Viewer','Basic Log Viewing','Usage Pattern Analysis"'],
//   },
//   {
//     id:'simplified-data-viewing',
//     title: 'Simplified Data Viewing',
//     href: '/simplified-data-viewing',
//     icon: NotebookTabsIcon,
//     subItems: ['Community Specific Data Access', 'Basic Community Insight'],
//   },
// ];


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
            <div key={item.id} onClick={() => setActiveSection(item.id)}>
              <button
                className={`w-full flex justify-between items-center gap-3 p-3 rounded transition-colors ${activeSection === item.id
                    ? "bg-orange-500 text-white"
                    : "text-neutral-800 hover:text-white hover:bg-neutral-800"
                  }`}
                onClick={() => toggleMenu(item.title)}
              >
                <Link href={item.href} className="flex items-center justify-start gap-3">
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span className="font-medium text-mono-caps text-sm">{item.title}</span>}
                </Link>
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
                    <Link href={sub.href}
                      key={sub.id}
                      className={`block text-sm text-muted-foreground hover:text-foreground gap-3 p-3 rounded transition-colors ${activeSection === sub.id
                    ? "bg-orange-500 text-white"
                    : "text-neutral-800 hover:text-white hover:bg-neutral-800"
                  }`}
                    >
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