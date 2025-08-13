"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Users, Download, FileText, Database, Activity, Loader2, Heart, MessageCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Input } from "../components/ui/input"
import { Separator } from "../components/ui/separator"
import { useCommunity } from "./contexts/community-context"

// Mock data for extended community details
const mockCommunityDetails = {
  1: {
    mission: "To democratize data science knowledge and foster collaboration among practitioners at all levels.",
    rules: [
      "Be respectful and professional in all interactions",
      "Share knowledge freely and help others learn",
      "No spam or self-promotion without prior approval",
      "Keep discussions relevant to data science topics",
      "Respect intellectual property and cite sources",
    ],
    members: [
      {
        id: 1,
        name: "Sarah Chen",
        role: "Admin",
        avatar: "/placeholder.svg?height=40&width=40&text=SC",
        joinDate: "2023-01-15",
      },
      {
        id: 2,
        name: "Michael Rodriguez",
        role: "Moderator",
        avatar: "/placeholder.svg?height=40&width=40&text=MR",
        joinDate: "2023-02-20",
      },
      {
        id: 3,
        name: "Emily Johnson",
        role: "Member",
        avatar: "/placeholder.svg?height=40&width=40&text=EJ",
        joinDate: "2023-03-10",
      },
      {
        id: 4,
        name: "David Kim",
        role: "Member",
        avatar: "/placeholder.svg?height=40&width=40&text=DK",
        joinDate: "2023-03-25",
      },
      {
        id: 5,
        name: "Lisa Wang",
        role: "Member",
        avatar: "/placeholder.svg?height=40&width=40&text=LW",
        joinDate: "2023-04-05",
      },
    ],
    sharedData: [
      {
        id: 1,
        name: "Customer Segmentation Dataset",
        type: "CSV",
        size: "2.3 MB",
        owner: "Sarah Chen",
        lastUpdated: "2024-01-15",
        downloads: 234,
      },
      {
        id: 2,
        name: "ML Model Performance Analysis",
        type: "Jupyter Notebook",
        size: "1.8 MB",
        owner: "Michael Rodriguez",
        lastUpdated: "2024-01-12",
        downloads: 156,
      },
      {
        id: 3,
        name: "Data Visualization Templates",
        type: "Python Scripts",
        size: "850 KB",
        owner: "Emily Johnson",
        lastUpdated: "2024-01-10",
        downloads: 89,
      },
      {
        id: 4,
        name: "Time Series Forecasting Guide",
        type: "PDF",
        size: "3.2 MB",
        owner: "David Kim",
        lastUpdated: "2024-01-08",
        downloads: 312,
      },
    ],
    activities: [
      {
        id: 1,
        type: "member_joined",
        user: "Lisa Wang",
        timestamp: "2 hours ago",
        description: "joined the community",
      },
      {
        id: 2,
        type: "data_uploaded",
        user: "Sarah Chen",
        timestamp: "1 day ago",
        description: "uploaded Customer Segmentation Dataset",
      },
      {
        id: 3,
        type: "member_joined",
        user: "Alex Thompson",
        timestamp: "2 days ago",
        description: "joined the community",
      },
      {
        id: 4,
        type: "discussion",
        user: "Michael Rodriguez",
        timestamp: "3 days ago",
        description: "started a discussion about 'Best Practices for Feature Engineering'",
      },
    ],
  },
}

interface CommunityDetailsViewerProps {
  communityId: string
}

export function CommunityDetailsViewer({ communityId }: CommunityDetailsViewerProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [memberSearch, setMemberSearch] = useState("")
  // Added loading states for better interactions
  const [isJoining, setIsJoining] = useState(false)
  const [downloadingFiles, setDownloadingFiles] = useState<Set<number>>(new Set())
  const { getCommunity, toggleJoinStatus } = useCommunity()
  const router = useRouter()

  const community = getCommunity(Number.parseInt(communityId))
  const extendedDetails = mockCommunityDetails[communityId as unknown as keyof typeof mockCommunityDetails]

  if (!community) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Users className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Community Not Found</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            The community you are looking for does not exist or may have been removed.
          </p>
          <Button
            onClick={() => router.push("/communities")}
            className="hover:scale-105 transition-transform duration-200"
          >
            Go Back to Communities
          </Button>
        </div>
      </div>
    )
  }

  const filteredMembers =
    extendedDetails?.members.filter(
      (member) =>
        member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        member.role.toLowerCase().includes(memberSearch.toLowerCase()),
    ) || []

  const handleJoinLeave = async () => {
    setIsJoining(true)
    // Added artificial delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toggleJoinStatus(community.id)
    setIsJoining(false)
  }

  const handleBackNavigation = () => {
    router.push("/community-discovery-and-membership/community-discovery-portal")
  }

  const handleDownload = async (fileId: number) => {
    setDownloadingFiles((prev) => new Set(prev).add(fileId))
    // Simulate download process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setDownloadingFiles((prev) => {
      const newSet = new Set(prev)
      newSet.delete(fileId)
      return newSet
    })
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "csv":
      case "excel":
        return <Database className="h-4 w-4" />
      case "pdf":
        return <FileText className="h-4 w-4" />
      case "jupyter notebook":
        return <FileText className="h-4 w-4" />
      case "python scripts":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "member_joined":
        return <Users className="h-4 w-4" />
      case "data_uploaded":
        return <Database className="h-4 w-4" />
      case "discussion":
        return <Activity className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackNavigation}
            className="p-0 h-auto hover:text-primary transition-colors duration-200 hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Discover Community
          </Button>
          <span>/</span>
          <span className="text-foreground font-medium">{community.name}</span>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <div className="relative h-56 sm:h-64 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl mb-6 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            <div className="absolute bottom-6 left-6 text-white max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 drop-shadow-lg">{community.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-2">
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="font-semibold">{community.memberCount.toLocaleString()}</span>
                  <span className="hidden sm:inline ml-1">members</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  {community.category}
                </Badge>
              </div>
            </div>

            <div className="absolute bottom-6 right-6">
              <Button
                size="lg"
                variant={community.isJoined ? "outline" : "default"}
                onClick={handleJoinLeave}
                disabled={isJoining}
                className={`min-w-[140px] transition-all duration-300 hover:scale-105 ${
                  community.isJoined
                    ? "bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                    : "shadow-lg hover:shadow-xl"
                }`}
              >
                {isJoining ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : community.isJoined ? (
                  <Heart className="h-4 w-4 mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isJoining ? "Processing..." : community.isJoined ? "Leave Community" : "Join Community"}
              </Button>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-4xl leading-relaxed">{community.description}</p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
          <TabsList className="grid w-full grid-cols-4 h-12 p-2 gap-2 transition-all duration-300 border-0 shadow-xl shadow-neutral-600  backdrop-blur-xl  ">
            <TabsTrigger
              value="overview"
              className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-neutral-300 hover:shadow-md hover:shadow-neutral-500 dark:hover:shadow-neutral-500 hover:-translate-y-1 cursor-pointer "
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-neutral-300 hover:shadow-md hover:shadow-neutral-500 dark:hover:shadow-neutral-500 hover:-translate-y-1 cursor-pointer"
            >
              Members
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-neutral-300 hover:shadow-md hover:shadow-neutral-500 dark:hover:shadow-neutral-500 hover:-translate-y-1 cursor-pointer"
            >
              Shared Data
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-neutral-300 hover:shadow-md hover:shadow-neutral-500 dark:hover:shadow-neutral-500 hover:-translate-y-1 cursor-pointer"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      About This Community
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{extendedDetails?.mission}</p>
                    <div className="flex flex-wrap gap-2">
                      {community.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="hover:bg-primary/10 transition-colors duration-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Community Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {extendedDetails?.rules.map((rule, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                        >
                          <span className="text-primary font-semibold bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground leading-relaxed">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Community Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 ">
                    <div className="flex items-center justify-between p-3 rounded-l bg-gray-500 dark:bg-gray-700">
                      <span className="text-muted-foreground">Total Members</span>
                      <span className="font-bold text-lg text-primary">{community.memberCount.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between p-3 rounded-l bg-gray-500 dark:bg-gray-700">
                      <span className="text-muted-foreground">Shared Resources</span>
                      <span className="font-bold text-lg text-primary">{extendedDetails?.sharedData.length || 0}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-500 dark:bg-gray-700">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant="outline" className="font-semibold">
                        {community.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="mt-6 animate-fade-in">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle>Community Members ({filteredMembers.length})</CardTitle>
                  <div className="w-full sm:w-64">
                    <Input
                      placeholder="Search members..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="ring-2 ring-background hover:ring-primary/20 transition-all duration-200">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium hover:text-primary transition-colors duration-200">{member.name}</p>
                          <p className="text-sm text-muted-foreground">Joined {member.joinDate}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          member.role === "Admin" ? "default" : member.role === "Moderator" ? "secondary" : "outline"
                        }
                        className="transition-all duration-200 hover:scale-105"
                      >
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shared Data Tab */}
          <TabsContent value="data" className="mt-6 animate-fade-in">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Shared Resources ({extendedDetails?.sharedData.length || 0})</CardTitle>
                <CardDescription>Files and datasets shared by community members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {extendedDetails?.sharedData.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">{getFileIcon(item.type)}</div>
                        <div>
                          <p className="font-medium hover:text-primary transition-colors duration-200">{item.name}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-medium">
                              {item.type} • {item.size}
                            </span>
                            <span>by {item.owner}</span>
                            <span>Updated {item.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground font-medium">{item.downloads} downloads</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(item.id)}
                          disabled={downloadingFiles.has(item.id)}
                          className="min-w-[100px] hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105"
                        >
                          {downloadingFiles.has(item.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          {downloadingFiles.has(item.id) ? "Downloading..." : "Download"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-6 animate-fade-in">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and events in the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {extendedDetails?.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/30 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="p-2 bg-primary/10 rounded-full">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">
                          <span className="font-medium hover:text-primary transition-colors duration-200 cursor-pointer">
                            {activity.user}
                          </span>{" "}
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
