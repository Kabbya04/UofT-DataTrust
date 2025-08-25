// Role-based routing utilities

// Map role IDs to role names
const ROLE_MAPPINGS = {
  '2f3d04ee-8fb3-4013-8028-fbf03b85b485': 'community_member',
  '85ebfe4c-9078-433c-a3b9-5bc1bc0a1a83': 'researcher',
  '53331ba5-7ff9-4923-81a4-d44161f6a5d7': 'admin'
} as const

// Define default routes for each role
const ROLE_ROUTES = {
  community_member: '/community-member-wf/dashboard',
  researcher: '/researcher-wf/home',
  admin: '/community-member-wf/dashboard', // Admin uses community member interface for now
} as const

export type UserRole = keyof typeof ROLE_ROUTES

/**
 * Get role name from role ID
 */
export function getRoleFromId(roleId: string): UserRole | null {
  return ROLE_MAPPINGS[roleId as keyof typeof ROLE_MAPPINGS] || null
}

/**
 * Get the default route for a given role
 */
export function getDefaultRouteForRole(role: UserRole): string {
  return ROLE_ROUTES[role]
}

/**
 * Decode JWT token to extract user information
 * Note: This is a simple decode, not verification (verification should be done on backend)
 */
export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

/**
 * Extract role from JWT token and get appropriate route
 */
export function getRouteFromToken(accessToken: string): string {
  const decoded = decodeJWT(accessToken)
  
  if (!decoded || !decoded.role) {
    // Fallback to community member route if no role found
    return ROLE_ROUTES.community_member
  }
  
  const roleFromToken = getRoleFromId(decoded.role)
  
  if (!roleFromToken) {
    // Fallback to community member route if role not recognized
    return ROLE_ROUTES.community_member
  }
  
  return getDefaultRouteForRole(roleFromToken)
}

/**
 * Get user role information from stored token
 */
export function getCurrentUserRole(): UserRole | null {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem('access_token')
  if (!token) return null
  
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.role) return null
  
  return getRoleFromId(decoded.role)
}

/**
 * Get role name by ID for display purposes
 */
export function getRoleDisplayName(roleId: string): string {
  const role = getRoleFromId(roleId)
  switch (role) {
    case 'community_member': return 'Community Member'
    case 'researcher': return 'Researcher'  
    case 'admin': return 'Admin'
    default: return 'User'
  }
}