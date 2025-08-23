"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Image as ImageIcon } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { useCommunity } from "./contexts/community-context"

// Category filter tabs
const categoryTabs = [
  'All', 'Internet', 'Games', 'Technology', 'Movies', 'Television', 'Medicine', 'Travel', 'Business'
]

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
  const { communities, toggleJoinStatus } = useCommunity()
  const router = useRouter()

  // Extended communities data to match wireframe
  const extendedCommunities = [
    ...communities.map(c => ({ ...c, datasets: Math.floor(Math.random() * 20) + 5 })),
    // Medicine Communities
    { id: 7, name: "Toronto Health Community", memberCount: 1524, datasets: 16, description: "Healthcare data & research", category: "Medicine", isJoined: false },
    { id: 8, name: "Medical AI Research Hub", memberCount: 892, datasets: 23, description: "AI applications in healthcare", category: "Medicine", isJoined: false },
    { id: 9, name: "Pediatric Data Collective", memberCount: 634, datasets: 12, description: "Child health research data", category: "Medicine", isJoined: true },
    { id: 10, name: "Mental Health Analytics", memberCount: 1089, datasets: 19, description: "Mental health research community", category: "Medicine", isJoined: false },
    { id: 11, name: "Pharmaceutical Insights", memberCount: 756, datasets: 28, description: "Drug research and development", category: "Medicine", isJoined: false },
    { id: 12, name: "Genomics Research Network", memberCount: 2103, datasets: 31, description: "Genetic data and research", category: "Medicine", isJoined: true },
    
    // Technology Communities  
    { id: 13, name: "Open Source Analytics", memberCount: 3245, datasets: 45, description: "Open source data tools", category: "Technology", isJoined: false },
    { id: 14, name: "Machine Learning Collective", memberCount: 2876, datasets: 52, description: "ML models and datasets", category: "Technology", isJoined: true },
    { id: 15, name: "Cloud Computing Forum", memberCount: 1923, datasets: 38, description: "Cloud infrastructure data", category: "Technology", isJoined: false },
    { id: 16, name: "Cybersecurity Research", memberCount: 1456, datasets: 41, description: "Security threat intelligence", category: "Technology", isJoined: false },
    { id: 17, name: "IoT Data Exchange", memberCount: 987, datasets: 26, description: "Internet of Things datasets", category: "Technology", isJoined: true },
    { id: 18, name: "DevOps Metrics Hub", memberCount: 2134, datasets: 33, description: "Software deployment analytics", category: "Technology", isJoined: false },
    
    // Games Communities
    { id: 19, name: "Gaming Analytics Pro", memberCount: 4567, datasets: 67, description: "Game performance metrics", category: "Games", isJoined: false },
    { id: 20, name: "Esports Data League", memberCount: 3421, datasets: 54, description: "Competitive gaming statistics", category: "Games", isJoined: true },
    { id: 21, name: "Indie Game Metrics", memberCount: 1876, datasets: 29, description: "Independent game analytics", category: "Games", isJoined: false },
    { id: 22, name: "VR Gaming Research", memberCount: 1234, datasets: 18, description: "Virtual reality gaming data", category: "Games", isJoined: false },
    { id: 23, name: "Mobile Gaming Insights", memberCount: 2987, datasets: 43, description: "Mobile game user behavior", category: "Games", isJoined: true },
    
    // Movies Communities
    { id: 24, name: "Film Industry Analytics", memberCount: 2345, datasets: 37, description: "Movie box office and trends", category: "Movies", isJoined: false },
    { id: 25, name: "Streaming Data Collective", memberCount: 3456, datasets: 48, description: "Streaming platform analytics", category: "Movies", isJoined: true },
    { id: 26, name: "Documentary Research Hub", memberCount: 1567, datasets: 22, description: "Documentary film data", category: "Movies", isJoined: false },
    { id: 27, name: "Cinema Audience Metrics", memberCount: 1898, datasets: 31, description: "Movie theater attendance", category: "Movies", isJoined: false },
    
    // Television Communities
    { id: 28, name: "TV Ratings Central", memberCount: 2768, datasets: 39, description: "Television viewership data", category: "Television", isJoined: false },
    { id: 29, name: "Streaming Series Metrics", memberCount: 3987, datasets: 56, description: "TV series performance data", category: "Television", isJoined: true },
    { id: 30, name: "Reality TV Analytics", memberCount: 1432, datasets: 24, description: "Reality show audience data", category: "Television", isJoined: false },
    { id: 31, name: "News Media Insights", memberCount: 2234, datasets: 34, description: "News broadcast analytics", category: "Television", isJoined: false },
    
    // Travel Communities
    { id: 32, name: "Travel Patterns Global", memberCount: 4321, datasets: 61, description: "Global travel and tourism data", category: "Travel", isJoined: false },
    { id: 33, name: "Hospitality Analytics", memberCount: 2876, datasets: 42, description: "Hotel and accommodation data", category: "Travel", isJoined: true },
    { id: 34, name: "Flight Data Exchange", memberCount: 1987, datasets: 35, description: "Aviation industry metrics", category: "Travel", isJoined: false },
    { id: 35, name: "Tourism Economics Hub", memberCount: 1543, datasets: 28, description: "Tourism economic impact data", category: "Travel", isJoined: false },
    
    // Business Communities
    { id: 36, name: "Startup Metrics Collective", memberCount: 3654, datasets: 49, description: "Startup performance data", category: "Business", isJoined: false },
    { id: 37, name: "Market Research Forum", memberCount: 2987, datasets: 44, description: "Market analysis and trends", category: "Business", isJoined: true },
    { id: 38, name: "Financial Analytics Pro", memberCount: 4123, datasets: 58, description: "Financial market data", category: "Business", isJoined: false },
    { id: 39, name: "Supply Chain Insights", memberCount: 2345, datasets: 36, description: "Logistics and supply data", category: "Business", isJoined: false },
    { id: 40, name: "E-commerce Analytics", memberCount: 3789, datasets: 52, description: "Online retail metrics", category: "Business", isJoined: true },
  ]

  const filteredCommunities = extendedCommunities.filter(community => {
    const matchesCategory = activeTab === 'All' || community.category === activeTab
    return matchesCategory
  })

  const handleJoinCommunity = (communityId: number) => {
    const community = communities.find(c => c.id === communityId)
    if (community && community.isJoined) {
      // If already joined, leave the community
      toggleJoinStatus(communityId)
    } else {
      // If not joined, redirect to join request form
      router.push(`/community-member-wf/community-discovery-and-membership/join-community-wf?communityId=${communityId}`)
    }
  }

  const handleViewDetails = (communityId: number) => {
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
      <div className="space-y-8">
        {/* Recommended for You */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recommended for You</h2>
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
        </div>

        {/* Internet Section */}
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

        {/* Games Section */}
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
      </div>
    </div>
  )
}