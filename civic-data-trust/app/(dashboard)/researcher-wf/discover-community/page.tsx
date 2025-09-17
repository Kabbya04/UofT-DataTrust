"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Image as ImageIcon, RefreshCw, Search, Grid, List, Users, Database } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { useCommunity } from "@/app/components/contexts/community-context"
import { Badge } from "@/app/components/ui/badge"

const categoryTabs = ['All', 'Education', 'Data Science', 'Technology', 'Medicine', 'Research', 'Academic', 'Health', 'Environment', 'Business', 'Internet']

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
}

function CommunityCard({ community, onJoin, onViewDetails }: CommunityCardProps) {
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
            <Badge className="mb-2 bg-brand-blue text-white hover:bg-brand-blue/90 border-0" style={{ backgroundColor: "#2196F3", color: "white" }}>
              {community.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {community.description || 'Research community for collaboration'}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{community.memberCount?.toLocaleString() || '0'} researchers</span>
          </div>
          <div className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span>{community.datasets} datasets</span>
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
            className={`flex-1 ${!community.isJoined ? 'bg-brand-blue hover:bg-brand-blue/90 text-white' : ''}`}
            style={!community.isJoined ? { backgroundColor: "#2196F3", color: "white" } : {}}
            onClick={() => onJoin(community.id)}
          >
            {community.isJoined ? "Joined" : "Join Community"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResearcherDiscoverCommunityPage() {
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
    memberCount: c.memberCount || Math.floor(Math.random() * 2000) + 100
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
      router.push(`/researcher-wf/join-community?communityId=${communityId}`)
    }
  }

  const handleViewDetails = (communityId: string) => {
    router.push(`/researcher-wf/community-details/${communityId}`)
  }

  // Create dynamic sections based on available categories
  const availableCategories = [...new Set(extendedCommunities.map(c => c.category))]

  const recommendedCommunities = filteredCommunities.slice(0, 6) // Increased limit
  const educationCommunities = filteredCommunities.filter(c => c.category === 'Education').slice(0, 6)
  const dataScienceCommunities = filteredCommunities.filter(c => c.category === 'Data Science').slice(0, 6)
  const technologyCommunities = filteredCommunities.filter(c => c.category === 'Technology').slice(0, 6)
  const researchCommunities = filteredCommunities.filter(c => c.category === 'Research').slice(0, 6)

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-foreground">Discover Research Communities</h1>
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
            placeholder="Search research communities by name, description, or category..."
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
              className={`whitespace-nowrap ${activeTab === tab ? 'bg-brand-blue hover:bg-brand-blue/90 text-white' : ''}`}
              style={activeTab === tab ? { backgroundColor: "#2196F3", color: "white" } : {}}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading research communities...</div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">Error: {error}</div>
        </div>
      )}

      {!loading && !error && extendedCommunities.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">No research communities found.</div>
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
                    {activeTab === 'All' ? 'Recommended Research Communities' : `${activeTab} Communities`}
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
                      <h2 className="text-lg font-semibold text-foreground mb-4">Education & Learning</h2>
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
                      <h2 className="text-lg font-semibold text-foreground mb-4">Data Science & Analytics</h2>
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
                      <h2 className="text-lg font-semibold text-foreground mb-4">Technology & Innovation</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {technologyCommunities.map((community) => (
                          <CommunityCard key={`tech-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Research Section */}
                  {researchCommunities.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-4">Academic Research</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {researchCommunities.map((community) => (
                          <CommunityCard key={`research-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} />
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
                All Research Communities {searchQuery && `(filtered by "${searchQuery}")`}
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