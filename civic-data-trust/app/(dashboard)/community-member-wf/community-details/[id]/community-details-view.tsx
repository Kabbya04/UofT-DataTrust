// app/(dashboard)/community-member-wf/community-details/[id]/community-details-view.tsx
"use client";

import { useRouter } from "next/navigation";
import { Play, MoreHorizontal, Users, Database, FileText } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { useCommunity } from "@/app/components/contexts/community-context";

const mockCommunityPosts = [
  { id: 1, title: "Revolutionary Data Sharing Protocol Implementation", content: "A comprehensive guide to implementing secure data sharing protocols...", author: "Dr. Alex Chen", timestamp: "2 hours ago", type: "video" as const },
  { id: 2, title: "New Healthcare Analytics Framework Released - Version 3.0", content: "The latest update to our open-source healthcare analytics framework...", author: "Dr. Sarah Wilson", timestamp: "4 hours ago", type: "video" as const },
];
const mockPopularPosts = [
  { id: 1, title: "COVID-19 Long-term Effects: Data Analysis", author: "Dr. Smith" },
  { id: 2, title: "Hospital Efficiency Metrics Dashboard", author: "John Davis" },
];

function PostCard({ post }: { post: typeof mockCommunityPosts[0] }) {
  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-200 border border-border bg-card">
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
export default function CommunityDetailsView({ id }: { id: string }) {
  const router = useRouter();
  const { communities, toggleJoinStatus } = useCommunity();

  // FIX: Add this guard clause to ensure router is not null
  if (!router) {
    return null; // Render nothing until the router is available
  }

  const community = communities.find(c => c.id.toString() === id) || {
    id: parseInt(id), name: "Toronto Health Community",
    description: "Tincidunt cursque ipsum sit sit urna arci molestaque tincidunt et commodo.",
    memberCount: 123, category: "Healthcare", isJoined: false, tags: ["Healthcare", "Research", "Data"]
  };
  const handleJoinToggle = () => {
    if (community.isJoined) {
      toggleJoinStatus(community.id);
    } else {
      router.push(`/community-member-wf/join-community?communityId=${community.id}`);
    }
  };
  const datasets = 18;
  return (
    <div>
      <div className="mb-8">
        <div className="w-full h-48 bg-muted rounded-lg mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/10" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="w-20 h-20 border-4 border-background"><AvatarFallback className="bg-background text-foreground text-lg font-semibold">{community.name.split(' ').map(word => word[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
              <div className="pb-2"><h1 className="text-2xl font-bold text-foreground mb-1">{community.name}</h1></div>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/community-member-wf/upload-files?communityId=${community.id}`)}>Create Post</Button>
              <Button variant={community.isJoined ? "outline" : "default"} size="sm" onClick={handleJoinToggle}>{community.isJoined ? "Joined" : "Join"}</Button>
              <Button variant="outline" size="sm" className="px-2"><MoreHorizontal className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="font-semibold text-foreground mb-2">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{community.description}</p>
          </div>
          <div>{mockCommunityPosts.map((post) => (<PostCard key={post.id} post={post} />))}</div>
        </div>
        <div className="w-80">
          <div className="sticky top-6 space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-foreground">Members</span></div><span className="font-semibold text-foreground">{community.memberCount}</span></div>
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
    </div>
  )
}