"use client"

import { createContext, useContext, ReactNode } from "react"
import { getDatasetThumbnail, getUserAvatar } from "@/app/utils/image-mapping"

export interface User {
  id: string
  name: string
  bio: string
  avatar: string
  joinedDate: Date
  totalContributions: number
  totalDownloads: number
  totalViews: number
  isOnline?: boolean
  lastActive?: Date
}

export interface Dataset {
  id: string
  title: string
  description: string
  uploadDate: Date
  size: string
  downloads: number
  views: number
  status: 'published' | 'pending' | 'draft'
  category: string
  communityId?: number
  communityName?: string
  fileType: string
  thumbnail?: string
  isPublic: boolean
  authorId: string
}

interface UserContextType {
  currentUser: User | null
  users: User[]
  datasets: Dataset[]
  getUserById: (id: string) => User | undefined
  getUserByName: (name: string) => User | undefined
  getUserDatasets: (userId: string, publicOnly?: boolean) => Dataset[]
  getUserIdFromName: (name: string) => string
}

// Mock user data - in a real app this would come from an API
const mockUsers: User[] = [
  {
    id: "USR-734-B",
    name: "Alex Ryder",
    bio: "Platform administrator and community manager. Focused on building sustainable data sharing ecosystems.",
    avatar: getUserAvatar("USR-734-B"),
    joinedDate: new Date("2024-03-15"),
    totalContributions: 12,
    totalDownloads: 3456,
    totalViews: 18934,
    isOnline: true,
    lastActive: new Date()
  },
  {
    id: "USR-891-C",
    name: "Alex Chen",
    bio: "Data Science researcher specializing in machine learning algorithms and cross-community data collaboration. Passionate about secure data sharing protocols.",
    avatar: getUserAvatar("USR-891-C"),
    joinedDate: new Date("2024-01-20"),
    totalContributions: 28,
    totalDownloads: 8934,
    totalViews: 45231,
    isOnline: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
  },
  {
    id: "USR-742-M",
    name: "Maria Rodriguez",
    bio: "Urban agriculture expert and sustainability advocate. Leading research in urban farming techniques and community food security.",
    avatar: getUserAvatar("USR-742-M"),
    joinedDate: new Date("2024-02-10"),
    totalContributions: 22,
    totalDownloads: 5621,
    totalViews: 28945,
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
  },
  {
    id: "USR-563-W",
    name: "Dr. James Wilson",
    bio: "Ethics professor and data governance consultant. Focused on building trust frameworks for community-driven research initiatives.",
    avatar: getUserAvatar("USR-563-W"),
    joinedDate: new Date("2023-11-15"),
    totalContributions: 41,
    totalDownloads: 12847,
    totalViews: 62103,
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    id: "USR-456-S",
    name: "Sarah Kim",
    bio: "Blockchain developer and open source advocate. Building decentralized tools for community data governance.",
    avatar: getUserAvatar("USR-456-S"),
    joinedDate: new Date("2024-04-08"),
    totalContributions: 19,
    totalDownloads: 6789,
    totalViews: 34521,
    isOnline: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: "USR-789-E",
    name: "Dr. Emily Zhang",
    bio: "Medical AI researcher focused on privacy-preserving healthcare analytics and ethical AI deployment in clinical settings.",
    avatar: getUserAvatar("USR-789-E"),
    joinedDate: new Date("2023-12-01"),
    totalContributions: 33,
    totalDownloads: 9876,
    totalViews: 52341,
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 6) // 6 hours ago
  },
  {
    id: "USR-123-J",
    name: "Jordan Martinez",
    bio: "Gaming data analyst and player behavior researcher. Expertise in engagement metrics and retention analytics.",
    avatar: getUserAvatar("USR-123-J"),
    joinedDate: new Date("2024-03-22"),
    totalContributions: 15,
    totalDownloads: 4532,
    totalViews: 23891,
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: "USR-456-L",
    name: "Prof. Lisa Anderson",
    bio: "Climate science professor and travel pattern researcher. Leading studies on climate impact on global mobility.",
    avatar: getUserAvatar("USR-456-L"),
    joinedDate: new Date("2023-09-10"),
    totalContributions: 31,
    totalDownloads: 7823,
    totalViews: 41203,
    isOnline: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
  },
  {
    id: "USR-789-R",
    name: "Robert Chang",
    bio: "Financial analytics expert and social media sentiment researcher. Specializes in market prediction algorithms.",
    avatar: getUserAvatar("USR-789-R"),
    joinedDate: new Date("2024-01-15"),
    totalContributions: 24,
    totalDownloads: 6912,
    totalViews: 35421,
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 8) // 8 hours ago
  },
  {
    id: "USR-234-P",
    name: "Dr. Michelle Park",
    bio: "Quantum computing researcher and pharmaceutical data scientist. Pioneer in molecular simulation technologies.",
    avatar: getUserAvatar("USR-234-P"),
    joinedDate: new Date("2023-08-20"),
    totalContributions: 38,
    totalDownloads: 9234,
    totalViews: 48721,
    isOnline: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
  },
  {
    id: "USR-567-T",
    name: "Thomas Liu",
    bio: "Supply chain analyst and logistics expert. Specializes in resilience planning and disruption analysis.",
    avatar: getUserAvatar("USR-567-T"),
    joinedDate: new Date("2024-02-18"),
    totalContributions: 18,
    totalDownloads: 5234,
    totalViews: 27891,
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
  },
  {
    id: "USR-890-A",
    name: "Amanda Foster",
    bio: "VR technology researcher and immersive learning specialist. Focused on educational applications and training programs.",
    avatar: getUserAvatar("USR-890-A"),
    joinedDate: new Date("2023-12-05"),
    totalContributions: 26,
    totalDownloads: 6789,
    totalViews: 34567,
    isOnline: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 20) // 20 minutes ago
  },
  {
    id: "USR-321-K",
    name: "Kevin Rodriguez",
    bio: "Streaming media analyst and entertainment industry researcher. Expert in consumer viewing pattern analysis.",
    avatar: getUserAvatar("USR-321-K"),
    joinedDate: new Date("2024-04-12"),
    totalContributions: 14,
    totalDownloads: 4321,
    totalViews: 21890,
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
  }
]

// Mock datasets - associated with users
const mockDatasets: Dataset[] = [
  {
    id: "DS-101",
    title: "Secure Multi-Party Data Sharing Framework",
    description: "Revolutionary protocol enabling secure data collaboration between communities without compromising individual privacy.",
    uploadDate: new Date("2025-08-20"),
    size: "3.2 GB",
    downloads: 456,
    views: 2134,
    status: 'published',
    category: "Technology",
    communityId: 1,
    communityName: "Data Science Enthusiasts",
    fileType: "Python Package",
    thumbnail: getDatasetThumbnail("DS-101"),
    isPublic: true,
    authorId: "USR-891-C"
  },
  {
    id: "DS-201",
    title: "Urban Community Garden Yield Analysis 2025",
    description: "Detailed analysis of crop yields from 50+ urban community gardens across different climate zones.",
    uploadDate: new Date("2025-08-18"),
    size: "2.1 GB",
    downloads: 234,
    views: 1456,
    status: 'published',
    category: "Agriculture",
    communityId: 5,
    communityName: "Urban Gardening",
    fileType: "Dataset CSV",
    thumbnail: getDatasetThumbnail("DS-201"),
    isPublic: true,
    authorId: "USR-742-M"
  },
  {
    id: "DS-301",
    title: "Ethical Data Governance Framework v2.0",
    description: "Updated framework for ethical data sharing in research communities, including consent management and transparency protocols.",
    uploadDate: new Date("2025-08-22"),
    size: "567 MB",
    downloads: 891,
    views: 4532,
    status: 'published',
    category: "Ethics",
    communityId: 2,
    communityName: "Sustainable Living",
    fileType: "Policy Document",
    thumbnail: getDatasetThumbnail("DS-301"),
    isPublic: true,
    authorId: "USR-563-W"
  },
  {
    id: "DS-401",
    title: "Gaming Player Behavior Analytics Dataset",
    description: "Anonymous gameplay data from 50+ million players across multiple genres, providing insights into engagement and retention.",
    uploadDate: new Date("2025-08-19"),
    size: "4.2 GB",
    downloads: 278,
    views: 1823,
    status: 'published',
    category: "Gaming",
    communityId: 19,
    communityName: "Gaming Analytics Pro",
    fileType: "Dataset",
    thumbnail: getDatasetThumbnail("DS-401"),
    isPublic: true,
    authorId: "USR-123-J"
  },
  {
    id: "DS-501",
    title: "Climate Impact on Global Travel Patterns",
    description: "5-year analysis of how climate events affect travel behavior, tourism patterns, and transportation choices worldwide.",
    uploadDate: new Date("2025-08-21"),
    size: "2.8 GB",
    downloads: 198,
    views: 1342,
    status: 'published',
    category: "Travel",
    communityId: 32,
    communityName: "Travel Patterns Global",
    fileType: "Research Data",
    thumbnail: getDatasetThumbnail("DS-501"),
    isPublic: true,
    authorId: "USR-456-L"
  },
  {
    id: "DS-601",
    title: "Financial Market Sentiment Analysis Tools",
    description: "Advanced NLP tools and datasets for predicting market movements using social media sentiment analysis.",
    uploadDate: new Date("2025-08-17"),
    size: "1.9 GB",
    downloads: 456,
    views: 2891,
    status: 'published',
    category: "Finance",
    communityId: 38,
    communityName: "Financial Analytics Pro",
    fileType: "Code + Data",
    thumbnail: getDatasetThumbnail("DS-601"),
    isPublic: true,
    authorId: "USR-789-R"
  }
]

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  // Current user (Alex Ryder) - in a real app this would come from authentication
  const currentUser = mockUsers[0]

  const getUserById = (id: string): User | undefined => {
    return mockUsers.find(user => user.id === id)
  }

  const getUserByName = (name: string): User | undefined => {
    return mockUsers.find(user => user.name.toLowerCase() === name.toLowerCase())
  }

  const getUserDatasets = (userId: string, publicOnly: boolean = true): Dataset[] => {
    return mockDatasets.filter(dataset => 
      dataset.authorId === userId && (!publicOnly || dataset.isPublic)
    )
  }

  // Convert user name to URL-friendly ID
  const getUserIdFromName = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  const value: UserContextType = {
    currentUser,
    users: mockUsers,
    datasets: mockDatasets,
    getUserById,
    getUserByName,
    getUserDatasets,
    getUserIdFromName
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}