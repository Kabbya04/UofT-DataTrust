// app/(dashboard)/community-member-wf/community-details/[id]/community-details-view.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, MoreHorizontal, Users, Database, FileText } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { useCommunity } from "@/app/components/contexts/community-context";
import ExpandableContentCard from "@/app/components/dashboard/expandable-content-card";

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
}

function PopularPostItem({ post }: { post: CommunityPost }) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded transition-colors">
      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center flex-shrink-0">
        <FileText className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground line-clamp-1">{post.title}</p>
        <p className="text-xs text-muted-foreground">{post.user?.name || 'Unknown Author'}</p>
      </div>
    </div>
  )
}
export default function CommunityDetailsView({ id }: { id: string }) {
  const router = useRouter();
  const { communities, toggleJoinStatus } = useCommunity();
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  // FIX: Add this guard clause to ensure router is not null
  if (!router) {
    return null; // Render nothing until the router is available
  }

  const community = communities.find(c => c.id.toString() === id) || {
    id: parseInt(id), name: "Toronto Health Community",
    description: "Tincidunt cursque ipsum sit sit urna arci molestaque tincidunt et commodo.",
    memberCount: 123, category: "Healthcare", isJoined: false, tags: ["Healthcare", "Research", "Data"]
  };

  const fetchCommunityPosts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/community-post?communityId=${id}`, { headers });
      if (response.ok) {
        const data = await response.json();

        const postsWithLikes = await Promise.all(
          data.map(async (post: CommunityPost) => {
            try {
              const likesResponse = await fetch(`/api/community-post-likes/count/${post.id}`, { headers });
              let likesCount = 0;

              if (likesResponse.ok) {
                const likesData = await likesResponse.json();
                // API returns: { status: true, message: "...", data: { count: number } }
                likesCount = likesData.data?.count || 0;
              }

              return { ...post, likesCount };
            } catch (error) {
              return { ...post, likesCount: 0 };
            }
          })
        );

        setCommunityPosts(postsWithLikes);

        const popular = [...postsWithLikes]
          .sort((a: any, b: any) => (b.likesCount || 0) - (a.likesCount || 0))
          .slice(0, 5);
        setPopularPosts(popular);
      }
    } catch (error) {
      console.error('Error fetching community posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinToggle = () => {
    if (community.isJoined) {
      toggleJoinStatus(community.id);
    } else {
      router.push(`/community-member-wf/join-community?communityId=${community.id}`);
    }
  };

  const datasets = 18;

  useEffect(() => {
    if (id) {
      fetchCommunityPosts();
    }
  }, [id]);
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
          <div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading posts...</p>
              </div>
            ) : communityPosts.length > 0 ? (
              communityPosts.map((post) => (
                <div key={post.id} className="mb-4">
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
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No posts found in this community.</p>
              </div>
            )}
          </div>
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
              <div className="space-y-2">
                {popularPosts.length > 0 ? (
                  popularPosts.map((post) => (
                    <PopularPostItem key={post.id} post={post} />
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No popular posts yet.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}