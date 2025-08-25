"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Image as ImageIcon } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { useCommunity, type Community } from "./contexts/community-context"

// Category filter tabs
const categoryTabs = [
  'All', 'Internet', 'Games', 'Technology', 'Movies', 'Television', 'Medicine', 'Travel', 'Business'
]

interface CommunityCardProps {
  community: Community
  onJoin: (communityId: string) => void
  onViewDetails: (communityId: string) => void
}

function CommunityCard({ community, onJoin, onViewDetails }: CommunityCardProps) {
  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-200 border border-border bg-card">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-foreground mb-1 cursor-pointer hover:text-primary transition-colors" onClick={() => onViewDetails(community.id)}>
            {community.name}
          </h4>
          <div className="space-y-1 text-xs text-muted-foreground mb-3">
            <div>• {community.memberCount?.toLocaleString()} members</div>
            <div>• {community.description}</div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs h-7"
              onClick={() => onViewDetails(community.id)}
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              variant={community.isJoined ? "outline" : "default"} 
              className="flex-1 text-xs h-7"
              onClick={() => onJoin(community.id)}
            >
              {community.isJoined ? "Joined" : "Join Community"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export function DiscoverCommunityWF() {
  const [activeTab, setActiveTab] = useState('All')
  const { communities, toggleJoinStatus, loading, error } = useCommunity()
  const router = useRouter()

  const filteredCommunities = communities.filter(community => {
    const matchesCategory = activeTab === 'All' || community.category === activeTab
    return matchesCategory
  })

  const handleJoinCommunity = (communityId: string) => {
    const community = communities.find(c => c.id === communityId)
    if (community && community.isJoined) {
      // If already joined, leave the community
      toggleJoinStatus(communityId)
    } else {
      // If not joined, redirect to join request form
      router.push(`/community-member-wf/community-discovery-and-membership/join-community-wf?communityId=${communityId}`)
    }
  }

  const handleViewDetails = (communityId: string) => {
    router.push(`/community-member-wf/community-discovery-and-membership/community-details-wf/${communityId}`)
  }

  // Group communities by category for sections
  const recommendedCommunities = filteredCommunities.slice(0, 3)
  const internetCommunities = filteredCommunities.filter(c => c.category === 'Technology').slice(0, 3)
  const gamesCommunities = filteredCommunities.filter(c => c.category === 'Games').slice(0, 3)

  return (
    <div className="flex-1 p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Discover Your Communities</h1>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 rounded-md text-sm mb-4">
            {error}
          </div>
        )}
        
        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categoryTabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {/* Communities Sections */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading communities...</div>
        </div>
      ) : communities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">No communities available yet.</div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Recommended for You */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Recommended for You</h2>
            {recommendedCommunities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No communities match your current filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedCommunities.map((community) => (
                  <CommunityCard
                    key={`rec-${community.id}`}
                    community={community}
                    onJoin={handleJoinCommunity}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Internet Section */}
          {internetCommunities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Internet</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {internetCommunities.map((community) => (
                  <CommunityCard
                    key={`internet-${community.id}`}
                    community={community}
                    onJoin={handleJoinCommunity}
                    onViewDetails={handleViewDetails}
                  />
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
                  <CommunityCard
                    key={`games-${community.id}`}
                    community={community}
                    onJoin={handleJoinCommunity}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
