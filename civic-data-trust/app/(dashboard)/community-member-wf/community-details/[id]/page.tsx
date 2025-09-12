"use client"

import { useRouter } from "next/navigation"
import { Play, MoreHorizontal, Users, Database, FileText, MoreVertical } from "lucide-react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { useCommunity } from "@/app/components/contexts/community-context"
import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import Image from "next/image"
import Breadcrumbs from "@/app/components/dashboard/breadcrumbs";
const mockCommunityPosts = [
  { id: 1, title: "Revolutionary Data Sharing Protocol Implementation", content: "A comprehensive guide to implementing secure data sharing protocols in healthcare environments...", author: "Dr. Alex Chen", timestamp: "2 hours ago", type: "video" as const },
  { id: 2, title: "New Healthcare Analytics Framework Released - Version 3.0", content: "The latest update to our open-source healthcare analytics framework includes improved patient privacy features...", author: "Dr. Sarah Wilson", timestamp: "4 hours ago", type: "video" as const },
  { id: 3, title: "Community Data Privacy Guidelines Update - GDPR Compliance", content: "Updated guidelines ensuring full GDPR compliance for all healthcare data sharing activities...", author: "Maria Rodriguez", timestamp: "6 hours ago", type: "video" as const },
  { id: 4, title: "Machine Learning in Pediatric Diagnosis: Early Results", content: "Preliminary results from our ML model trained on pediatric health data show 87% accuracy...", author: "Prof. Jennifer Kim", timestamp: "8 hours ago", type: "video" as const },
  { id: 5, title: "Mental Health Data Analytics: Breaking the Stigma", content: "How anonymized mental health data is helping researchers understand treatment patterns...", author: "Dr. Michael Torres", timestamp: "12 hours ago", type: "image" as const },
  { id: 6, title: "Genomics Integration: Personalized Medicine Breakthrough", content: "New genomics integration tools allow healthcare providers to incorporate genetic data into treatment decisions...", author: "Dr. Lisa Zhang", timestamp: "1 day ago", type: "video" as const },
  { id: 7, title: "Telehealth Data Insights: Post-Pandemic Healthcare Trends", content: "Analysis of telehealth adoption patterns reveals lasting changes in healthcare delivery...", author: "Robert Anderson", timestamp: "1 day ago", type: "text" as const },
  { id: 8, title: "Drug Discovery Acceleration: AI-Powered Clinical Trials", content: "How artificial intelligence is reducing drug discovery timelines from 10+ years to 5-7 years...", author: "Dr. Amanda Foster", timestamp: "2 days ago", type: "video" as const }
]

const mockPopularPosts = [
  { id: 1, title: "COVID-19 Long-term Effects: Data Analysis", author: "Dr. Smith" },
  { id: 2, title: "Hospital Efficiency Metrics Dashboard", author: "John Davis" },
  { id: 3, title: "Patient Satisfaction Survey Results", author: "Lisa Wong" },
  { id: 4, title: "Medical Device Integration Guide", author: "Tech Team" },
  { id: 5, title: "Healthcare Cost Reduction Strategies", author: "Finance Dept" },
];

// Updated interface for Next.js 15
interface CommunityDetailsPageProps {
  params: Promise<{ id: string }>
}

interface PostCardProps {
  post: typeof mockCommunityPosts[0]
}

function PostCard({ post }: PostCardProps) {
  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-200 border border-primary bg-card">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-32 h-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
            {post.type === 'video' && (<div className="bg-background/90 rounded-full p-2"><Play className="h-4 w-4 text-primary fill-current" /></div>)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-1">{post.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{post.content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PopularPostItem({ post }: { post: typeof mockPopularPosts[0] }) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded transition-colors">
      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center flex-shrink-0"><FileText className="h-4 w-4 text-muted-foreground" /></div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground line-clamp-1">{post.title}</p>
        <p className="text-xs text-muted-foreground">{post.author}</p>
      </div>
    </div>
  )
}

export default function CommunityDetailsPage({ params }: CommunityDetailsPageProps) {
  const { communities, toggleJoinStatus } = useCommunity();
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [communityId, setCommunityId] = useState<string>("")
  const router = useRouter();

  // Use useEffect to resolve the Promise params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setCommunityId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  const community = communities.find(c => c.id.toString() === communityId) || {
    id: parseInt(communityId || "1"),
    name: "Toronto Health Community",
    description: "Tincidunt cursque ipsum sit sit urna arci molestaque tincidunt et commodo. Praesent massa elit faucibus odio elit in adipiscing nec ipsum ut. Vestibulum ipsum sit.",
    memberCount: 123,
    category: "Healthcare",
    isJoined: false,
    tags: ["Healthcare", "Research", "Data"]
  };

  const handleAddToFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleJoinToggle = () => {
    if (community.isJoined) {
      toggleJoinStatus(community.id);
    } else {
      router.push(`/community-member-wf/join-community?communityId=${community.id}`);
    }
  };

  const datasets = 18;

  // Show loading state while params are being resolved
  if (!communityId) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Banner Section */}
      <div className="">
        <Breadcrumbs items={[
          { label: "Community", href: "/community-member-wf/discover-community" }, 
          { label: community.name, href:`/community-member-wf/community-details/communityId=${community.id}` }]} />
        {/* Top illustration banner */}
        <div className="w-full h-40 md:h-48 lg:h-56 rounded-t-lg overflow-hidden relative  bg-gray-400">
          <Image
            src="/Rectangle-4281.png" // Place your illustration image in the public folder and use the correct path
            alt="Community Banner"
            className="w-full h-full object-cover"
            draggable={false}
            fill
            priority
            sizes="50vw"
          />
        </div>

      </div>
      {/* Main community info row */}
      <div className=" bg-transparent rounded-b-lg shadow-sm px-6 py-4 flex flex-col md:flex-row items-center md:items-end justify-between mb-20 -mt-12 z-10">
        <div className="flex items-end gap-6">
          {/* Community logo/avatar */}
          <Avatar className="w-32 h-32 border-4 border-gray-800 shadow-lg bg-background">
            <AvatarFallback className="bg-background text-foreground text-2xl font-semibold">
              {community.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="pb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{community.name}</h1>
            {/* Members avatars and count */}
            <div className="flex items-center gap-2 mt-2">
              {/* Example member avatars */}
              <div className="flex -space-x-2">
                <Image src="https://randomuser.me/api/portraits/men/32.jpg" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white" alt="member" />
                <Image src="https://randomuser.me/api/portraits/women/44.jpg" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white" alt="member" />
                <Image src="https://randomuser.me/api/portraits/men/65.jpg" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white" alt="member" />
                <Image src="https://randomuser.me/api/portraits/women/22.jpg" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white" alt="member" />
              </div>
              <span className="ml-3 text-muted-foreground text-sm font-medium">
                4.8K members
                {/* {(community.memberCount ?? 0).toLocaleString()} members */}
              </span>
            </div>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          {
            community.isJoined && (<Button
              variant="default"
              size="sm"
              className="font-semibold"
              onClick={() => router.push(`/community-member-wf/upload-files?communityId=${community.id}`)}
            >
              + create Post
            </Button>)
          }

          <Button
            variant={community.isJoined ? "outline" : "default"}
            size="sm"
            onClick={handleJoinToggle}
            className="font-semibold"
          >
            {community.isJoined ? "Joined" : "Join"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="px-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleAddToFavorite} className="cursor-pointer">
                {isFavorite ? "Remove from Favourite" : "Add to Favourite"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMute} className="cursor-pointer">
                {isMuted ? "Unmute" : "Mute"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="font-semibold text-foreground mb-2">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{community.description}</p>
          </div>
          <div className={`transition-all duration-300 ${!community.isJoined ? "opacity-90 blur-xs pointer-events-none" : ""}`}>{mockCommunityPosts.map((post) => (<PostCard key={post.id} post={post} />))}</div>
        </div>
        <div className={`w-80${!community.isJoined ? " opacity-90 blur-xs pointer-events-none" : ""}`}>
          <div className="top-6 space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-foreground">Members</span></div><span className="font-semibold text-foreground">{community.memberCount ?? 0}</span></div>
                <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Database className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-foreground">Datasets</span></div><span className="font-semibold text-foreground">{datasets}</span></div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Popular Posts</h3>
              <div className="space-y-2">{mockPopularPosts.map((post) => (<PopularPostItem key={post.id} post={post} />))}</div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}