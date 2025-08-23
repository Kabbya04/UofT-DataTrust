"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, Clock, Users, Database, Flame, ChevronUp, ChevronDown, MessageSquare, Share2, Bookmark, Eye, ArrowUp, BarChart3 } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { useCommunity } from "./contexts/community-context"

// Enhanced mock posts with popularity metrics
const popularPosts = [
  {
    id: 1,
    title: "AI Breakthrough: 99.7% Accuracy in Cancer Detection Using Medical Imaging",
    content: "Revolutionary deep learning model trained on 2.3 million medical images achieves unprecedented accuracy in early cancer detection, potentially saving millions of lives worldwide.",
    author: "Dr. Sarah Chen",
    community: "Medical AI Research Hub",
    communityId: 8,
    timestamp: "6 hours ago",
    timestampMs: Date.now() - (6 * 60 * 60 * 1000), // 6 hours ago
    upvotes: 15847,
    downvotes: 234,
    comments: 892,
    views: 45623,
    type: "video",
    isHot: true,
    trend: "rising"
  },
  {
    id: 2,
    title: "Global Climate Dataset: 150 Years of Weather Data Now Open Source",
    content: "Massive dataset containing 150 years of global climate data released for public research, including temperature, precipitation, and atmospheric conditions from 15,000 stations worldwide.",
    author: "Prof. Michael Anderson",
    community: "Climate Science Collective",
    communityId: 15,
    timestamp: "12 hours ago",
    timestampMs: Date.now() - (12 * 60 * 60 * 1000), // 12 hours ago
    upvotes: 12456,
    downvotes: 189,
    comments: 634,
    views: 38291,
    type: "image",
    isHot: true,
    trend: "stable"
  },
  {
    id: 3,
    title: "Quantum Computing Achieves 1000x Speedup in Financial Risk Modeling",
    content: "IBM's quantum computer successfully processes complex financial risk calculations in minutes that previously took days, revolutionizing investment strategy optimization.",
    author: "Dr. Lisa Park",
    community: "Financial Analytics Pro",
    communityId: 38,
    timestamp: "1 day ago",
    timestampMs: Date.now() - (24 * 60 * 60 * 1000), // 1 day ago
    upvotes: 9876,
    downvotes: 145,
    comments: 456,
    views: 29847,
    type: "video",
    isHot: false,
    trend: "rising"
  },
  {
    id: 4,
    title: "Gaming AI Creates Unbeatable Strategies Across 50+ Game Genres",
    content: "DeepMind's latest AI system masters diverse gaming environments, from strategy games to first-person shooters, providing insights into human decision-making patterns.",
    author: "Alex Rodriguez",
    community: "Gaming Analytics Pro",
    communityId: 19,
    timestamp: "1 day ago",
    timestampMs: Date.now() - (25 * 60 * 60 * 1000), // 1 day and 1 hour ago
    upvotes: 8765,
    downvotes: 321,
    comments: 723,
    views: 26534,
    type: "video",
    isHot: false,
    trend: "falling"
  },
  {
    id: 5,
    title: "Breakthrough in Supply Chain Optimization Reduces Costs by 40%",
    content: "Machine learning algorithm analyzes global supply chain data to optimize logistics routes, reducing transportation costs and carbon emissions significantly.",
    author: "Jennifer Liu",
    community: "Supply Chain Insights",
    communityId: 39,
    timestamp: "2 days ago",
    timestampMs: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
    upvotes: 7234,
    downvotes: 98,
    comments: 287,
    views: 21456,
    type: "text",
    isHot: false,
    trend: "stable"
  },
  {
    id: 6,
    title: "VR Medical Training Reduces Surgical Errors by 70% in Clinical Trials",
    content: "Virtual reality training programs for surgeons show dramatic improvement in precision and reduced errors, revolutionizing medical education worldwide.",
    author: "Dr. Robert Kim",
    community: "VR Gaming Research",
    communityId: 22,
    timestamp: "3 days ago",
    timestampMs: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
    upvotes: 6789,
    downvotes: 156,
    comments: 445,
    views: 19876,
    type: "video",
    isHot: false,
    trend: "rising"
  }
]

const trendingCommunities = [
  { id: 8, name: "Medical AI Research Hub", members: 45678, growth: "+234%", datasets: 156, category: "Medicine" },
  { id: 19, name: "Gaming Analytics Pro", members: 38291, growth: "+189%", datasets: 143, category: "Games" },
  { id: 38, name: "Financial Analytics Pro", members: 29847, growth: "+156%", datasets: 128, category: "Business" },
  { id: 15, name: "Climate Science Collective", members: 26534, growth: "+145%", datasets: 198, category: "Environment" },
  { id: 22, name: "VR Gaming Research", members: 21456, growth: "+134%", datasets: 87, category: "Technology" }
]

interface PopularPostCardProps {
  post: typeof popularPosts[0]
  rank: number
  onVote: (postId: number, type: 'up' | 'down') => void
}

function PopularPostCard({ post, rank, onVote }: PopularPostCardProps) {
  const netScore = post.upvotes - post.downvotes
  const router = useRouter()

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-3 w-3 text-foreground" />
      case 'falling': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
      default: return <TrendingUp className="h-3 w-3 text-muted-foreground rotate-90" />
    }
  }

  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-200 border border-border bg-card">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Rank and Vote Section */}
          <div className="flex flex-col items-center gap-1 min-w-[50px]">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">#{rank}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:text-primary"
              onClick={() => onVote(post.id, 'up')}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <span className={`text-xs font-medium ${netScore > 0 ? 'text-foreground' : netScore < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
              {netScore > 999 ? `${(netScore / 1000).toFixed(1)}k` : netScore}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:text-destructive"
              onClick={() => onVote(post.id, 'down')}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Post Header */}
            <div className="flex items-center gap-2 mb-2 text-sm">
              <span 
                className="font-medium text-primary cursor-pointer hover:underline"
                onClick={() => router.push(`/community-member-wf/community-discovery-and-membership/community-details-wf/${post.communityId}`)}
              >
                {post.community}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">by {post.author}</span>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.timestamp}
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(post.trend)}
              </div>
              {post.isHot && (
                <Badge variant="destructive" className="px-1.5 py-0 text-xs">
                  <Flame className="h-3 w-3 mr-1" />
                  HOT
                </Badge>
              )}
            </div>

            {/* Post Title */}
            <h3 className="text-lg font-semibold mb-2 text-foreground hover:text-primary cursor-pointer transition-colors">
              {post.title}
            </h3>

            {/* Post Content */}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {post.content}
            </p>

            {/* Engagement Metrics */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.views.toLocaleString()} views
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {post.comments} comments
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {post.trend} trend
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
                <MessageSquare className="h-3 w-3 mr-1" />
                Comment
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
                <Share2 className="h-3 w-3 mr-1" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
                <Bookmark className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TrendingCommunityCard({ community, rank }: { community: typeof trendingCommunities[0], rank: number }) {
  const router = useRouter()

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">#{rank}</span>
          </div>
          <div>
            <h4 
              className="font-semibold text-sm hover:text-primary transition-colors"
              onClick={() => router.push(`/community-member-wf/community-discovery-and-membership/community-details-wf/${community.id}`)}
            >
              {community.name}
            </h4>
            <Badge variant="secondary" className="text-xs mt-1">{community.category}</Badge>
          </div>
        </div>
        <Badge variant="secondary" className="bg-muted text-foreground">{community.growth}</Badge>
      </div>
      
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {community.members.toLocaleString()} members
        </div>
        <div className="flex items-center gap-1">
          <Database className="h-3 w-3" />
          {community.datasets} datasets
        </div>
      </div>
    </Card>
  )
}

export function PopularWF() {
  const [posts, setPosts] = useState(popularPosts)
  const [sortBy, setSortBy] = useState<'hot' | 'top' | 'rising'>('hot')

  console.log('Current sort mode:', sortBy)

  const handleVote = (postId: number, type: 'up' | 'down') => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          if (type === 'up') {
            return { ...post, upvotes: post.upvotes + 1 }
          } else {
            return { ...post, downvotes: post.downvotes + 1 }
          }
        }
        return post
      })
    )
  }

  const sortedPosts = [...posts].sort((a, b) => {
    let result = 0
    if (sortBy === 'hot') {
      // Hot algorithm: combines votes, comments, and views with recency boost
      const aScore = (a.upvotes - a.downvotes) + (a.comments * 2) + (a.views / 100)
      const bScore = (b.upvotes - b.downvotes) + (b.comments * 2) + (b.views / 100)
      result = bScore - aScore
    } else if (sortBy === 'top') {
      // Top algorithm: pure vote score (upvotes - downvotes)
      result = (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
    } else {
      // Rising algorithm: posts with high engagement relative to views
      const aRatio = (a.upvotes - a.downvotes + a.comments) / Math.max(a.views / 1000, 1)
      const bRatio = (b.upvotes - b.downvotes + b.comments) / Math.max(b.views / 1000, 1)
      result = bRatio - aRatio
    }
    return result
  })

  console.log(`Sorted by ${sortBy}:`, sortedPosts.slice(0, 3).map(p => ({ id: p.id, title: p.title.slice(0, 30), upvotes: p.upvotes, downvotes: p.downvotes, comments: p.comments, views: p.views })))

  return (
    <div className="flex-1 flex">
      {/* Main Feed */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-4">Popular Posts</h1>
          <p className="text-sm text-muted-foreground mb-4">
            {sortBy === 'hot' && 'Posts ranked by engagement and recency'}
            {sortBy === 'top' && 'Posts ranked by total votes (upvotes - downvotes)'}
            {sortBy === 'rising' && 'Posts gaining momentum quickly'}
          </p>
          
          {/* Sort Options */}
          <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as 'hot' | 'top' | 'rising')}>
            <TabsList>
              <TabsTrigger value="hot" className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Hot
              </TabsTrigger>
              <TabsTrigger value="top" className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4" />
                Top
              </TabsTrigger>
              <TabsTrigger value="rising" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Rising
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {sortedPosts.map((post, index) => (
            <PopularPostCard
              key={post.id}
              post={post}
              rank={index + 1}
              onVote={handleVote}
            />
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-muted/20 border-l border-border p-6">
        <div className="sticky top-6">
          {/* Trending Communities */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending Communities
            </h3>
            <div className="space-y-3">
              {trendingCommunities.map((community, index) => (
                <TrendingCommunityCard
                  key={community.id}
                  community={community}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}