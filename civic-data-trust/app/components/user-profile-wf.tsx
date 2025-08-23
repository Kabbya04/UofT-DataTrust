"use client"

import { useState, useMemo } from "react"
import { Play, FileText, Download, Eye, Calendar, User, Settings2, Upload, Database } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { useCommunity } from "./contexts/community-context"

// Enhanced interfaces for user profile data
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

interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  joinedDate: Date
  totalContributions: number
  totalDownloads: number
  totalViews: number
}

// Mock user profile data
const mockUserProfile: UserProfile = {
  id: "USR-734-B",
  name: "Alex Ryder",
  email: "alex.ryder@example.com",
  avatar: "/api/placeholder/72/72",
  joinedDate: new Date("2024-03-15"),
  totalContributions: 12,
  totalDownloads: 3456,
  totalViews: 18934
}

// Mock user datasets
const mockUserDatasets: UserDataset[] = [
  {
    id: "DS-001",
    title: "Urban Traffic Analysis Dataset",
    description: "Comprehensive traffic flow data from major metropolitan areas including peak hours, congestion patterns, and route optimization metrics.",
    uploadDate: new Date("2025-08-15"),
    size: "2.4 GB",
    downloads: 234,
    views: 1247,
    status: 'published',
    category: "Transportation",
    communityId: 1,
    communityName: "Data Science Enthusiasts",
    fileType: "CSV",
    thumbnail: "/api/placeholder/100/60"
  },
  {
    id: "DS-002", 
    title: "Sustainable Energy Consumption Patterns",
    description: "Energy usage data from renewable sources across different urban environments and seasonal variations.",
    uploadDate: new Date("2025-08-10"),
    size: "1.8 GB",
    downloads: 156,
    views: 892,
    status: 'published',
    category: "Environment",
    communityId: 2,
    communityName: "Sustainable Living",
    fileType: "JSON",
    thumbnail: "/api/placeholder/100/60"
  },
  {
    id: "DS-003",
    title: "Machine Learning Algorithm Performance Benchmarks",
    description: "Benchmark results for various ML algorithms across different datasets and computational environments.",
    uploadDate: new Date("2025-08-05"),
    size: "945 MB",
    downloads: 89,
    views: 543,
    status: 'pending',
    category: "Technology",
    communityId: 1,
    communityName: "Data Science Enthusiasts", 
    fileType: "Python Notebook",
    thumbnail: "/api/placeholder/100/60"
  },
  {
    id: "DS-004",
    title: "Community Garden Yield Analysis",
    description: "Agricultural data from urban community gardens including crop yields, soil quality, and growing techniques.",
    uploadDate: new Date("2025-07-28"),
    size: "567 MB",
    downloads: 67,
    views: 324,
    status: 'draft',
    category: "Agriculture",
    communityId: 5,
    communityName: "Urban Gardening",
    fileType: "Excel",
    thumbnail: "/api/placeholder/100/60"
  }
]

export function UserProfileWF() {
  const { communities } = useCommunity()
  const [activeTab, setActiveTab] = useState("all")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  
  
  // Handle file selection for bulk operations
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }
  
  const handleBulkExport = () => {
    const selectedDatasets = mockUserDatasets.filter(dataset => 
      selectedFiles.includes(dataset.id)
    )
    console.log("Exporting datasets:", selectedDatasets)
    // This would integrate with backend export functionality
    alert(`Exporting ${selectedDatasets.length} datasets...`)
  }
  
  const handleViewDataset = (dataset: UserDataset) => {
    console.log("Viewing dataset:", dataset)
    // This would navigate to a detailed dataset view
  }
  
  // Generate dynamic community memberships based on community context
  const userMemberships: CommunityMembership[] = useMemo(() => {
    return communities.map((community, index) => {
      // Different membership statuses for demonstration
      const statuses: ('approved' | 'pending' | 'rejected')[] = ['approved', 'pending', 'rejected']
      let status: 'approved' | 'pending' | 'rejected'
      
      if (community.isJoined) {
        status = 'approved'
      } else {
        // Assign different statuses for non-joined communities
        status = index % 3 === 0 ? 'pending' : index % 4 === 0 ? 'rejected' : 'approved'
      }
      
      return {
        communityId: community.id,
        communityName: community.name,
        status: status,
        joinedDate: new Date(Date.now() - (Math.random() * 90 + 10) * 24 * 60 * 60 * 1000), // Random date within last 100 days
        category: community.category,
        memberCount: community.memberCount,
        role: community.isJoined && Math.random() > 0.8 ? 'moderator' : 'member',
        contributions: community.isJoined ? Math.floor(Math.random() * 15) + 1 : 0,
        thumbnail: community.coverImage
      }
    })
  }, [communities])

  // Filter memberships by status
  const filteredMemberships = useMemo(() => {
    if (activeTab === "all") return userMemberships
    return userMemberships.filter(membership => membership.status === activeTab)
  }, [userMemberships, activeTab])

  // Get status counts for tabs
  const statusCounts = useMemo(() => {
    return {
      all: userMemberships.length,
      approved: userMemberships.filter(m => m.status === 'approved').length,
      pending: userMemberships.filter(m => m.status === 'pending').length,
      rejected: userMemberships.filter(m => m.status === 'rejected').length
    }
  }, [userMemberships])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'rejected': return 'text-red-600 bg-red-50'
      case 'published': return 'text-green-600 bg-green-50'
      case 'draft': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Community Memberships */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({statusCounts.approved})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6 space-y-4">
              {filteredMemberships.length === 0 ? (
                <Card className="border border-border">
                  <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground">
                      No communities found for this status.
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredMemberships.map((membership) => (
                  <Card key={membership.communityId} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Video Placeholder */}
                        <div className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                          {membership.thumbnail ? (
                            <img 
                              src={membership.thumbnail} 
                              alt={membership.communityName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Play className="h-8 w-8 text-muted-foreground" />
                          )}
                          <Button
                            size="sm"
                            variant="secondary"
                            className="absolute inset-0 w-full h-full bg-black/20 hover:bg-black/30 text-white border-0 flex items-center justify-center"
                          >
                            <Play className="h-6 w-6" />
                          </Button>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground flex items-center gap-2">
                                {membership.communityName}
                                <Settings2 className="h-4 w-4 text-muted-foreground" />
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {membership.category} • {membership.memberCount.toLocaleString()} members
                                {membership.role === 'moderator' && ' • Moderator'}
                                {membership.contributions > 0 && ` • ${membership.contributions} contributions`}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(membership.status)} variant="secondary">
                                {membership.status.charAt(0).toUpperCase() + membership.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Joined: {formatDate(membership.joinedDate)}</span>
                            <span className="text-foreground font-medium">Community Name</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - My Files & Stats */}
        <div className="space-y-6">
          {/* My Files Section */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">My Files</h3>
                {selectedFiles.length > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleBulkExport}
                  >
                    Export ({selectedFiles.length})
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                {mockUserDatasets.slice(0, 6).map((dataset) => (
                  <div 
                    key={dataset.id} 
                    className={`aspect-square bg-muted rounded border flex items-center justify-center relative group cursor-pointer hover:bg-muted/80 transition-colors ${
                      selectedFiles.includes(dataset.id) ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => toggleFileSelection(dataset.id)}
                  >
                    {dataset.thumbnail ? (
                      <img 
                        src={dataset.thumbnail} 
                        alt={dataset.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{dataset.fileType}</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewDataset(dataset)
                        }}
                        className="p-1 bg-white/20 rounded hover:bg-white/30"
                      >
                        <Eye className="h-3 w-3 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFileSelection(dataset.id)
                        }}
                        className="p-1 bg-white/20 rounded hover:bg-white/30"
                      >
                        <Download className="h-3 w-3 text-white" />
                      </button>
                    </div>
                    
                    <Badge 
                      className={`absolute top-1 right-1 text-xs ${getStatusColor(dataset.status)}`}
                      variant="secondary"
                    >
                      {dataset.status}
                    </Badge>
                    
                    {selectedFiles.includes(dataset.id) && (
                      <div className="absolute top-1 left-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 rounded-b opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="truncate" title={dataset.title}>{dataset.title}</div>
                      <div className="text-gray-300">{dataset.size} • {dataset.downloads} downloads</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Dataset
                </Button>
                
                <Button variant="ghost" size="sm" className="w-full text-sm text-muted-foreground">
                  View All Files ({mockUserDatasets.length})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{statusCounts.approved}</div>
                  <div className="text-sm text-muted-foreground">Communities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{mockUserDatasets.length}</div>
                  <div className="text-sm text-muted-foreground">Datasets</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Total Views</span>
                    </div>
                    <span className="font-medium">{mockUserProfile.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Downloads</span>
                    </div>
                    <span className="font-medium">{mockUserProfile.totalDownloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Contributions</span>
                    </div>
                    <span className="font-medium">{mockUserProfile.totalContributions}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Info Card */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{mockUserProfile.name}</h4>
                  <p className="text-sm text-muted-foreground">{mockUserProfile.email}</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Member since {formatDate(mockUserProfile.joinedDate)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}