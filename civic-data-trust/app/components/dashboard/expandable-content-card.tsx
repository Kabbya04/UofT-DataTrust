"use client"

import { useState, useEffect } from "react"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { MoreHorizontal, Play, Heart, Eye, MessageCircle, TrendingUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { usePostEngagement } from "../../hooks/usePostEngagement"

interface ContentCardProps {
  id: string
  title: string
  author: {
    name: string
    avatar: string
    username: string
  }
  timestamp: string
  content: string
  videoThumbnail?: string
  communityName?: string
  showEngagement?: boolean
}

export default function ExpandableContentCard({
  id,
  title,
  author,
  timestamp,
  content,
  videoThumbnail,
  communityName,
  showEngagement = true,
}: ContentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()
  const { likesCount, viewsCount, isLiked, toggleLike, addView, loading } = usePostEngagement(id)

  const shortContent = content.slice(0, 150) + "..."
  const shouldShowToggle = content.length > 150

  const handleProfileClick = () => {
    router.push(`/community-member-wf/others-profile/${id}`);
  }

  useEffect(() => {
    console.log('🎯 ExpandableContentCard mounted for post:', id)
    if (id) {
      // Add view tracking (non-critical, won't break if it fails)
      addView().catch(error => {
        console.log('⚠️ View tracking failed (non-critical):', error)
      });
    }
  }, [id])

  useEffect(() => {
    console.log('📊 Engagement data updated for post:', id, {
      likesCount,
      viewsCount,
      isLiked,
      loading
    })
  }, [id, likesCount, viewsCount, isLiked, loading])

  return (
    <Card className="w-full bg-transparent border border-primary">
      {/* Video Thumbnail */}
      {videoThumbnail && (
        <div className="relative bg-gray-300 h-48 flex items-center rounded-t-md justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-gray-600 ml-1" />
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Header with title and menu */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold ">{title}</h3>
          <div className="flex items-center gap-2">
            {communityName && <span className="text-sm ">{communityName}</span>}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
                <DropdownMenuItem>Save</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Author info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8 cursor-pointer" onClick={handleProfileClick}>
            <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
            <AvatarFallback className="bg-gray-600 text-white text-sm">
              {author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p
              className="text-sm font-medium cursor-pointer hover:underline"
              onClick={handleProfileClick}
            >
              {author.name}
            </p>
            <p className="text-xs ">{timestamp}</p>
          </div>
        </div>

        {/* Content */}
        <div className="text-sm leading-relaxed mb-3">
          {isExpanded ? content : shouldShowToggle ? shortContent : content}
        </div>

        {/* Toggle button */}
        {shouldShowToggle && (
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto text-sm cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "See Less" : "See More"}
          </Button>
        )}

        {/* Engagement stats */}
        {showEngagement && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  console.log('❤️ Like button clicked for post:', id)
                  console.log('🔄 Current like state:', isLiked)
                  toggleLike()
                }}
                disabled={loading}
                className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-500'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{likesCount}</span>
              </button>

              <div className="flex items-center gap-1 text-gray-500">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{viewsCount}</span>
              </div>

              <div className="flex items-center gap-1 text-gray-500">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">0</span>
              </div>
            </div>

            {likesCount > 10 && (
              <div className="flex items-center gap-1 text-orange-500">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">Trending</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
