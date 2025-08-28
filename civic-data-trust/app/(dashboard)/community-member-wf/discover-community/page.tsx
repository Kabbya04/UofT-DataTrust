"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";
import { Image as ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { useCommunity } from "@/app/components/contexts/community-context"

const categoryTabs = ['All', 'Internet', 'Games', 'Technology', 'Movies', 'Television', 'Medicine', 'Travel', 'Business']

interface CommunityCardProps {
  community: {
    id: number
    name: string
    memberCount: number
    datasets: number
    description: string
    category: string
    isJoined: boolean
  }
  onJoin: (communityId: number) => void
  onViewDetails: (communityId: number) => void
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
            <div>• {community.memberCount.toLocaleString()} members</div>
            <div>• {community.datasets} datasets</div>
            <div>• {community.description}</div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 text-xs h-7" onClick={() => onViewDetails(community.id)}>View Details</Button>
            <Button size="sm" variant={community.isJoined ? "outline" : "default"} className="flex-1 text-xs h-7" onClick={() => onJoin(community.id)}>
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
  const { communities, toggleJoinStatus } = useCommunity()
  const router = useRouter()

  const extendedCommunities = [
    ...communities.map(c => ({ ...c, datasets: Math.floor(Math.random() * 20) + 5 })),
    { id: 7, name: "Toronto Health Community", memberCount: 1524, datasets: 16, description: "Healthcare data & research", category: "Medicine", isJoined: false },
    { id: 8, name: "Medical AI Research Hub", memberCount: 892, datasets: 23, description: "AI applications in healthcare", category: "Medicine", isJoined: false },
    { id: 19, name: "Gaming Analytics Pro", memberCount: 4567, datasets: 67, description: "Game performance metrics", category: "Games", isJoined: false },
    { id: 24, name: "Film Industry Analytics", memberCount: 2345, datasets: 37, description: "Movie box office and trends", category: "Movies", isJoined: false },
    { id: 28, name: "TV Ratings Central", memberCount: 2768, datasets: 39, description: "Television viewership data", category: "Television", isJoined: false },
    { id: 32, name: "Travel Patterns Global", memberCount: 4321, datasets: 61, description: "Global travel and tourism data", category: "Travel", isJoined: false },
    { id: 38, name: "Financial Analytics Pro", memberCount: 4123, datasets: 58, description: "Financial market data", category: "Business", isJoined: false },
  ]

  const filteredCommunities = extendedCommunities.filter(community => {
    return activeTab === 'All' || community.category === activeTab
  })

  const handleJoinCommunity = (communityId: number) => {
    const community = communities.find(c => c.id === communityId)
    if (community && community.isJoined) {
      toggleJoinStatus(communityId)
    } else {
      router.push(`/community-member-wf/join-community?communityId=${communityId}`)
    }
  }

  const handleViewDetails = (communityId: number) => {
    router.push(`/community-member-wf/community-details/${communityId}`)
  }

  const recommendedCommunities = filteredCommunities.slice(0, 3)
  const internetCommunities = filteredCommunities.filter(c => c.category === 'Technology').slice(0, 3)
  const gamesCommunities = filteredCommunities.filter(c => c.category === 'Games').slice(0, 3)

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Discover Your Communities</h1>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categoryTabs.map((tab) => (
            <Button key={tab} variant={activeTab === tab ? "default" : "outline"} size="sm" className="whitespace-nowrap" onClick={() => setActiveTab(tab)}>
              {tab}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedCommunities.map((community) => (<CommunityCard key={`rec-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} />))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Internet</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {internetCommunities.map((community) => (<CommunityCard key={`internet-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} />))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gamesCommunities.map((community) => (<CommunityCard key={`games-${community.id}`} community={community} onJoin={handleJoinCommunity} onViewDetails={handleViewDetails} />))}
          </div>
        </div>
      </div>
    </div>
  )
}