"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Community {
  id: number
  name: string
  description: string
  category: string
  tags: string[]
  memberCount: number
  coverImage: string
  isJoined: boolean
}

interface CommunityContextType {
  communities: Community[]
  toggleJoinStatus: (communityId: number) => void
  getCommunity: (communityId: number) => Community | undefined
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined)

const initialCommunities: Community[] = [
  {
    id: 1,
    name: "Data Science Enthusiasts",
    description: "A community for data scientists to share insights, datasets, and collaborate on projects.",
    category: "Technology",
    tags: ["Data Science", "Machine Learning", "Python"],
    memberCount: 1247,
    coverImage: "/placeholder-np7tk.png",
    isJoined: true,
  },
  {
    id: 2,
    name: "Sustainable Living",
    description: "Join us in creating a more sustainable future through shared knowledge and eco-friendly practices.",
    category: "Environment",
    tags: ["Sustainability", "Environment", "Green Living"],
    memberCount: 892,
    coverImage: "/sustainable-living-community.png",
    isJoined: true,
  },
  {
    id: 3,
    name: "Local Entrepreneurs",
    description: "Connect with fellow entrepreneurs in your area to share resources and build networks.",
    category: "Business",
    tags: ["Entrepreneurship", "Networking", "Startups"],
    memberCount: 634,
    coverImage: "/placeholder-yi11m.png",
    isJoined: false,
  },
  {
    id: 4,
    name: "Creative Writers Hub",
    description: "A space for writers to share their work, get feedback, and collaborate on creative projects.",
    category: "Arts",
    tags: ["Writing", "Literature", "Creative"],
    memberCount: 1089,
    coverImage: "/creative-writers-community.png",
    isJoined: false,
  },
  {
    id: 5,
    name: "Urban Gardening",
    description: "Learn and share urban gardening techniques, from balcony gardens to community plots.",
    category: "Lifestyle",
    tags: ["Gardening", "Urban", "Plants"],
    memberCount: 756,
    coverImage: "/urban-gardening-community.png",
    isJoined: true,
  },
  {
    id: 6,
    name: "Blockchain Developers",
    description: "Technical community for blockchain developers to share code, discuss protocols, and collaborate.",
    category: "Technology",
    tags: ["Blockchain", "Cryptocurrency", "Development"],
    memberCount: 2103,
    coverImage: "/blockchain-developers-community.png",
    isJoined: false,
  },
]

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>(initialCommunities)

  const toggleJoinStatus = (communityId: number) => {
    setCommunities((prev) =>
      prev.map((community) =>
        community.id === communityId ? { ...community, isJoined: !community.isJoined } : community,
      ),
    )
  }

  const getCommunity = (communityId: number) => {
    return communities.find((community) => community.id === communityId)
  }

  return (
    <CommunityContext.Provider value={{ communities, toggleJoinStatus, getCommunity }}>
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
