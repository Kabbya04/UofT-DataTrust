"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Play, Image, Clock, ChevronUp, ChevronDown, MessageSquare, Share2, Bookmark, Users, Search } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { useCommunity } from "./contexts/community-context"
import { useSearch } from "./contexts/search-context"

// Mock post data based on your wireframe
const mockPosts = [
  {
    id: 1,
    title: "Revolutionary Data Sharing Protocol Enables Secure Cross-Community Collaboration",
    content: "A breakthrough in secure data sharing that allows communities to collaborate while maintaining privacy. This new protocol implements zero-knowledge proofs for data verification without exposure.",
    author: "Alex Chen",
    community: "Data Science Enthusiasts",
    communityId: 1,
    timestamp: "2 hours ago",
    upvotes: 245,
    downvotes: 12,
    comments: 34,
    type: "video",
    thumbnail: "/api/placeholder/400/200",
    isUpvoted: false,
    isDownvoted: false,
    isSaved: false
  },
  {
    id: 2,
    title: "New Urban Agriculture Dataset Available for Community Research Projects",
    content: "Comprehensive dataset covering 15 cities worldwide, including crop yields, soil composition, and urban farming techniques. Perfect for sustainability research.",
    author: "Maria Rodriguez",
    community: "Urban Gardening",
    communityId: 5,
    timestamp: "4 hours ago",
    upvotes: 189,
    downvotes: 8,
    comments: 23,
    type: "image",
    thumbnail: "/api/placeholder/400/200",
    isUpvoted: true,
    isDownvoted: false,
    isSaved: true
  },
  {
    id: 3,
    title: "Community Data Trust Framework: Best Practices for Ethical Data Governance",
    content: "Detailed guidelines for establishing trust in data communities, including governance structures, consent management, and transparent data usage policies.",
    author: "Dr. James Wilson",
    community: "Sustainable Living",
    communityId: 2,
    timestamp: "6 hours ago",
    upvotes: 156,
    downvotes: 5,
    comments: 45,
    type: "text",
    isUpvoted: false,
    isDownvoted: false,
    isSaved: false
  },
  {
    id: 4,
    title: "Open Source Tools for Community Data Visualization and Analysis",
    content: "Collection of powerful visualization tools specifically designed for community-driven data projects. Includes interactive dashboards and real-time analytics.",
    author: "Sarah Kim",
    community: "Blockchain Developers",
    communityId: 6,
    timestamp: "8 hours ago",
    upvotes: 134,
    downvotes: 15,
    comments: 28,
    type: "video",
    thumbnail: "/api/placeholder/400/200",
    isUpvoted: false,
    isDownvoted: false,
    isSaved: false
  },
  {
    id: 5,
    title: "AI-Powered Healthcare Analytics Shows Promising Results in Early Disease Detection",
    content: "Machine learning models trained on anonymized patient data demonstrate 94% accuracy in detecting early-stage conditions, potentially saving thousands of lives.",
    author: "Dr. Emily Zhang",
    community: "Medical AI Research Hub",
    communityId: 8,
    timestamp: "10 hours ago",
    upvotes: 312,
    downvotes: 18,
    comments: 67,
    type: "video",
    thumbnail: "/api/placeholder/400/200",
    isUpvoted: true,
    isDownvoted: false,
    isSaved: false
  },
  {
    id: 6,
    title: "Gaming Industry Releases Largest Open Dataset on Player Behavior Patterns",
    content: "Anonymous gameplay data from 50+ million players across multiple genres, providing insights into engagement, retention, and gaming preferences worldwide.",
    author: "Jordan Martinez",
    community: "Gaming Analytics Pro",
    communityId: 19,
    timestamp: "12 hours ago",
    upvotes: 278,
    downvotes: 22,
    comments: 89,
    type: "image",
    thumbnail: "/api/placeholder/400/200",
    isUpvoted: false,
    isDownvoted: false,
    isSaved: true
  },
  {
    id: 7,
    title: "Climate Change Impact on Travel Patterns: A 5-Year Global Study",
    content: "Comprehensive analysis of how climate events affect travel behavior, tourism patterns, and transportation choices across 200+ destinations worldwide.",
    author: "Prof. Lisa Anderson",
    community: "Travel Patterns Global",
    communityId: 32,
    timestamp: "14 hours ago",
    upvotes: 198,
    downvotes: 11,
    comments: 42,
    type: "text",
    isUpvoted: false,
    isDownvoted: false,
    isSaved: false
  },
  {
    id: 8,
    title: "Real-Time Financial Market Sentiment Analysis Using Social Media Data",
    content: "Advanced NLP techniques applied to social media posts to predict market movements with 78% accuracy. Code and datasets available for community use.",
    author: "Robert Chang",
    community: "Financial Analytics Pro",
    communityId: 38,
    timestamp: "16 hours ago",
    upvotes: 456,
    downvotes: 34,
    comments: 123,
    type: "video",
    thumbnail: "/api/placeholder/400/200",
    isUpvoted: false,
    isDownvoted: false,
    isSaved: true
  },
  {
    id: 9,
    title: "Breakthrough in Quantum Computing Applications for Drug Discovery",
    content: "Research collaboration between pharmaceutical companies and quantum computing experts yields new molecular simulation capabilities, accelerating drug development timelines.",
    author: "Dr. Michelle Park",
    community: "Pharmaceutical Insights",
    communityId: 11,
    timestamp: "18 hours ago",
    upvotes: 534,
    downvotes: 29,
    comments: 156,
    type: "video",
    thumbnail: "/api/placeholder/400/200",
    isUpvoted: true,
    isDownvoted: false,
    isSaved: false
  },
  {
    id: 10,
    title: "Supply Chain Disruptions: Lessons from the Global Semiconductor Shortage",
    content: "In-depth analysis of supply chain vulnerabilities exposed during recent chip shortages, with recommendations for building more resilient logistics networks.",
    author: "Thomas Liu",
    community: "Supply Chain Insights",
    communityId: 39,
    timestamp: "1 day ago",
    upvotes: 289,
    downvotes: 16,
    comments: 78,
    type: "image",
    thumbnail: "/api/placeholder/400/200",
    isUpvoted: false,
    isDownvoted: false,
    isSaved: false
  },
  {
    id: 11,
    title: "Virtual Reality Training Programs Show 300% Improvement in Skill Retention",
    content: "Comparative study between traditional training methods and VR-based learning reveals significant improvements in knowledge retention and practical application.",
    author: "Amanda Foster",
    community: "VR Gaming Research",
    communityId: 22,
    timestamp: "1 day ago",
    upvotes: 367,
    downvotes: 25,
    comments: 94,
    type: "video",
    thumbnail: "/api/placeholder/400/200",
    isUpvoted: false,
    isDownvoted: false,
    isSaved: true
  },
  {
    id: 12,
    title: "Streaming Wars: Data Analytics Reveal Changing Consumer Preferences",
    content: "Detailed analysis of viewing patterns across major streaming platforms shows shift towards international content and shorter series formats.",
    author: "Kevin Rodriguez",
    community: "Streaming Series Metrics",
    communityId: 29,
    timestamp: "1 day ago",
    upvotes: 223,
    downvotes: 19,
    comments: 61,
    type: "image",
    thumbnail: "/api/placeholder/400/200",
    isUpvoted: true,
    isDownvoted: false,
    isSaved: false
  }
]

interface PostCardProps {
  post: typeof mockPosts[0]
  onVote: (postId: number, type: 'up' | 'down') => void
  onSave: (postId: number) => void
  onUserClick: (author: string) => void
}

function PostCard({ post, onVote, onSave, onUserClick }: PostCardProps) {
  const netScore = post.upvotes - post.downvotes

  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-200 border border-border bg-card">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Vote Section */}
          <div className="flex flex-col items-center gap-1 min-w-[40px]">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${post.isUpvoted ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              onClick={() => onVote(post.id, 'up')}
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
            <span className={`text-sm font-medium ${netScore > 0 ? 'text-primary' : netScore < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {netScore > 0 ? '+' : ''}{netScore}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${post.isDownvoted ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
              onClick={() => onVote(post.id, 'down')}
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Post Header */}
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <span className="font-medium text-primary">{post.community}</span>
              <span>•</span>
              <span>Posted by <button 
                className="text-primary hover:underline font-medium"
                onClick={(e) => {
                  e.stopPropagation()
                  onUserClick(post.author)
                }}
              >
                {post.author}
              </button></span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.timestamp}
              </div>
            </div>

            {/* Post Title */}
            <h3 className="text-lg font-semibold mb-2 text-foreground hover:text-primary cursor-pointer transition-colors">
              {post.title}
            </h3>

            {/* Media/Content */}
            <div className="mb-3">
              {post.type === 'video' && (
                <div className="relative bg-muted rounded-lg aspect-video max-w-md overflow-hidden">
                  {post.thumbnail ? (
                    <div className="w-full h-full bg-muted-foreground/10 flex items-center justify-center">
                      <div className="bg-background/90 rounded-full p-3">
                        <Play className="h-6 w-6 text-primary fill-current" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-muted-foreground/10 flex items-center justify-center">
                      <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              )}
              {post.type === 'image' && (
                <div className="relative bg-muted rounded-lg aspect-video max-w-md overflow-hidden">
                  <div className="w-full h-full bg-muted-foreground/10 flex items-center justify-center">
                    <Image className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            {/* Post Content */}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {post.content}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
                <MessageSquare className="h-4 w-4 mr-1" />
                {post.comments} comments
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${post.isSaved ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => onSave(post.id)}
              >
                <Bookmark className={`h-4 w-4 mr-1 ${post.isSaved ? 'fill-current' : ''}`} />
                Save
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


export function CommunityDiscoveryPortalWF() {
  const [posts, setPosts] = useState(mockPosts)
  const { communities } = useCommunity()
  const { searchQuery } = useSearch()
  const router = useRouter()

  // Filter communities based on search query and get popular ones
  const filteredCommunities = searchQuery.trim()
    ? communities.filter(community =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : communities

  const popularCommunities = filteredCommunities
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 3)

  const handleVote = (postId: number, type: 'up' | 'down') => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          if (type === 'up') {
            return {
              ...post,
              isUpvoted: !post.isUpvoted,
              isDownvoted: false,
              upvotes: post.isUpvoted ? post.upvotes - 1 : post.upvotes + 1,
              downvotes: post.isDownvoted ? post.downvotes - 1 : post.downvotes
            }
          } else {
            return {
              ...post,
              isDownvoted: !post.isDownvoted,
              isUpvoted: false,
              downvotes: post.isDownvoted ? post.downvotes - 1 : post.downvotes + 1,
              upvotes: post.isUpvoted ? post.upvotes - 1 : post.upvotes
            }
          }
        }
        return post
      })
    )
  }

  const handleSave = (postId: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    )
  }

  // Filter posts based on search query
  const filteredPosts = searchQuery.trim() 
    ? posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.community.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts

  const sortedPosts = [...filteredPosts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <div className="flex-1 flex">
      {/* Main Feed */}
      <div className="flex-1 p-6">
        {/* Top Row - Featured Posts */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="aspect-video bg-muted flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center p-4">
              <div className="bg-background/90 rounded-full p-3 mx-auto mb-2">
                <Play className="h-8 w-8 text-primary fill-current" />
              </div>
              <h4 className="font-medium text-sm mb-2">AI Healthcare Revolution</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Revolutionary AI system predicts patient outcomes with 95% accuracy, transforming emergency care protocols worldwide.</p>
            </div>
          </Card>
          
          <Card className="aspect-video bg-muted flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center p-4">
              <div className="bg-background/90 rounded-full p-3 mx-auto mb-2">
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-sm mb-2">Global Climate Data Hub</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Massive climate dataset released covering 50 years of global weather patterns, enabling breakthrough research.</p>
            </div>
          </Card>
          
          <Card className="aspect-video bg-muted flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center p-4">
              <div className="bg-background/90 rounded-full p-3 mx-auto mb-2">
                <Play className="h-8 w-8 text-primary fill-current" />
              </div>
              <h4 className="font-medium text-sm mb-2">Quantum Computing Breakthrough</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">New quantum algorithm solves complex optimization problems 1000x faster than traditional computers.</p>
            </div>
          </Card>
        </div>

        {/* Latest Section */}
        <div>
          <h2 className="text-xl font-bold mb-6">
            {searchQuery.trim() ? `Search Results for "${searchQuery}"` : 'Latest (Based on your interest)'}
          </h2>
          
          {/* Posts Feed */}
          <div className="space-y-4">
            {sortedPosts.length > 0 ? (
              sortedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onVote={handleVote}
                  onSave={handleSave}
                  onUserClick={(author) => {
                    const userId = author.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                    router.push(`/community-member-wf/authentication-profile/user-profile-wf/${userId}`)
                  }}
                />
              ))
            ) : searchQuery.trim() ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No posts found</h3>
                  <p className="text-sm">Try adjusting your search terms or browse all content.</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-muted/20 border-l border-border p-6">
        <div className="sticky top-6">
          {/* Popular Communities */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-4">
              {searchQuery.trim() ? 'Matching Communities' : 'Popular Communities'}
            </h3>
            <div className="space-y-3">
              {popularCommunities.length > 0 ? (
                popularCommunities.map((community) => (
                <Card key={community.id} className="p-4">
                  <h4 className="font-semibold text-sm mb-2">{community.name}</h4>
                  <div className="space-y-1 text-xs text-muted-foreground mb-3">
                    <div>• {community.memberCount.toLocaleString()} members</div>
                    <div>• 16 datasets</div>
                    <div>• {community.category}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs px-2 py-1 h-7 whitespace-nowrap"
                      onClick={() => router.push(`/community-member-wf/community-discovery-and-membership/community-details-wf/${community.id}`)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="text-xs px-2 py-1 h-7 whitespace-nowrap flex-1 min-w-0"
                      onClick={() => router.push(`/community-member-wf/community-discovery-and-membership/join-community-wf?communityId=${community.id}`)}
                    >
                      Join Community
                    </Button>
                  </div>
                </Card>
                ))
              ) : searchQuery.trim() ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No communities found matching your search.</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}