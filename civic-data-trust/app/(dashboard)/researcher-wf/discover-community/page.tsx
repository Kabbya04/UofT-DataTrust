"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { useCommunity } from "@/app/components/contexts/community-context"
import { getCommunityImage } from "@/app/utils/image-mapping"

const categoryTabs = ['All', 'Internet', 'Games', 'Technology', 'Movies', 'Television', 'Medicine', 'Travel', 'Business']

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
    <Card className="p-2 hover:shadow-lg w-fit transition-all duration-200 border border-border bg-card">
      <div className="flex items-start gap-3 mb-3">
        <div className="relative w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
          <Image
            src={getCommunityImage(community.id)}
            alt={community.name}
            fill
            style={{ objectFit: "cover" }}
            sizes="48px"
            priority={false}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-foreground mb-1 cursor-pointer hover:text-primary transition-colors" onClick={() => onViewDetails(community.id)}>
            {community.name}
          </h4>
          <div className="space-y-1 text-xs text-muted-foreground mb-3">
            <div>• {community.memberCount?.toLocaleString() || '0'} members</div>
            <div>• {community.datasets} datasets</div>
            <div>• {community.description || 'No description available'}</div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-xs h-7 cursor-pointer" onClick={() => onViewDetails(community.id)}>View Details</Button>
            <Button size="sm" variant={community.isJoined ? "outline" : "default"} className="text-xs h-7 cursor-pointer" onClick={() => onJoin(community.id)}>
              {community.isJoined ? "Joined" : "Join Community"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function DiscoverCommunityPage() {
  const [activeTab, setActiveTab] = useState('All')
  const { communities, loading, error, toggleJoinStatus } = useCommunity()
  const router = useRouter()

  // Transform API communities to match the expected format
  const extendedCommunities = communities.map(c => ({
    ...c,
    datasets: Math.floor(Math.random() * 20) + 5,
    category: c.community_category?.name || 'General',
    memberCount: c.memberCount || Math.floor(Math.random() * 2000) + 100
  }));

  const filteredCommunities = extendedCommunities.filter(community => activeTab === 'All' || community.category === activeTab);

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
  
  const recommendedCommunities = filteredCommunities.slice(0, 3);
  const internetCommunities = filteredCommunities.filter(c => c.category === 'Technology').slice(0, 3);
  const gamesCommunities = filteredCommunities.filter(c => c.category === 'Games').slice(0, 3);

  return (
    <div className="flex-1 p-6">
      <div className="mb-6"><h1 className="text-2xl font-bold text-foreground mb-4">Discover Your Communities</h1><div className="flex gap-2 overflow-x-auto pb-2">{categoryTabs.map((tab) => (<Button key={tab} variant={activeTab === tab ? "default" : "outline"} size="sm" className="whitespace-nowrap" onClick={() => setActiveTab(tab)}>{tab}</Button>))}</div></div>
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
          <div><h2 className="text-lg font-semibold text-foreground mb-4">Recommended for You</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{recommendedCommunities.map((community) => (<CommunityCard key={`rec-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} />))}</div></div>
        <div><h2 className="text-lg font-semibold text-foreground mb-4">Internet</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{internetCommunities.map((community) => (<CommunityCard key={`internet-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} />))}</div></div>
          <div><h2 className="text-lg font-semibold text-foreground mb-4">Games</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{gamesCommunities.map((community) => (<CommunityCard key={`games-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} />))}</div></div>
        </div>
      )}
    </div>
  )
}