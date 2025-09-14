"use client"

import { useState } from "react"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DotsThree } from "phosphor-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useRouter } from "next/navigation"
import Image from "next/image"

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
}

export default function ExpandableContentCard({
  id,
  title,
  author,
  timestamp,
  content,
  videoThumbnail,
  communityName,
}: ContentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const shortContent = content.slice(0, 150) + "..."
  const shouldShowToggle = content.length > 150

  const handleProfileClick = () => {
    router.push(`/community-member-wf/others-profile/${id}`);
  }

  return (
    <Card className="w-full bg-transparent ">
      {/* Video Thumbnail */}
      {videoThumbnail && (
        <div className="relative bg-gray-300 h-48 flex items-center justify-center rounded-lg overflow-hidden">
          <Image
            src={videoThumbnail}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            className="absolute inset-0"
          />
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
                  <DotsThree className="h-4 w-4" />
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
      </div>
    </Card>
  )
}
