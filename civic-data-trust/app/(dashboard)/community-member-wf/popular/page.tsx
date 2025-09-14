"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Flame, ArrowUp, BarChart3 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import ExpandableContentCard from "@/app/components/dashboard/expandable-content-card"


interface CommunityPost {
  id: string
  title: string
  description: string
  user: {
    id: string
    name: string
    email: string
  }
  community: {
    id: string
    name: string
  }
  created_at: string
  updated_at: string
  file_url?: string
  dataset_id?: string
  likesCount?: number
  viewsCount?: number
}

export default function PopularPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'hot' | 'top' | 'rising'>('hot')

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/community-post', { headers })
      if (response.ok) {
        const data = await response.json()

        const postsWithLikes = await Promise.all(
          data.map(async (post: CommunityPost) => {
            try {
              const likesResponse = await fetch(`/api/community-post-likes/count/${post.id}`, { headers })
              const viewsResponse = await fetch(`/api/community-post-views/count/${post.id}`, { headers })

              let likesCount = 0
              let viewsCount = 0

              if (likesResponse.ok) {
                const likesData = await likesResponse.json()
                // API returns: { status: true, message: "...", data: { count: number } }
                likesCount = likesData.data?.count || 0
              }

              if (viewsResponse.ok) {
                const viewsData = await viewsResponse.json()
                // API returns: { status: true, message: "...", data: { count: number } }
                viewsCount = viewsData.data?.count || 0
              }

              return { ...post, likesCount, viewsCount }
            } catch (error) {
              return { ...post, likesCount: 0, viewsCount: 0 }
            }
          })
        )

        setPosts(postsWithLikes)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case 'top':
        return (b.likesCount || 0) - (a.likesCount || 0)
      case 'rising':
        const aScore = (a.likesCount || 0) + (a.viewsCount || 0) * 0.1
        const bScore = (b.likesCount || 0) + (b.viewsCount || 0) * 0.1
        return bScore - aScore
      default: // hot
        return (b.likesCount || 0) - (a.likesCount || 0)
    }
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading popular posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-4">Popular Posts</h1>
          <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <TabsList>
              <TabsTrigger value="hot"><Flame className="h-4 w-4 mr-2" />Hot</TabsTrigger>
              <TabsTrigger value="top"><ArrowUp className="h-4 w-4 mr-2" />Top</TabsTrigger>
              <TabsTrigger value="rising"><BarChart3 className="h-4 w-4 mr-2" />Rising</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="space-y-4">
          {sortedPosts.map((post, index) => (
            <div key={post.id} className="relative">
              <div className="absolute left-0 top-4 z-10 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">#{index + 1}</span>
              </div>
              <div className="pl-16">
                <ExpandableContentCard
                  id={post.id}
                  title={post.title}
                  author={{
                    name: post.user?.name || `User ${post.user?.id?.slice(0, 8) || 'Unknown'}`,
                    avatar: "/placeholder.svg?height=40&width=40",
                    username: post.user?.email?.split('@')[0] || post.user?.id?.slice(0, 8).toLowerCase() || 'unknown',
                  }}
                  timestamp={new Date(post.created_at).toLocaleDateString()}
                  content={post.description}
                  communityName={post.community?.name}
                  showEngagement={true}
                />
              </div>
              {(post.likesCount || 0) > 10 && (
                <div className="flex items-center gap-1 text-orange-500 text-sm mt-2 ml-16">
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending</span>
                </div>
              )}
            </div>
          ))}
          {sortedPosts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No popular posts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}