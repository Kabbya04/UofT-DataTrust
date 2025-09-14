"use client"

import { useRouter } from "next/navigation"
import { Play, MoreHorizontal, Users, Database, FileText, MoreVertical, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { useCommunity } from "@/app/components/contexts/community-context"
import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"

// Types for community posts - Updated to match new API structure
interface User {
  id: string;
  name: string;
  email: string;
  status: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}

interface CommunityPost {
  id: string;
  community_id: string;
  user_id: string;
  file_url: string | null;
  title: string;
  description: string;
  dataset_id: string;
  created_at: string;
  updated_at: string;
  user: User; // Nested user data from API
}

interface Dataset {
  id: string;
  uploader_id: string;
  name: string;
  description: string;
  filename: string;
  file_url: string;
  file_type: string;
  tags: string[] | null;
  thumbnail: string | null;
}

interface PostWithDataset extends CommunityPost {
  dataset?: Dataset;
}

// No more mock data - will fetch from API

// Updated interface for Next.js 15
interface CommunityDetailsPageProps {
  params: Promise<{ id: string }>
}

interface PostCardProps {
  post: PostWithDataset
}

function PostCard({ post }: PostCardProps) {
  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-200 border border-primary bg-card">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-32 h-20 bg-muted rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
            {post.dataset?.thumbnail ? (
              <img
                src={post.dataset.thumbnail}
                alt={post.dataset.name}
                className="w-full h-full object-cover rounded"
              />
            ) : post.file_url ? (
              <div className="bg-background/90 rounded-full p-2">
                <Play className="h-4 w-4 text-primary fill-current" />
              </div>
            ) : (
              <div className="bg-background/90 rounded-full p-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-1">{post.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {post.description}
            </p>
            {post.dataset && (
              <div className="mt-2 pt-2 border-t border-muted/30">
                <p className="text-xs font-medium text-foreground mb-1">Dataset: {post.dataset.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{post.dataset.description}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PopularPostItem({ post }: { post: PostWithDataset }) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded transition-colors">
      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
        {post.dataset?.thumbnail ? (
          <img
            src={post.dataset.thumbnail}
            alt={post.dataset.name}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <FileText className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground line-clamp-1">{post.title}</p>
        <p className="text-xs text-muted-foreground">
          {post.dataset ? post.dataset.name : (post.user?.name || `User ${post.user_id.slice(0, 8)}...`)}
        </p>
      </div>
    </div>
  )
}

export default function CommunityDetailsPage({ params }: CommunityDetailsPageProps) {
  const { communities, toggleJoinStatus } = useCommunity();
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [communityId, setCommunityId] = useState<string>("")
  const [communityPosts, setCommunityPosts] = useState<PostWithDataset[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false)
  const [postsError, setPostsError] = useState<string | null>(null)
  const [datasetCount, setDatasetCount] = useState<number>(0)
  const [isLoadingDatasetCount, setIsLoadingDatasetCount] = useState<boolean>(false)
  const router = useRouter();

  // Use useEffect to resolve the Promise params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setCommunityId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Fetch dataset count for this community
  useEffect(() => {
    const fetchDatasetCount = async () => {
      if (!communityId) return;

      setIsLoadingDatasetCount(true);

      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        // Fetch all datasets
        const response = await fetch('/api/datasets', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          const allDatasets = result.data?.items || result.data || result || [];

          // Get all approved posts for this community to find associated datasets
          const postsResponse = await fetch('/api/community-post/?pageNumber=1&limit=50', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });

          if (postsResponse.ok) {
            const postsResult = await postsResponse.json();
            const allPosts = postsResult.data || postsResult || [];

            // Filter posts for this community
            const communityPosts = allPosts.filter((post: CommunityPost) =>
              post.community_id === communityId
            );

            console.log('=== Dataset Count Debug ===');
            console.log('Community ID:', communityId);
            console.log('All posts in community:', communityPosts);

            // Now check which posts are approved
            const requestsResponse = await fetch('/api/community-post-request/', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
              },
            });

            if (requestsResponse.ok) {
              const requestsResult = await requestsResponse.json();
              const requests = requestsResult.data || requestsResult || [];

              console.log('All post requests:', requests);

              // Only count datasets from approved posts
              const approvedPostIds = requests
                .filter((request: any) => request.status === 'approved')
                .map((request: any) => request.post_id);

              console.log('Approved post IDs:', approvedPostIds);

              const approvedCommunityPosts = communityPosts.filter((post: CommunityPost) =>
                approvedPostIds.includes(post.id)
              );

              console.log('Approved posts in this community:', approvedCommunityPosts);

              // Get unique dataset IDs from approved community posts only
              const datasetIds = [...new Set(
                approvedCommunityPosts
                  .filter((post: CommunityPost) => post.dataset_id)
                  .map((post: CommunityPost) => post.dataset_id)
              )];

              console.log('Dataset IDs from approved posts:', datasetIds);
              console.log('Final dataset count:', datasetIds.length);

              setDatasetCount(datasetIds.length);
            } else {
              // Fallback: if we can't fetch requests, assume all posts are approved
              const datasetIds = [...new Set(
                communityPosts
                  .filter((post: CommunityPost) => post.dataset_id)
                  .map((post: CommunityPost) => post.dataset_id)
              )];
              setDatasetCount(datasetIds.length);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching dataset count:', error);
      } finally {
        setIsLoadingDatasetCount(false);
      }
    };

    fetchDatasetCount();
  }, [communityId]);

  // Fetch community posts when communityId is available
  useEffect(() => {
    const fetchCommunityPosts = async () => {
      if (!communityId) return;

      setIsLoadingPosts(true);
      setPostsError(null);

      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Get all posts and filter by community_id on the frontend
        // In the future, you might want to add a community filter to the backend endpoint
        const response = await fetch('/api/community-post/?pageNumber=1&limit=50', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch posts');
        }

        const result = await response.json();
        console.log('Community posts API response:', result);

        // Handle the nested response structure - API returns { data: [...] }
        const allPosts = result.data || result || [];
        console.log('Extracted allPosts:', allPosts);

        // Ensure it's an array
        if (!Array.isArray(allPosts)) {
          console.error('allPosts is not an array:', typeof allPosts, allPosts);
          throw new Error('Invalid posts data format');
        }

        // Filter posts for this specific community
        const communityPosts = allPosts.filter((post: CommunityPost) =>
          post.community_id === communityId
        );

        // Now we need to check which posts are approved
        // Fetch post requests to see which ones are approved
        const requestsResponse = await fetch('/api/community-post-request/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (requestsResponse.ok) {
          const requestsResult = await requestsResponse.json();
          const requests = requestsResult.data || requestsResult || [];

          console.log('All post requests:', requests);
          console.log('Community posts:', communityPosts);

          // Only show posts that have been approved
          const approvedPostIds = requests
            .filter((request: any) => request.status === 'approved')
            .map((request: any) => request.post_id);

          console.log('Approved post IDs:', approvedPostIds);

          const filteredPosts = communityPosts.filter((post: CommunityPost) =>
            approvedPostIds.includes(post.id)
          );

          console.log('Final filtered posts to show:', filteredPosts);

          // Fetch dataset information for each post
          const postsWithDatasets = await Promise.all(
            filteredPosts.map(async (post: CommunityPost) => {
              if (!post.dataset_id) {
                return { ...post, dataset: undefined };
              }

              try {
                // Fetch dataset information
                const datasetResponse = await fetch(`/api/datasets`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                  },
                });

                if (datasetResponse.ok) {
                  const datasetResult = await datasetResponse.json();
                  const datasets = datasetResult.data?.items || datasetResult.data || datasetResult || [];

                  // Find the specific dataset for this post
                  const dataset = datasets.find((ds: Dataset) => ds.id === post.dataset_id);
                  return { ...post, dataset };
                }
              } catch (error) {
                console.error(`Failed to fetch dataset ${post.dataset_id}:`, error);
              }

              return { ...post, dataset: undefined };
            })
          );

          setCommunityPosts(postsWithDatasets);
        } else {
          // If we can't fetch requests, show all posts (fallback)
          console.warn('Failed to fetch post requests, showing all posts');

          // Still fetch dataset information for fallback posts
          const postsWithDatasets = await Promise.all(
            communityPosts.map(async (post: CommunityPost) => {
              if (!post.dataset_id) {
                return { ...post, dataset: undefined };
              }

              try {
                const datasetResponse = await fetch(`/api/datasets`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                  },
                });

                if (datasetResponse.ok) {
                  const datasetResult = await datasetResponse.json();
                  const datasets = datasetResult.data?.items || datasetResult.data || datasetResult || [];
                  const dataset = datasets.find((ds: Dataset) => ds.id === post.dataset_id);
                  return { ...post, dataset };
                }
              } catch (error) {
                console.error(`Failed to fetch dataset ${post.dataset_id}:`, error);
              }

              return { ...post, dataset: undefined };
            })
          );

          setCommunityPosts(postsWithDatasets);
        }
      } catch (error) {
        console.error('Error fetching community posts:', error);
        setPostsError(error instanceof Error ? error.message : 'Failed to load posts');
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchCommunityPosts();
  }, [communityId]);

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


  // Show loading state while params are being resolved
  if (!communityId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <div className="w-full h-48 bg-muted border border-primary rounded-lg mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/10" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="w-20 h-20 border-4 border-background"><AvatarFallback className="bg-background text-foreground text-lg font-semibold">{community.name.split(' ').map(word => word[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
              <div className="pb-2"><h1 className="text-2xl font-bold text-foreground mb-1">{community.name}</h1></div>
            </div>

            <div className="flex items-center gap-2 pb-2">
              {community.isJoined && <Button variant="outline" size="sm" onClick={() => router.push(`/community-member-wf/upload-files?communityId=${community.id}`)}>Create Post</Button>}
              
              <Button variant={community.isJoined ? "outline" : "default"} size="sm" onClick={handleJoinToggle}>{community.isJoined ? "Joined" : "Join"}</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline" size="sm" className="px-2"
                  >
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
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="font-semibold text-foreground mb-2">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{community.description}</p>
          </div>
          <div className={`transition-all duration-300 ${!community.isJoined ? "opacity-90 blur-xs pointer-events-none" : ""}`}>
            {isLoadingPosts ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading community posts...</span>
              </div>
            ) : postsError ? (
              <div className="p-6 border border-red-200 rounded-lg bg-red-50">
                <p className="text-red-600 text-sm mb-2">{postsError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : communityPosts.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-muted-foreground mb-4">No posts in this community yet.</p>
                {community.isJoined && (
                  <Button
                    onClick={() => router.push(`/community-member-wf/upload-files?communityId=${community.id}`)}
                  >
                    Create First Post
                  </Button>
                )}
              </div>
            ) : (
              communityPosts.map((post) => (<PostCard key={post.id} post={post} />))
            )}
          </div>
        </div>
        <div className={`w-80" ${!community.isJoined ? "opacity-90 blur-xs pointer-events-none" : ""}`}>
          <div className="top-6 space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-foreground">Members</span></div><span className="font-semibold text-foreground">{community.memberCount}</span></div>
                <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Database className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-foreground">Datasets</span></div><span className="font-semibold text-foreground">{isLoadingDatasetCount ? '...' : datasetCount}</span></div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Popular Posts</h3>
              <div className="space-y-2">
                {isLoadingPosts ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : communityPosts.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center p-4">No posts yet</p>
                ) : (
                  // Show first 5 posts as "popular"
                  communityPosts.slice(0, 5).map((post) => (<PopularPostItem key={post.id} post={post} />))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}