"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw, Search, Grid, List } from "lucide-react"
import Image from "next/image"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { useCommunity } from "@/app/components/contexts/community-context"

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
    coverImage?: string | null
  }
  onJoin: (communityId: string) => void
  onViewDetails: (communityId: string) => void
}

function CommunityCard({ community, onJoin, onViewDetails }: CommunityCardProps) {
  return (
    <Card className="p-2 hover:shadow-lg transition-all duration-200 border border-border bg-card">
      <div className="flex gap-4 items-start border border-border rounded-lg p-3 mb-3">
        <div className="relative w-[40%] bg-gray-200 rounded-lg overflow-hidden" style={{ aspectRatio: "16/9", minHeight: 80 }}>
          <Image
            src={community.coverImage || "/placeholder.svg"}
            alt={community.name || "Community cover image"}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-1 cursor-pointer hover:text-primary transition-colors" onClick={() => onViewDetails(community.id)}>
              {community.name}
            </h4>
            <div className="space-y-1 text-xs text-muted-foreground mb-3">
              <div>• {community.memberCount?.toLocaleString() || '0'} members</div>
              <div>• {community.datasets} datasets</div>
              <div>• {community.description || 'No description available'}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className=" text-xs h-7 cursor-pointer" onClick={() => onViewDetails(community.id)}>View Details</Button>
        <Button size="sm" variant={community.isJoined ? "outline" : "default"} className=" text-xs h-7  cursor-pointer" onClick={() => onJoin(community.id)}>
          {community.isJoined ? "Joined" : "Join Community"}
        </Button>
      </div>
    </Card>
  )
}

export default function DiscoverCommunityPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'sections' | 'all'>('sections')
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

  // Transform API communities to match the expected format
  const extendedCommunities = communities.map(c => ({
    ...c,
    datasets: Math.floor(Math.random() * 20) + 5,
    category: c.community_category?.name || 'General',
    memberCount: c.memberCount || Math.floor(Math.random() * 2000) + 100,
    coverImage: (c as any).coverImage || null
  }))

  // Filter communities based on search and active tab
  const filteredCommunities = extendedCommunities.filter(community => {
    const matchesSearch =
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
            <Button key={tab} variant={activeTab === tab ? "default" : "outline"} size="sm" className="whitespace-nowrap" onClick={() => setActiveTab(tab)}>
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
                      <CommunityCard key={`rec-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} />
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
                          <CommunityCard key={`education-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} />
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
                          <CommunityCard key={`data-science-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} />
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
                          <CommunityCard key={`tech-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} />
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
                          <CommunityCard key={`games-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} />
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
                  <CommunityCard key={`all-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}