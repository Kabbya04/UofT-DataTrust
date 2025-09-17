"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "@/app/lib/api"
import { useAuth } from "./auth-context"

interface Community {
  id: string
  name: string
  description: string | null
  logo: string | null
  community_category: {
    id: string
    name: string
  }
  admins?: Array<{
    id: string
    name: string
    email: string
  }>
  users?: Array<{
    id: string
    name: string
    email: string
  }>
  isJoined?: boolean
  memberCount?: number
  tags?: string[]
  coverImage?: string
}

interface JoinRequest {
  id: string
  user_id: string
  community_id: string
  message?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  user: {
    id: string
    name: string
    email: string
  }
}

interface CommunityContextType {
  communities: Community[]
  loading: boolean
  error: string | null
  toggleJoinStatus: (communityId: string) => void
  getCommunity: (communityId: string) => Community | undefined
  submitJoinRequest: (communityId: string, message: string) => Promise<{ success: boolean; message?: string }>
  getJoinRequests: (communityId: string) => Promise<JoinRequest[]>
  getAllJoinRequests: () => Promise<JoinRequest[]>
  approveJoinRequest: (requestId: string) => Promise<{ success: boolean; message?: string }>
  rejectJoinRequest: (requestId: string, reason?: string, adminMessage?: string) => Promise<{ success: boolean; message?: string }>
  fetchCommunities: () => Promise<void>
  refreshCommunities: () => Promise<void>
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined)


export function CommunityProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, isLoading: authLoading } = useAuth()

  // Add token refresh functionality
  const refreshAuthToken = async (): Promise<string | null> => {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      
      if (!refreshToken) {
        return null;
      }
      
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const data = await response.json();
      const newAccessToken = data.access_token;
      
      if (typeof window !== 'undefined' && newAccessToken) {
        localStorage.setItem('access_token', newAccessToken);
      }
      
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  };

  const fetchCommunities = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to fetch communities
      let response;
      try {
        response = await api.communities.getAll(1, 50)
      } catch (error: any) {
        // If it's a 401 error, try to refresh the token and retry
        if (error.name === 'ApiError' && error.status === 401) {
          const newToken = await refreshAuthToken();
          if (newToken) {
            // Retry the request with the new token
            response = await api.communities.getAll(1, 50)
          } else {
            // If token refresh failed, redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/sign-in';
            }
            return;
          }
        } else {
          throw error;
        }
      }
      
      // Get current user ID from auth context
      const currentUserId = user?.id
      
      // Ensure response.data is an array before trying to map
      let communitiesArray = [];
      if (Array.isArray(response.data)) {
        communitiesArray = response.data;
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data && 
                 // Type guard to check if 'data' property exists and is an array
                 'data' in (response.data as Record<string, any>) && 
                 Array.isArray((response.data as Record<string, any>).data)) {
        // Handle case where data is wrapped in another data object
        communitiesArray = (response.data as Record<string, any>).data;
      } else if (response.data && typeof response.data === 'object') {
        // Handle case where the whole response is the array
        communitiesArray = Object.values(response.data).filter(item => typeof item === 'object');
      } else {
        console.warn('Unexpected response format:', response);
        communitiesArray = [];
      }
      
      const transformedCommunities: Community[] = communitiesArray.map((community: any) => {
        // Check if current user is in the community's users or admins array
        const isUserMember = community.users?.some((user: any) => user?.id === currentUserId) || false
        const isUserAdmin = community.admins?.some((admin: any) => admin?.id === currentUserId) || false
        const isJoined = isUserMember || isUserAdmin
        
        console.log(`Community ${community.name || 'Unknown'}: user ${currentUserId} is ${isJoined ? 'joined' : 'not joined'}`)
        console.log(`  - Community users:`, community.users?.map((u: any) => u?.id).filter(Boolean) || [])
        console.log(`  - Community admins:`, community.admins?.map((a: any) => a?.id).filter(Boolean) || [])
        console.log(`  - Current user ID:`, currentUserId)
        console.log(`  - Is member:`, isUserMember, `Is admin:`, isUserAdmin)
        
        return {
          id: community.id || '',
          name: community.name || 'Unnamed Community',
          description: community.description || '',
          logo: community.logo || null,
          community_category: {
            id: community.community_category?.id || '',
            name: community.community_category?.name || 'Uncategorized'
          },
          admins: community.admins || [],
          users: community.users || [],
          isJoined, // Actually check if user is a member
          memberCount: (community.users?.length || 0) + (community.admins?.length || 0), // Real member count
          tags: [community.community_category?.name || 'Uncategorized'], // Use category as tag
          coverImage: community.logo || '/placeholder-np7tk.png'
        }
      }).filter((community: Community) => community.id) // Filter out communities without valid IDs
      
      setCommunities(transformedCommunities)
    } catch (err) {
      console.error('Failed to fetch communities:', err)
      setError('Failed to load communities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only fetch communities when auth is not loading
    if (!authLoading) {
      fetchCommunities()
    }
  }, [user, authLoading]) // Re-fetch when user changes or auth loading completes

  const toggleJoinStatus = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((community) =>
        community.id === communityId ? { ...community, isJoined: !community.isJoined } : community,
      ),
    )
  }

  const getCommunity = (communityId: string) => {
    return communities.find((community) => community.id === communityId)
  }

  const submitJoinRequest = async (communityId: string, message: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Get current user ID from auth context
      const currentUserId = user?.id
      if (!currentUserId) {
        throw new Error('User not authenticated')
      }
      
      console.log('Submitting join request:', { communityId, currentUserId, message })
      
      try {
        // Try the join request admin system first (where admins can see requests)
        const response = await api.joinRequests.create(communityId, currentUserId, message)
        console.log('Join request submitted to admin system via API:', response)
        
        
        return { success: true, message: 'Join request submitted successfully!' }
      } catch (apiError) {
        console.log('Admin system API failed, trying community system:', apiError)
        
        // Fallback to community system if admin system fails
        try {
          const response = await api.communities.requestJoin(communityId, currentUserId, message)
          console.log('Join request submitted to community system via API:', response)
          return { success: true, message: 'Join request submitted successfully!' }
        } catch (communityApiError) {
          console.error('Failed to submit join request:', communityApiError)
          throw { success: false, message: 'Failed to submit join request' }
        }
      }
    } catch (err) {
      console.error('Failed to submit join request:', err)
      setError('Failed to submit join request')
      // Return error response format
      throw { success: false, message: 'Failed to submit join request' }
    } finally {
      setLoading(false)
    }
  }

  const getJoinRequests = async (communityId: string): Promise<JoinRequest[]> => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching join requests for community:', communityId)
      
      try {
        // Try the real API first
        const response = await api.communities.getJoinRequests(communityId)
        console.log('Join requests response from API:', response)
        
        // Check if response has the expected structure
        if (response && response.data && Array.isArray(response.data)) {
          return response.data
        }
              
        return []
      } catch (apiError) {
        console.log('API failed, using mock service:', apiError)
        throw { success: false, message: 'Failed to fetch join requests' }
      }
    } catch (err) {
      console.error('Failed to fetch join requests:', err)
      setError('Failed to fetch join requests')
      // Instead of throwing, return empty array so UI doesn't break
      return []
    } finally {
      setLoading(false)
    }
  }

  const approveJoinRequest = async (requestId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Approving join request:', requestId)
      
      try {
        // Try the real API first
        const response = await api.joinRequests.approve(requestId)
        console.log('Join request approved successfully via API:', response)
        
        
        // Refresh communities to update membership status
        setTimeout(() => {
          fetchCommunities()
        }, 1000) // Give backend time to process the membership addition
        
        return response.data
      } catch (apiError) {
        console.log('API failed, using mock service:', apiError)
        throw { success: false, message: 'Failed to approve join request' }
      }
    } catch (err) {
      console.error('Failed to approve join request:', err)
      setError('Failed to approve join request')
      throw { success: false, message: 'Failed to approve join request' }
    } finally {
      setLoading(false)
    }
  }

  const rejectJoinRequest = async (requestId: string, reason?: string, adminMessage?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Rejecting join request:', { requestId, reason, adminMessage })
      
      try {
        // Try the real API first
        const response = await api.joinRequests.reject(requestId, reason, adminMessage)
        console.log('Join request rejected successfully via API:', response)
        
        
        return response.data
      } catch (apiError) {
        console.log('API failed, using mock service:', apiError)
        throw { success: false, message: 'Failed to reject join request' }
      }
    } catch (err) {
      console.error('Failed to reject join request:', err)
      setError('Failed to reject join request')
      throw { success: false, message: 'Failed to reject join request' }
    } finally {
      setLoading(false)
    }
  }

  const getAllJoinRequests = async (): Promise<JoinRequest[]> => {
    try {
      setLoading(true)
      setError(null)
      
      // Use the admin endpoint to fetch all join requests
      const adminResponse = await api.joinRequests.getAll()
      
      // Handle different response formats
      let joinRequests: any[] = []
      if (adminResponse && adminResponse.data && Array.isArray(adminResponse.data)) {
        joinRequests = adminResponse.data
      } else if (adminResponse && Array.isArray(adminResponse)) {
        joinRequests = adminResponse
      }
      
      // Transform the API response to match frontend expectations
      const transformedRequests: JoinRequest[] = joinRequests.map(req => ({
        id: req.id,
        user_id: req.user_id,
        community_id: req.community_id,
        message: req.message || '',
        status: req.status as 'pending' | 'approved' | 'rejected',
        created_at: req.created_at || new Date().toISOString(),
        user: req.user || {
          id: req.user_id,
          name: 'Unknown User',
          email: 'unknown@example.com'
        }
      }))
      
      return transformedRequests
    } catch (err) {
      console.error('Failed to fetch all join requests:', err)
      setError('Failed to fetch join requests')
      return []
    } finally {
      setLoading(false)
    }
  }

  const refreshCommunities = async () => {
    // Force refresh by clearing cache and refetching
    await fetchCommunities()
  }

  return (
    <CommunityContext.Provider value={{ 
      communities, 
      loading, 
      error, 
      toggleJoinStatus, 
      getCommunity, 
      submitJoinRequest, 
      getJoinRequests,
      getAllJoinRequests,
      approveJoinRequest,
      rejectJoinRequest,
      fetchCommunities,
      refreshCommunities
    }}>
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity() {
  const context = useContext(CommunityContext)
  if (context === undefined) {
    throw new Error("useCommunity must be used within a CommunityProvider")
  }
  return context
}
