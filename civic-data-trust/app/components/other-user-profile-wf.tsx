"use client"

import { useState, useMemo } from "react"
import { Play, FileText, Download, Eye, Calendar, Users, Award, Star } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { useCommunity } from "./contexts/community-context"
import { useUser } from "./contexts/user-context"

interface UserDataset {
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
}

interface CommunityMembership {
  communityId: number
  communityName: string
  status: 'approved' | 'pending' | 'rejected'
  joinedDate: Date
  category: string
  memberCount: number
  role?: 'member' | 'moderator' | 'admin'
  contributions: number
  thumbnail?: string
}

interface OtherUserProfile {
  id: string
  name: string
  bio: string
  avatar: string
  joinedDate: Date
  totalContributions: number
  totalDownloads: number
  totalViews: number
  isOnline: boolean
  lastActive: Date
}

// Mock user data - in real app this would come from API based on userId
const getUserProfile = (userId: string): OtherUserProfile => {
  const mockUsers: Record<string, OtherUserProfile> = {
    'alex-chen': {
      id: "USR-891-C",
      name: "Alex Chen",
      bio: "Data Science researcher specializing in machine learning algorithms and cross-community data collaboration. Passionate about secure data sharing protocols.",
      avatar: "/api/placeholder/72/72",
      joinedDate: new Date("2024-01-20"),
      totalContributions: 28,
      totalDownloads: 8934,
      totalViews: 45231,
      isOnline: true,
      lastActive: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
    },
    'maria-rodriguez': {
      id: "USR-742-M",
      name: "Maria Rodriguez",
      bio: "Urban agriculture expert and sustainability advocate. Leading research in urban farming techniques and community food security.",
      avatar: "/api/placeholder/72/72",
      joinedDate: new Date("2024-02-10"),
      totalContributions: 22,
      totalDownloads: 5621,
      totalViews: 28945,
      isOnline: false,
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
    },
    'dr-james-wilson': {
      id: "USR-563-W",
      name: "Dr. James Wilson",
      bio: "Ethics professor and data governance consultant. Focused on building trust frameworks for community-driven research initiatives.",
      avatar: "/api/placeholder/72/72",
      joinedDate: new Date("2023-11-15"),
      totalContributions: 41,
      totalDownloads: 12847,
      totalViews: 62103,
      isOnline: false,
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    }
  }
  
  // Default fallback user if userId doesn't match
  return mockUsers[userId] || {
    id: "USR-000-X",
    name: "Unknown User",
    bio: "This user profile could not be found.",
    avatar: "/api/placeholder/72/72",
    joinedDate: new Date("2024-01-01"),
    totalContributions: 0,
    totalDownloads: 0,
    totalViews: 0,
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) // 30 days ago
  }
}

// Mock user datasets - only public ones visible to others
const getUserDatasetsLegacy = (userId: string): UserDataset[] => {
  const allDatasets: Record<string, UserDataset[]> = {
    'alex-chen': [
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
        thumbnail: "/api/placeholder/100/60",
        isPublic: true
      },
      {
        id: "DS-102",
        title: "Cross-Community ML Algorithm Benchmarks",
        description: "Comprehensive performance analysis of machine learning algorithms across different community datasets.",
        uploadDate: new Date("2025-08-15"),
        size: "1.8 GB",
        downloads: 289,
        views: 1567,
        status: 'published',
        category: "Technology",
        communityId: 1,
        communityName: "Data Science Enthusiasts",
        fileType: "Research Paper",
        thumbnail: "/api/placeholder/100/60",
        isPublic: true
      }
    ],
    'maria-rodriguez': [
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
        thumbnail: "/api/placeholder/100/60",
        isPublic: true
      },
      {
        id: "DS-202",
        title: "Sustainable Growing Techniques Guide",
        description: "Practical guide with video tutorials on sustainable urban farming methods proven effective in community settings.",
        uploadDate: new Date("2025-08-10"),
        size: "945 MB",
        downloads: 567,
        views: 3241,
        status: 'published',
        category: "Agriculture",
        communityId: 5,
        communityName: "Urban Gardening",
        fileType: "Video Series",
        thumbnail: "/api/placeholder/100/60",
        isPublic: true
      }
    ],
    'dr-james-wilson': [
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
        thumbnail: "/api/placeholder/100/60",
        isPublic: true
      },
      {
        id: "DS-302",
        title: "Community Trust Building Case Studies",
        description: "Real-world examples of successful community data sharing initiatives and the trust mechanisms that made them possible.",
        uploadDate: new Date("2025-08-16"),
        size: "1.3 GB",
        downloads: 423,
        views: 2876,
        status: 'published',
        category: "Community",
        communityId: 2,
        communityName: "Sustainable Living",
        fileType: "Research Report",
        thumbnail: "/api/placeholder/100/60",
        isPublic: true
      }
    ]
  }
  
  return allDatasets[userId] || []
}

interface OtherUserProfileWFProps {
  userId: string
}

export function OtherUserProfileWF({ userId }: OtherUserProfileWFProps) {
  const { communities } = useCommunity()
  const { users, getUserById, getUserDatasets: getDatasets, getUserIdFromName } = useUser()
  const [activeTab, setActiveTab] = useState("latest")
  
  
  // First try to find user in user context by converting name to ID format
  let userProfile: OtherUserProfile | undefined
  
  const foundUser = users.find(u => getUserIdFromName(u.name) === userId)
  if (foundUser) {
    userProfile = {
      ...foundUser,
      isOnline: foundUser.isOnline || false,
      lastActive: foundUser.lastActive || new Date(Date.now() - 1000 * 60 * 60 * 24)
    }
  }
  
  // If not found, try direct ID lookup in user context
  if (!userProfile) {
    const contextUser = getUserById(userId)
    if (contextUser) {
      userProfile = {
        ...contextUser,
        isOnline: contextUser.isOnline || false,
        lastActive: contextUser.lastActive || new Date(Date.now() - 1000 * 60 * 60 * 24)
      }
    }
  }
  
  // If still not found, try legacy lookup by name-based ID
  if (!userProfile) {
    userProfile = getUserProfile(userId)
  }
  
  // Final fallback - create profile from user context if available
  if (!userProfile || userProfile.name === "Unknown User") {
    // Map common URL patterns to known users
    const nameMapping: Record<string, string> = {
      'alex-chen': 'Alex Chen',
      'maria-rodriguez': 'Maria Rodriguez', 
      'dr-james-wilson': 'Dr. James Wilson',
      'sarah-kim': 'Sarah Kim',
      'dr-emily-zhang': 'Dr. Emily Zhang',
      'jordan-martinez': 'Jordan Martinez',
      'prof-lisa-anderson': 'Prof. Lisa Anderson',
      'robert-chang': 'Robert Chang',
      'dr-michelle-park': 'Dr. Michelle Park',
      'thomas-liu': 'Thomas Liu',
      'amanda-foster': 'Amanda Foster',
      'kevin-rodriguez': 'Kevin Rodriguez'
    }
    
    const userName = nameMapping[userId]
    if (userName) {
      const contextUser = users.find(u => u.name === userName)
      if (contextUser) {
        userProfile = {
          ...contextUser,
          isOnline: contextUser.isOnline || false,
          lastActive: contextUser.lastActive || new Date(Date.now() - 1000 * 60 * 60 * 24)
        }
      } else {
        userProfile = getUserProfile(userId)
      }
    }
  }
  
  // Ensure we have a profile - final fallback to unknown user
  if (!userProfile) {
    userProfile = getUserProfile(userId)
  }

  const userDatasets = userProfile ? getDatasets(userProfile.id, true) : getUserDatasetsLegacy(userId)
  
  // Generate community memberships (only approved/public ones visible to others)
  const userMemberships: CommunityMembership[] = useMemo(() => {
    const relevantCommunities = communities.filter(community => 
      userDatasets.some(dataset => dataset.communityId === community.id)
    )
    
    return relevantCommunities.map((community) => ({
      communityId: community.id,
      communityName: community.name,
      status: 'approved' as const,
      joinedDate: new Date(Date.now() - (Math.random() * 180 + 30) * 24 * 60 * 60 * 1000), // Random date within last 210 days
      category: community.category,
      memberCount: community.memberCount,
      role: Math.random() > 0.9 ? 'moderator' : 'member',
      contributions: Math.floor(Math.random() * 20) + 5,
      thumbnail: community.coverImage
    }))
  }, [communities, userDatasets])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Mock achievements data
  const achievements = [
    { id: 1, name: "Data Pioneer", icon: Award, description: "First dataset uploaded" },
    { id: 2, name: "Community Builder", icon: Users, description: "Joined 5+ communities" },
    { id: 3, name: "Top Contributor", icon: Star, description: "100+ contributions" },
    { id: 4, name: "Trusted Sharer", icon: FileText, description: "50+ downloads" },
    { id: 5, name: "Popular Creator", icon: Eye, description: "1000+ views" },
    { id: 6, name: "Early Adopter", icon: Calendar, description: "Beta user" }
  ]

  // Sort datasets by different criteria
  const sortedDatasets = useMemo(() => {
    const datasets = [...userDatasets]
    switch (activeTab) {
      case 'latest':
        return datasets.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
      case 'popular':
        return datasets.sort((a, b) => (b.views + b.downloads) - (a.views + a.downloads))
      case 'most-used':
        return datasets.sort((a, b) => b.downloads - a.downloads)
      default:
        return datasets
    }
  }, [userDatasets, activeTab])

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{userProfile.name}</h1>
          <Button variant="default">Follow</Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="latest">Latest</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="most-used">Most Used</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Content Cards */}
          <div className="space-y-4">
            {sortedDatasets.length === 0 ? (
              <Card className="border border-border">
                <CardContent className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No datasets found</h3>
                    <p className="text-sm">This user hasn't shared any public datasets yet.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              sortedDatasets.map((dataset) => (
                <Card key={dataset.id} className="border border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Video/Content Thumbnail */}
                      <div className="w-64 h-40 bg-muted flex items-center justify-center relative overflow-hidden rounded-l-lg">
                        {dataset.thumbnail ? (
                          <div className="w-full h-full bg-muted-foreground/10 flex items-center justify-center">
                            <div className="bg-background/90 rounded-full p-3">
                              <Play className="h-8 w-8 text-primary fill-current" />
                            </div>
                          </div>
                        ) : (
                          <div className="bg-background/90 rounded-full p-3">
                            <Play className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content Info */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground text-lg">{dataset.title}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {dataset.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {dataset.description}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-lg font-bold text-primary">{dataset.communityName}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>{formatDate(dataset.uploadDate)}</span>
                            <span>•</span>
                            <span>{dataset.size}</span>
                            <span>•</span>
                            <span>{dataset.fileType}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{dataset.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              <span>{dataset.downloads.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-6">
          {/* Stats */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{userMemberships.length}</div>
                  <div className="text-sm text-muted-foreground">Communities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{userDatasets.length}</div>
                  <div className="text-sm text-muted-foreground">Datasets</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Achievements</h3>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="aspect-square bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer"
                    title={`${achievement.name}: ${achievement.description}`}
                  >
                    <achievement.icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}