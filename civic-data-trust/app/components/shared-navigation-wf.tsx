"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search, Home, Star, Compass, Globe, Gamepad2, Laptop, Film, Music, Pill, Settings, ChevronDown, User, LogOut } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Input } from "./ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu"
import { SearchProvider, useSearch } from "./contexts/search-context"
import { UserProvider } from "./contexts/user-context"

// Left sidebar categories data
const sidebarCategories = [
  { id: 'dashboard', name: 'Dashboard', icon: Home, href: '/community-member-wf' },
  { id: 'home', name: 'Home', icon: Home, href: '/community-member-wf/community-discovery-and-membership/community-discovery-portal' },
  { id: 'popular', name: 'Popular', icon: Star, href: '/community-member-wf/community-discovery-and-membership/popular-wf' },
  { id: 'discover', name: 'Discover', icon: Compass, href: '/community-member-wf/community-discovery-and-membership/discover-community-wf' },
  { id: 'internet', name: 'Internet', icon: Globe, hasSubmenu: true },
  { id: 'games', name: 'Games', icon: Gamepad2, hasSubmenu: true },
  { id: 'technology', name: 'Technology', icon: Laptop, hasSubmenu: true },
  { id: 'movies', name: 'Movies', icon: Film, hasSubmenu: true },
  { id: 'pop-culture', name: 'Pop Culture', icon: Star, hasSubmenu: true },
  { id: 'television', name: 'Television', icon: Film, hasSubmenu: true },
  { id: 'medicine', name: 'Medicine', icon: Pill, hasSubmenu: true },
  { id: 'songs', name: 'Songs', icon: Music, hasSubmenu: true },
]

// Top navigation tabs
const topNavTabs = [
  { id: 'my-communities', name: 'My Communities', href: '/community-member-wf/community-discovery-and-membership/my-communities-wf' },
  { id: 'data-usage', name: 'Data Usage', href: '/community-member-wf/community-discovery-and-membership/data-usage-wf' },
  { id: 'statistics', name: 'Statistics', href: '/community-member-wf/community-discovery-and-membership/statistics-wf' },
]

interface SharedNavigationProps {
  children: React.ReactNode
}

function SharedNavigationContent({ children }: SharedNavigationProps) {
  const { searchQuery, setSearchQuery } = useSearch()
  const pathname = usePathname()
  const router = useRouter()

  // Mock user data - this would come from auth context in real app
  const user = {
    id: 'USR-734-B',
    name: 'Alex Ryder',
    email: 'alex.ryder@example.com',
    initials: 'AR'
  }

  const handleProfileClick = () => {
    router.push('/community-member-wf/authentication-profile/profile-management')
  }

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...')
  }

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href)
  }

  const getActiveCategory = () => {
    // Check for exact matches first
    if (pathname === '/community-member-wf') return 'dashboard'
    if (pathname.includes('discover-community-wf')) return 'discover'
    if (pathname.includes('popular-wf')) return 'popular'
    if (pathname.includes('community-discovery-portal')) return 'home'
    
    // Check for top navigation tabs
    if (pathname.includes('my-communities-wf')) return 'my-communities'
    if (pathname.includes('data-usage-wf')) return 'data-usage'
    if (pathname.includes('statistics-wf')) return 'statistics'
    
    return ''
  }

  return (
      <div className="min-h-screen bg-background flex">
        {/* Left Sidebar */}
        <div className="w-48 bg-card border-r border-border flex-shrink-0">
        <div className="p-4">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-lg font-bold text-foreground">Logo</h1>
          </div>

          {/* Categories */}
          <nav className="space-y-1">
            {sidebarCategories.map((category) => {
              const IconComponent = category.icon
              const isActive = getActiveCategory() === category.id
              
              return (
                <div key={category.id}>
                  {category.href ? (
                    <Link href={category.href}>
                      <button
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-4 w-4" />
                          <span>{category.name}</span>
                        </div>
                        {category.hasSubmenu && (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </Link>
                  ) : (
                    <button
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-4 w-4" />
                        <span>{category.name}</span>
                      </div>
                      {category.hasSubmenu && (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Settings at bottom */}
          <div className="mt-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Customize Feed</DropdownMenuItem>
                <DropdownMenuItem>Notification Settings</DropdownMenuItem>
                <DropdownMenuItem>Privacy Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Navigation Tabs */}
            <div className="flex items-center space-x-6">
              {topNavTabs.map((tab) => (
                <Link key={tab.id} href={tab.href}>
                  <span className={`cursor-pointer transition-colors ${
                    isActiveRoute(tab.href) 
                      ? 'font-medium text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}>
                    {tab.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Search and User */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded-md transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">En</span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export function SharedNavigationWF({ children }: SharedNavigationProps) {
  return (
    <UserProvider>
      <SearchProvider>
        <SharedNavigationContent>{children}</SharedNavigationContent>
      </SearchProvider>
    </UserProvider>
  )
}