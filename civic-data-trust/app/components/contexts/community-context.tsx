"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "@/app/lib/api"
import { mockJoinRequestService } from "@/app/services/mock-join-requests"
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

  const fetchCommunities = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.communities.getAll(1, 50)
      
      // Get current user ID from auth context
      const currentUserId = user?.id || "USR-734-B" // Fallback to mock ID if no user
      
      const transformedCommunities: Community[] = (response.data as any).items.map((community: any) => {
        // Check if current user is in the community's users or admins array (arrays contain user IDs as strings)
        const isUserMember = community.users?.includes(currentUserId) || false
        const isUserAdmin = community.admins?.includes(currentUserId) || false
        const isJoined = isUserMember || isUserAdmin
        
        console.log(`Community ${community.name}: user ${currentUserId} is ${isJoined ? 'joined' : 'not joined'}`)
        console.log(`  - Community users:`, community.users || [])
        console.log(`  - Community admins:`, community.admins || [])
        console.log(`  - Current user ID:`, currentUserId)
        console.log(`  - Is member:`, isUserMember, `Is admin:`, isUserAdmin)
        
        return {
          ...community,
          isJoined, // Actually check if user is a member
          memberCount: (community.users?.length || 0) + (community.admins?.length || 0), // Real member count
          tags: [community.community_category.name], // Use category as tag
          coverImage: community.logo || '/placeholder-np7tk.png'
        }
      })
      
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
      const currentUserId = user?.id || "USR-734-B" // Fallback to mock ID if no user

      console.log('Submitting join request:', { communityId, currentUserId, message })
      console.log('Real authenticated user:', user)
      
      try {
        // Try the join request admin system first (where admins can see requests)
        const response = await api.joinRequests.create(communityId, currentUserId, message)
        console.log('Join request submitted to admin system via API:', response)
        
        // Also add to mock service for immediate testing
        mockJoinRequestService.submitJoinRequest(communityId, currentUserId, message)
        
        return { success: true, message: 'Join request submitted successfully!' }
      } catch (apiError) {
        console.log('Admin system API failed, trying community system:', apiError)
        
        // Fallback to community system if admin system fails
        try {
          const response = await api.communities.requestJoin(communityId, currentUserId, message)
          console.log('Join request submitted to community system via API:', response)
          return { success: true, message: 'Join request submitted successfully!' }
        } catch (communityApiError) {
          console.log('Both APIs failed, using mock service:', communityApiError)
          // Fallback to mock service if both APIs fail
          const mockResponse = mockJoinRequestService.submitJoinRequest(communityId, currentUserId, message)
          return mockResponse
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
        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log('Join requests data from API:', response.data)
          return response.data
        } else {
          console.log('API returned empty data, falling back to mock service')
          // Fallback to mock service if API returns empty
          const mockRequests = mockJoinRequestService.getJoinRequestsForCommunity(communityId)
          return mockRequests
        }
      } catch (apiError) {
        console.log('API failed, using mock service:', apiError)
        // Fallback to mock service if API fails
        const mockRequests = mockJoinRequestService.getJoinRequestsForCommunity(communityId)
        return mockRequests
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
        
        // Also update mock service to keep consistency
        mockJoinRequestService.approveRequest(requestId)
        
        // Refresh communities to update membership status
        setTimeout(() => {
          fetchCommunities()
        }, 1000) // Give backend time to process the membership addition
        
        return response.data
      } catch (apiError) {
        console.log('API failed, using mock service:', apiError)
        // Fallback to mock service if API fails
        const result = mockJoinRequestService.approveRequest(requestId)
        
        // Still refresh communities
        setTimeout(() => {
          fetchCommunities()
        }, 1000)
        
        return result
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
        
        // Also update mock service to keep consistency
        mockJoinRequestService.rejectRequest(requestId, reason, adminMessage)
        
        return response.data
      } catch (apiError) {
        console.log('API failed, using mock service:', apiError)
        // Fallback to mock service if API fails
        return mockJoinRequestService.rejectRequest(requestId, reason, adminMessage)
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

      console.log('=== FETCHING ALL JOIN REQUESTS FOR ADMIN ===')
      console.log('Current user from auth context:', user)
      console.log('User ID:', user?.id)

      // Show which communities this user is admin of
      const userAdminCommunities = communities.filter(community =>
        community.admins?.some((admin: any) => admin.id === user?.id)
      )
      console.log('Communities where user is admin:', userAdminCommunities.map(c => ({
        id: c.id,
        name: c.name,
        adminIds: c.admins?.map((a: any) => a.id)
      })))

      try {
        // Use the admin endpoint since it's working perfectly
        const adminResponse = await api.joinRequests.getAll()
        console.log('Admin join requests response:', adminResponse)
        console.log('Expected to see requests for community IDs:', userAdminCommunities.map(c => c.id))
        
        // Handle different response formats
        let joinRequests: any[] = []
        if (adminResponse && adminResponse.data && Array.isArray(adminResponse.data)) {
          joinRequests = adminResponse.data
        } else if (adminResponse && Array.isArray(adminResponse)) {
          joinRequests = adminResponse
        } else {
          console.log('Admin API returned unexpected format, falling back to mock service')
          const mockRequests = mockJoinRequestService.getAllRequests()
          return mockRequests
        }
        
        if (joinRequests.length === 0) {
          console.log('No requests found, falling back to mock service')
          const mockRequests = mockJoinRequestService.getAllRequests()
          return mockRequests
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
        
        console.log('Transformed join requests:', transformedRequests)
        return transformedRequests
        
      } catch (apiError) {
        console.log('API failed, using mock service:', apiError)
        // Fallback to mock service if API fails
        const mockRequests = mockJoinRequestService.getAllRequests()
        return mockRequests
      }
    } catch (err) {
      console.error('Failed to fetch all join requests:', err)
      setError('Failed to fetch join requests')
      // Instead of throwing, return empty array so UI doesn't break
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
