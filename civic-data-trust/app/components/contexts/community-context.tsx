"use client"

import { createContext, useContext, useState, type ReactNode, useEffect, useCallback } from "react"
import { getAllTenants, createTenant, updateTenant, addUserToTenant, type TenantCreate, type TenantUpdate, type TenantResponse } from "@/app/lib/api"

export interface Community {
  id: string
  name: string
  description?: string
  category?: string
  tags?: string[]
  memberCount?: number
  coverImage?: string
  isJoined?: boolean
}

interface CommunityContextType {
  communities: Community[]
  loading: boolean
  error: string | null
  createCommunity: (name: string) => Promise<boolean>
  updateCommunity: (communityId: string, name: string) => Promise<boolean>
  joinCommunity: (communityId: string, userId: string) => Promise<boolean>
  toggleJoinStatus: (communityId: string) => void
  getCommunity: (communityId: string) => Community | undefined
  refreshCommunities: () => Promise<void>
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined)

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCommunities = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // First try to call without any parameters to use API defaults
      const response = await getAllTenants()
      if (response.success && response.data) {
        const categories = ['Technology', 'Games', 'Internet', 'Movies', 'Television', 'Medicine', 'Travel', 'Business']
        const tags = [
          ['tech', 'innovation'], ['gaming', 'esports'], ['web', 'social'], 
          ['film', 'entertainment'], ['tv', 'series'], ['health', 'research'],
          ['adventure', 'explore'], ['finance', 'startup']
        ]
        
        const tenants = response.data.map((tenant: TenantResponse, index: number) => {
          // Generate category based on tenant name or use a default rotation
          let category = categories[index % categories.length]
          
          // Try to assign categories based on tenant name keywords
          const name = tenant.name.toLowerCase()
          if (name.includes('tech') || name.includes('machine') || name.includes('ai') || name.includes('software')) {
            category = 'Technology'
          } else if (name.includes('game') || name.includes('gaming')) {
            category = 'Games' 
          } else if (name.includes('health') || name.includes('medicine') || name.includes('medical')) {
            category = 'Medicine'
          } else if (name.includes('travel') || name.includes('tourism')) {
            category = 'Travel'
          } else if (name.includes('business') || name.includes('finance')) {
            category = 'Business'
          }

          return {
            ...tenant,
            description: `A community focused on ${tenant.name}. Join to connect with like-minded people and share knowledge.`,
            category,
            tags: tags[index % tags.length],
            memberCount: Math.floor(Math.random() * 5000) + 50, // More realistic member counts
            coverImage: "/placeholder-np7tk.png",
            isJoined: false,
          }
        })
        setCommunities(tenants)
      } else {
        setError(response.error || 'Failed to fetch communities')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCommunities()
  }, [fetchCommunities])

  const createCommunityHandler = async (name: string): Promise<boolean> => {
    if (!name.trim()) return false
    
    try {
      const response = await createTenant({ name: name.trim() })
      if (response.success) {
        await fetchCommunities()
        return true
      } else {
        setError(response.error || 'Failed to create community')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      return false
    }
  }

  const updateCommunityHandler = async (communityId: string, name: string): Promise<boolean> => {
    if (!name.trim()) return false
    
    try {
      const response = await updateTenant(communityId, { name: name.trim() })
      if (response.success) {
        setCommunities(prev => 
          prev.map(community =>
            community.id === communityId 
              ? { ...community, name: name.trim() }
              : community
          )
        )
        return true
      } else {
        setError(response.error || 'Failed to update community')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      return false
    }
  }

  // Note: Delete functionality is not available - API doesn't support tenant deletion

  const joinCommunity = async (communityId: string, userId: string): Promise<boolean> => {
    try {
      const response = await addUserToTenant({
        tenant_id: communityId,
        user_id: userId
      })
      
      if (response.success) {
        setCommunities(prev => 
          prev.map(community =>
            community.id === communityId 
              ? { ...community, isJoined: true, memberCount: (community.memberCount || 0) + 1 }
              : community
          )
        )
        return true
      } else {
        setError(response.error || 'Failed to join community')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      return false
    }
  }

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

  const refreshCommunities = async () => {
    await fetchCommunities()
  }

  return (
    <CommunityContext.Provider value={{ 
      communities, 
      loading,
      error,
      createCommunity: createCommunityHandler,
      updateCommunity: updateCommunityHandler,
      joinCommunity,
      toggleJoinStatus, 
      getCommunity,
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