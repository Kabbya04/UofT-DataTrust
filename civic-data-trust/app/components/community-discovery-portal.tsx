"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Users, Tag, Loader2 } from "lucide-react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { useCommunity } from "../components/contexts/community-context"

const categories = ["All", "Technology", "Environment", "Business", "Arts", "Lifestyle"]

export function CommunityDiscoveryPortal() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  // Added loading states for better UX
  const [loadingCommunityId, setLoadingCommunityId] = useState<number | null>(null)
  const { communities, toggleJoinStatus } = useCommunity()
  const router = useRouter()

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || community.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleCommunityAction = async (communityId: number, isJoined: boolean) => {
    setLoadingCommunityId(communityId)

    // Added artificial delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (isJoined) {
      // Navigate to community details
      router.push(`/community-discovery-and-membership/community-discovery-portal/${communityId}`)
    } else {
      // Join the community
      toggleJoinStatus(communityId)
    }

    setLoadingCommunityId(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl  dark:text-gray-300 sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text ">
            Discover Communities
          </h1>
          <p className="dark:text-gray-300 text-lg">Explore and join communities that match your interests</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-gray-300 h-4 w-4" />
            <Input
              placeholder="Search communities, categories, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto h-12 hover:bg-muted/50 transition-colors duration-200"
              >
                <Filter className="h-4 w-4 mr-2" />
                {selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className=" max-w-fit sm:w-80 text-gray-700 bg-gray-300">
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="cursor-pointer"
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredCommunities.length} communit{filteredCommunities.length === 1 ? "y" : "ies"} found
          </p>
        </div>

        {/* Community Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCommunities.map((community) => (
            <Card
              key={community.id}
              className="group hover:shadow-xl dark:hover:shadow-neutral-300 hover:-translate-y-1 transition-all duration-300 border-0 shadow-2xl shadow-neutral-600 hover:shadow-neutral-300 bg-card/50 backdrop-blur-lg cursor-pointer flex flex-col h-full"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-background group-hover:ring-primary/20 transition-all duration-300">
                    <AvatarImage src={community.coverImage || "/placeholder.svg"} alt={community.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                      {community.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors duration-200">
                      {community.name}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {community.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-4 flex-1 flex flex-col">
                <CardDescription className="text-sm line-clamp-2 leading-relaxed">
                  {community.description}
                </CardDescription>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {community.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs hover:bg-primary/10 transition-colors duration-200"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {community.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{community.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Member Count and Action */}
                <div className="flex  items-center justify-between gap-1 pt-1 mt-auto">
                  <div className="flex flex-col items-center text-sm wrap-anywhere text-muted-foreground cursor-default">
                    <div className="flex">
                      <Users className="h-4 w-4 mr-1" />
                      <p className="font-medium">{community.memberCount.toLocaleString()}</p>
                    </div>
                    <p className="hidden sm:inline ml-1">members</p>
                  </div>

                  <Button
                    size="sm"
                    variant={community.isJoined ? "outline" : "default"}
                    onClick={() => handleCommunityAction(community.id, community.isJoined)}
                    disabled={loadingCommunityId === community.id}
                    className="min-w-[70px] transition-all  cursor-pointer border duration-200 hover:scale-105"
                  >
                    {loadingCommunityId === community.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : community.isJoined ? (
                      "View"
                    ) : (
                      "Join"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCommunities.length === 0 && (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-4 animate-fade-in">
              <Search className="h-16 w-16 mx-auto mb-6 opacity-30" />
              <p className="text-xl font-medium mb-2">No communities found</p>
              <p className="text-base max-w-md mx-auto leading-relaxed">
                Try adjusting your search terms or explore different categories to discover new communities
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
              className="mt-4 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
