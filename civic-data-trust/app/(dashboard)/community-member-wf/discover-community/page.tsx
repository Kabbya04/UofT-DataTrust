"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Image as ImageIcon, RefreshCw, Search, Grid, List } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
import { Users, Database } from "lucide-react"
import { useCommunity } from "@/app/components/contexts/community-context"
import { api } from "@/app/lib/api"

const categoryTabs = ['All', 'Education', 'Data Science', 'Technology', 'Games', 'Movies', 'Television', 'Medicine', 'Travel', 'Business', 'Internet']

interface CommunityCardProps {
  community: {
    id: string
    name: string
    memberCount?: number
    datasets: number
    description: string | null
    category: string
    isJoined?: boolean
  }
  onJoin: (communityId: string) => void
  onViewDetails: (communityId: string) => void
  isLoadingCounts?: boolean
}

function CommunityCard({ community, onJoin, onViewDetails, isLoadingCounts }: CommunityCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 
              className="font-semibold text-lg mb-1 cursor-pointer hover:text-primary transition-colors" 
              onClick={() => onViewDetails(community.id)}
            >
              {community.name}
            </h3>
            <Badge variant="secondary" className="mb-2 bg-[#2196F3] hover:bg-[#2196F3]/90 text-white">
              {community.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {community.description || 'No description available'}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{isLoadingCounts ? '...' : (community.memberCount?.toLocaleString() || '0')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span>{isLoadingCounts ? '...' : community.datasets} datasets</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1" 
            onClick={() => onViewDetails(community.id)}
          >
            View Details
          </Button>
          <Button 
            variant={community.isJoined ? "outline" : "default"} 
            size="sm" 
            className={`flex-1 ${!community.isJoined ? 'bg-[#2196F3] hover:bg-[#2196F3]/90' : ''}`}
            onClick={() => onJoin(community.id)}
          >
            {community.isJoined ? "Joined" : "Join Community"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DiscoverCommunityPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'sections' | 'all'>('sections')
  const [datasetCounts, setDatasetCounts] = useState<{[key: string]: number}>({})
  const [isLoadingCounts, setIsLoadingCounts] = useState(false)
  const { communities, loading, error, toggleJoinStatus, refreshCommunities } = useCommunity()
  const router = useRouter()

  // Refresh communities when page becomes visible or when component mounts
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleRefresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Also refresh when component mounts (in case user navigated here)
    handleRefresh()

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Fetch real dataset counts for all communities
  useEffect(() => {
    const fetchDatasetCounts = async () => {
      if (communities.length === 0 || loading) return

      setIsLoadingCounts(true)
      try {
        const token = localStorage.getItem('access_token')
        if (!token) return

        // Fetch all posts and post requests to calculate dataset counts
        const [postsResponse, requestsResponse] = await Promise.all([
          fetch('/api/community-post/?pageNumber=1&limit=200', {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
          }),
          fetch('/api/community-post-request/', {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
          })
        ])

        if (postsResponse.ok && requestsResponse.ok) {
          const postsResult = await postsResponse.json()
          const requestsResult = await requestsResponse.json()

          const allPosts = postsResult.data || postsResult || []
          const allRequests = requestsResult.data || requestsResult || []

          const approvedPostIds = allRequests
            .filter((request: any) => request.status === 'approved')
            .map((request: any) => request.post_id)

          const datasetCountsMap: {[key: string]: number} = {}

          communities.forEach(community => {
            const communityPosts = allPosts.filter(
              (post: any) => post.community_id === community.id.toString()
            )
            const approvedCommunityPosts = communityPosts.filter(
              (post: any) => approvedPostIds.includes(post.id)
            )
            const uniqueDatasetIds = [...new Set(
              approvedCommunityPosts
                .filter((post: any) => post.dataset_id)
                .map((post: any) => post.dataset_id)
            )]
            datasetCountsMap[community.id] = uniqueDatasetIds.length
          })

          setDatasetCounts(datasetCountsMap)
          console.log('Real dataset counts for discover page:', datasetCountsMap)
        }
      } catch (error) {
        console.error('Error fetching dataset counts:', error)
      } finally {
        setIsLoadingCounts(false)
      }
    }

    fetchDatasetCounts()
  }, [communities.length, loading])

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      await refreshCommunities()
    } catch (error) {
      console.error('Failed to refresh communities:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Transform API communities to match the expected format with real data
  const extendedCommunities = communities.map(c => ({
    ...c,
    datasets: datasetCounts[c.id] || 0,
    category: c.community_category?.name || 'General',
    memberCount: c.memberCount || 0
  }))

  // Apply filters for search and category
  const filteredCommunities = extendedCommunities.filter(community => {
    const matchesSearch = searchQuery === '' || 
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = activeTab === 'All' || community.category === activeTab
    
    return matchesSearch && matchesCategory
  })

  const handleJoinCommunity = (communityId: string) => {
    const community = communities.find(c => c.id === communityId)
    if (community && community.isJoined) {
      toggleJoinStatus(communityId)
    } else {
      router.push(`/community-member-wf/join-community?communityId=${communityId}`)
    }
  }

  const handleViewDetails = (communityId: string) => {
    router.push(`/community-member-wf/community-details/${communityId}`)
  }

  // Create dynamic sections based on available categories
  const availableCategories = [...new Set(extendedCommunities.map(c => c.category))]
  
  const recommendedCommunities = filteredCommunities.slice(0, 6) // Increased limit
  const educationCommunities = filteredCommunities.filter(c => c.category === 'Education').slice(0, 6)
  const dataScienceCommunities = filteredCommunities.filter(c => c.category === 'Data Science').slice(0, 6)
  const technologyCommunities = filteredCommunities.filter(c => c.category === 'Technology').slice(0, 6)
  const gamesCommunities = filteredCommunities.filter(c => c.category === 'Games').slice(0, 6)

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-foreground">Discover Your Communities</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'sections' ? 'all' : 'sections')}
              className="flex items-center gap-2"
            >
              {viewMode === 'sections' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              {viewMode === 'sections' ? 'View All' : 'Sections'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search communities by name, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categoryTabs.map((tab) => (
            <Button 
              key={tab} 
              variant={activeTab === tab ? "default" : "outline"} 
              size="sm" 
              className={`whitespace-nowrap ${activeTab === tab ? 'bg-[#2196F3] hover:bg-[#2196F3]/90' : ''}`} 
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading communities...</div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">Error: {error}</div>
        </div>
      )}
      
      {!loading && !error && extendedCommunities.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">No communities found.</div>
        </div>
      )}
      
      {!loading && !error && extendedCommunities.length > 0 && (
        <div className="space-y-8">
          {viewMode === 'sections' ? (
            <>
              {/* Recommended Section */}
              {recommendedCommunities.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {activeTab === 'All' ? 'Recommended for You' : `${activeTab} Communities`}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendedCommunities.map((community) => (
                      <CommunityCard key={`rec-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} isLoadingCounts={isLoadingCounts} />
                    ))}
                  </div>
                </div>
              )}

              {/* Show category-specific sections only when "All" is selected */}
              {activeTab === 'All' && (
                <>
                  {/* Education Section */}
                  {educationCommunities.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-4">Education</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {educationCommunities.map((community) => (
                          <CommunityCard key={`education-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} isLoadingCounts={isLoadingCounts} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Data Science Section */}
                  {dataScienceCommunities.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-4">Data Science</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dataScienceCommunities.map((community) => (
                          <CommunityCard key={`data-science-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} isLoadingCounts={isLoadingCounts} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technology Section */}
                  {technologyCommunities.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-4">Technology</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {technologyCommunities.map((community) => (
                          <CommunityCard key={`tech-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} isLoadingCounts={isLoadingCounts} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Games Section */}
                  {gamesCommunities.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-4">Games</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gamesCommunities.map((community) => (
                          <CommunityCard key={`games-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} isLoadingCounts={isLoadingCounts} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            /* View All Mode */
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                All Communities {searchQuery && `(filtered by "${searchQuery}")`} 
                {activeTab !== 'All' && `in ${activeTab}`}
                <span className="text-sm text-muted-foreground ml-2">
                  ({filteredCommunities.length} communities)
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCommunities.map((community) => (
                  <CommunityCard key={`all-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} isLoadingCounts={isLoadingCounts} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}