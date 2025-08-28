"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[]
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
  updateBreadcrumb: (index: number, item: Partial<BreadcrumbItem>) => void
  addBreadcrumb: (item: BreadcrumbItem) => void
  removeBreadcrumb: (index: number) => void
  clearBreadcrumbs: () => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined)

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [breadcrumbs, setBreadcrumbsState] = useState<BreadcrumbItem[]>([])

  const setBreadcrumbs = useCallback((newBreadcrumbs: BreadcrumbItem[]) => {
    setBreadcrumbsState(newBreadcrumbs)
  }, [])

  const updateBreadcrumb = useCallback((index: number, item: Partial<BreadcrumbItem>) => {
    setBreadcrumbsState(prev => 
      prev.map((breadcrumb, i) => 
        i === index ? { ...breadcrumb, ...item } : breadcrumb
      )
    )
  }, [])

  const addBreadcrumb = useCallback((item: BreadcrumbItem) => {
    setBreadcrumbsState(prev => [...prev, item])
  }, [])

  const removeBreadcrumb = useCallback((index: number) => {
    setBreadcrumbsState(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearBreadcrumbs = useCallback(() => {
    setBreadcrumbsState([])
  }, [])

  return (
    <BreadcrumbContext.Provider value={{
      breadcrumbs,
      setBreadcrumbs,
      updateBreadcrumb,
      addBreadcrumb,
      removeBreadcrumb,
      clearBreadcrumbs
    }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext)
  if (context === undefined) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider")
  }
  return context
}

// Define routes that are just organizational sections (no actual pages)
const organizationalRoutes = new Set([
  '/community-discovery-and-membership',
  '/authentication-profile', 
  '/data-center',
  '/request-center',
  '/plugin-configuration',
  '/enhanced-data-features',
  '/terms-and-conditions',
  '/data-interaction',
  '/simplified-data-viewing'
])

// Define actual pages that exist
const validPageRoutes = new Set([
  '/',
  '/dashboard',
  '/authentication-profile/profile-management',
  '/authentication-profile/notification-center',
  '/authentication-profile/login-screen',
  '/community-discovery-and-membership/community-discovery-portal',
  '/community-discovery-and-membership/discover-community-wf',
  '/community-discovery-and-membership/my-communities-wf',
  '/community-discovery-and-membership/data-usage-wf',
  '/community-discovery-and-membership/statistics-wf',
  '/community-discovery-and-membership/popular-wf',
  '/community-discovery-and-membership/membership-request-interface',
  '/community-discovery-and-membership/membership-status-tracking',
  '/data-center/upload-dataset',
  '/data-center/file-management',
  '/data-center/metadata-configuration',
  '/data-center/data-history',
  '/request-center/request-review',
  '/request-center/request-history',
  '/plugin-configuration/access-control',
  '/plugin-configuration/data-expose-control',
  '/plugin-configuration/plugin-request-review',
  '/enhanced-data-features/dataset-metadata',
  '/enhanced-data-features/history',
  '/enhanced-data-features/audit-log',
  '/terms-and-conditions/tc',
  '/terms-and-conditions/version-control',
  '/terms-and-conditions/compliance-tracking',
  '/data-interaction/community-data-viewer',
  '/data-interaction/basic-data-viewing',
  '/data-interaction/data-visualization-tools',
  '/data-interaction/audit-log-viewer',
  '/data-interaction/usage-pattern-analysis',
  '/data-interaction/basic-log-viewing',
  '/simplified-data-viewing/community-specific-data-access',
  '/simplified-data-viewing/basic-community-insight'
])

// Route name mappings for better display names
const routeNameMap: Record<string, string> = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  // Organizational sections (will be non-clickable)
  '/community-discovery-and-membership': 'Community Discovery & Membership',
  '/authentication-profile': 'Authentication & Profile', 
  '/data-center': 'Data Center',
  '/request-center': 'Request Center',
  '/plugin-configuration': 'Plugin Configuration',
  '/enhanced-data-features': 'Enhanced Data Features',
  '/terms-and-conditions': 'Terms & Conditions',
  '/data-interaction': 'Data Interaction',
  '/simplified-data-viewing': 'Simplified Data Viewing',
  // Actual pages
  '/community-discovery-portal': 'Community Discovery Portal',
  '/discover-community-wf': 'Discover Communities',
  '/my-communities-wf': 'My Communities',
  '/data-usage-wf': 'Data Usage',
  '/statistics-wf': 'Statistics',
  '/popular-wf': 'Popular',
  '/community-details-wf': 'Community Details',
  '/profile-management': 'Profile Management',
  '/notification-center': 'Notification Center',
  '/upload-dataset': 'Upload Dataset',
  '/file-management': 'File Management',
  '/metadata-configuration': 'Metadata Configuration',
  '/data-history': 'Data History',
  '/request-review': 'Request Review',
  '/request-history': 'Request History',
  '/access-control': 'Access Control',
  '/data-expose-control': 'Data Exposure Control',
  '/plugin-request-review': 'Plugin Request Review',
  '/dataset-metadata': 'Dataset Metadata',
  '/history': 'History',
  '/audit-log': 'Audit Log',
  '/tc': 'Terms & Conditions',
  '/version-control': 'Version Control',
  '/compliance-tracking': 'Compliance Tracking',
  '/community-data-viewer': 'Community Data Viewer',
  '/basic-data-viewing': 'Basic Data Viewing',
  '/data-visualization-tools': 'Data Visualization Tools',
  '/audit-log-viewer': 'Audit Log Viewer',
  '/usage-pattern-analysis': 'Usage Pattern Analysis',
  '/basic-log-viewing': 'Basic Log Viewing',
  '/community-specific-data-access': 'Community Specific Data Access',
  '/basic-community-insight': 'Basic Community Insight',
  '/membership-request-interface': 'Membership Request Interface',
  '/membership-status-tracking': 'Membership Status Tracking',
  '/login-screen': 'Login Screen'
}

// Utility function to generate breadcrumbs from pathname
export function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []
  
  // Special case: if we're on root or dashboard, just show appropriate single breadcrumb
  if (pathname === '/' || pathname === '/dashboard') {
    breadcrumbs.push({ 
      label: 'Dashboard', 
      isActive: true 
    })
    return breadcrumbs
  }
  
  // For all pages, start with "Dashboard" that links to /dashboard
  breadcrumbs.push({ label: 'Dashboard', href: '/dashboard' })
  
  // Generate breadcrumbs from path segments
  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    
    // Get custom name or convert segment to readable label  
    const customName = routeNameMap[currentPath] || routeNameMap[`/${segment}`]
    let label = customName || segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    // Handle dynamic routes (e.g., /community-details-wf/[id])
    if (segment.match(/^\d+$/) && pathname.includes('community-details-wf')) {
      label = 'Data Science Enthusiasts' // This would be dynamic in a real app
      breadcrumbs.push({
        label,
        isActive: true
      })
      return
    }
    
    // Special handling for community-details-wf - don't create a link since it requires an ID
    if (segment === 'community-details-wf') {
      label = 'Community Details'
      breadcrumbs.push({
        label,
        href: undefined, // No link because this route requires an ID
        isActive: false
      })
      return
    }
    
    // Determine if this should be clickable
    const isOrganizational = organizationalRoutes.has(currentPath)
    const isValidPage = validPageRoutes.has(currentPath)
    
    // Create breadcrumb item
    breadcrumbs.push({
      label,
      href: isLast ? undefined : (isOrganizational ? undefined : (isValidPage ? currentPath : undefined)),
      isActive: isLast
    })
  })
  
  return breadcrumbs
}