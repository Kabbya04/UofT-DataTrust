"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "@/app/lib/api"

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
  users?: Array<any>
  isJoined?: boolean
  memberCount?: number
  tags?: string[]
  coverImage?: string
}

interface CommunityContextType {
  communities: Community[]
  loading: boolean
  error: string | null
  toggleJoinStatus: (communityId: string) => void
  getCommunity: (communityId: string) => Community | undefined
  submitJoinRequest: (communityId: string, message: string) => void
  fetchCommunities: () => Promise<void>
  refreshCommunities: () => Promise<void>
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined)


export function CommunityProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCommunities = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.communities.getAll(1, 50)
      
      const transformedCommunities: Community[] = response.data.map(community => ({
        ...community,
        isJoined: false, // Default to not joined, this could be determined by checking user membership
        memberCount: (community.users?.length || 0) + (community.admins?.length || 0), // Real member count
        tags: [community.community_category.name], // Use category as tag
        coverImage: community.logo || '/placeholder-np7tk.png'
      }))
      
      setCommunities(transformedCommunities)
    } catch (err) {
      console.error('Failed to fetch communities:', err)
      setError('Failed to load communities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommunities()
  }, [])

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

  const submitJoinRequest = (communityId: string, message: string) => {
    console.log(`Join request submitted for community ${communityId}:`, message)
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
