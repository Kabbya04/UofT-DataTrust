"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Users,
  Download,
  FileText,
  Database,
  Activity,
  Loader2,
  Heart,
  MessageCircle,
  Plus,
  X,
  Upload,
} from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { useCommunity } from "./contexts/community-context"

const mockUserDatasets = [
  {
    id: 1,
    name: "Sales Analytics Dataset",
    type: "CSV",
    size: "1.5 MB",
    uploadDate: "2024-01-20",
    category: "Business",
    isSharedInCommunity: true,
  },
  {
    id: 2,
    name: "Machine Learning Models",
    type: "Python Scripts",
    size: "3.2 MB",
    uploadDate: "2024-01-18",
    category: "Technology",
    isSharedInCommunity: false,
  },
  {
    id: 3,
    name: "Market Research Data",
    type: "Excel",
    size: "2.8 MB",
    uploadDate: "2024-01-15",
    category: "Business",
    isSharedInCommunity: false,
  },
  {
    id: 4,
    name: "Image Classification Dataset",
    type: "ZIP",
    size: "45.2 MB",
    uploadDate: "2024-01-10",
    category: "AI/ML",
    isSharedInCommunity: true,
  },
]

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
      {
        id: 5,
        name: "Image Classification Models",
        type: "ZIP",
        size: "15.7 MB",
        owner: "Lisa Wang",
        lastUpdated: "2024-01-05",
        downloads: 178,
      },
      {
        id: 6,
        name: "Financial Market Analysis",
        type: "Excel",
        size: "4.1 MB",
        owner: "Alex Thompson",
        lastUpdated: "2024-01-03",
        downloads: 267,
      },
      {
        id: 7,
        name: "Natural Language Processing Toolkit",
        type: "Python Scripts",
        size: "2.9 MB",
        owner: "Maria Garcia",
        lastUpdated: "2023-12-28",
        downloads: 145,
      },
      {
        id: 8,
        name: "Social Media Sentiment Dataset",
        type: "JSON",
        size: "8.3 MB",
        owner: "James Wilson",
        lastUpdated: "2023-12-25",
        downloads: 203,
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
  const [userDatasets, setUserDatasets] = useState(mockUserDatasets)
  const [isAttachDialogOpen, setIsAttachDialogOpen] = useState(false)
  const [attachingDatasets, setAttachingDatasets] = useState<Set<number>>(new Set())
  const [unattachingDatasets, setUnattachingDatasets] = useState<Set<number>>(new Set())

  const { getCommunity, toggleJoinStatus } = useCommunity()
  const router = useRouter()

  const community = getCommunity(communityId)
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

  const userSharedDatasets = userDatasets.filter((dataset) => dataset.isSharedInCommunity)
  const userUnsharedDatasets = userDatasets.filter((dataset) => !dataset.isSharedInCommunity)
  const otherMembersDatasets = extendedDetails?.sharedData || []

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

  const handleAttachDataset = async (datasetId: number) => {
    setAttachingDatasets((prev) => new Set(prev).add(datasetId))
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setUserDatasets((prev) =>
      prev.map((dataset) => (dataset.id === datasetId ? { ...dataset, isSharedInCommunity: true } : dataset)),
    )

    setAttachingDatasets((prev) => {
      const newSet = new Set(prev)
      newSet.delete(datasetId)
      return newSet
    })
  }

  const handleUnattachDataset = async (datasetId: number) => {
    setUnattachingDatasets((prev) => new Set(prev).add(datasetId))
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setUserDatasets((prev) =>
      prev.map((dataset) => (dataset.id === datasetId ? { ...dataset, isSharedInCommunity: false } : dataset)),
    )

    setUnattachingDatasets((prev) => {
      const newSet = new Set(prev)
      newSet.delete(datasetId)
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
            Discover Communities
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
                  <span className="font-semibold">{community.memberCount?.toLocaleString() || '0'}</span>
                  <span className="hidden sm:inline ml-1">members</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  {community.community_category?.name || 'General'}
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger
              value="overview"
              className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Members
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Shared Data
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
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
                      {community.tags?.map((tag) => (
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
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Community Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <span className="text-muted-foreground">Total Members</span>
                      <span className="font-bold text-lg text-primary">{community.memberCount?.toLocaleString() || '0'}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <span className="text-muted-foreground">Shared Resources</span>
                      <span className="font-bold text-lg text-primary">{extendedDetails?.sharedData.length || 0}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant="outline" className="font-semibold">
                        {community.community_category?.name || 'General'}
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

          <TabsContent value="data" className="mt-6 animate-fade-in">
            <div className="space-y-6">
              {/* My Shared Datasets Section */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>My Shared Datasets ({userSharedDatasets.length})</CardTitle>
                      <CardDescription>Datasets you have shared with this community</CardDescription>
                    </div>
                    <Dialog open={isAttachDialogOpen} onOpenChange={setIsAttachDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="hover:scale-105 transition-transform duration-200">
                          <Plus className="h-4 w-4 mr-2" />
                          Attach Dataset
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Attach Dataset to Community</DialogTitle>
                          <DialogDescription>
                            Select datasets to share with the {community.name} community
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {userUnsharedDatasets.length > 0 ? (
                            userUnsharedDatasets.map((dataset) => (
                              <div
                                key={dataset.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors duration-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-primary/10 rounded-lg">{getFileIcon(dataset.type)}</div>
                                  <div>
                                    <p className="font-medium">{dataset.name}</p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                      <span>
                                        {dataset.type} • {dataset.size}
                                      </span>
                                      <Badge variant="outline">{dataset.category}</Badge>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleAttachDataset(dataset.id)}
                                  disabled={attachingDatasets.has(dataset.id)}
                                  className="min-w-[80px] hover:scale-105 transition-transform duration-200"
                                >
                                  {attachingDatasets.has(dataset.id) ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Attach"
                                  )}
                                </Button>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                              <p className="text-muted-foreground mb-4">No datasets available to attach</p>
                              <Button
                                onClick={() => {
                                  setIsAttachDialogOpen(false)
                                  router.push("/upload-dataset")
                                }}
                                className="hover:scale-105 transition-transform duration-200"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload New Dataset
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {userSharedDatasets.length > 0 ? (
                    <div className="space-y-3">
                      {userSharedDatasets.map((dataset) => (
                        <div
                          key={dataset.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">{getFileIcon(dataset.type)}</div>
                            <div>
                              <p className="font-medium">{dataset.name}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>
                                  {dataset.type} • {dataset.size}
                                </span>
                                <span>Uploaded {dataset.uploadDate}</span>
                                <Badge variant="outline">{dataset.category}</Badge>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnattachDataset(dataset.id)}
                            disabled={unattachingDatasets.has(dataset.id)}
                            className="min-w-[100px] hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
                          >
                            {unattachingDatasets.has(dataset.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <X className="h-4 w-4 mr-1" />
                            )}
                            {unattachingDatasets.has(dataset.id) ? "Removing..." : "Unattach"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        You have not shared any datasets with this community yet
                      </p>
                      <Button
                        onClick={() => setIsAttachDialogOpen(true)}
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Attach Dataset
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Community Shared Resources Section */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Community Shared Resources ({otherMembersDatasets.length})</CardTitle>
                  <CardDescription>Files and datasets shared by other community members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {otherMembersDatasets.map((item) => (
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
                            disabled={true}
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(item.id)}
                            // disabled={downloadingFiles.has(item.id)}
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
            </div>
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
