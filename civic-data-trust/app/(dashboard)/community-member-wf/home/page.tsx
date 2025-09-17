'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { PlayCircle, Image as ImageIcon, Loader2 } from "lucide-react";
import { useCommunity } from "@/app/components/contexts/community-context";
import ExpandableContentCard from "../../../components/dashboard/expandable-content-card"
import { useState, useEffect } from "react";
import Image from "next/image";

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
  author?: {
    name: string;
    avatar: string;
    username: string;
  };
  timestamp?: string;
}

export default function CommunityMemberHomePage() {
  const router = useRouter();
  const { communities, loading, error } = useCommunity();
  
  // Add debugging
  console.log('Communities loaded:', communities);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  const [realPosts, setRealPosts] = useState<PostWithDataset[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [datasetCounts, setDatasetCounts] = useState<{[key: string]: number}>({});

  const joinedCommunities = communities.filter(c => c.isJoined);

  // Fetch latest posts from joined communities
  useEffect(() => {
    const fetchLatestPosts = async () => {
      if (joinedCommunities.length === 0 || loading) return;

      setIsLoadingPosts(true);
      setPostsError(null);

      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch all posts and post requests in parallel
        const [postsResponse, requestsResponse] = await Promise.all([
          fetch('/api/community-post/?pageNumber=1&limit=50', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          }),
          fetch('/api/community-post-request/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          }),
        ]);

        if (postsResponse.ok && requestsResponse.ok) {
          const postsResult = await postsResponse.json();
          const requestsResult = await requestsResponse.json();

          const allPosts = postsResult.data || postsResult || [];
          const allRequests = requestsResult.data || requestsResult || [];

          // Get approved post IDs
          const approvedPostIds = allRequests
            .filter((request: any) => request.status === 'approved')
            .map((request: any) => request.post_id);

          // Filter posts from joined communities that are approved
          const joinedCommunityIds = joinedCommunities.map(c => c.id.toString());
          const relevantPosts = allPosts.filter((post: CommunityPost) =>
            joinedCommunityIds.includes(post.community_id) &&
            approvedPostIds.includes(post.id)
          );

          console.log('Relevant posts from joined communities:', relevantPosts);

          // Fetch dataset information for each post
          const postsWithDatasets = await Promise.all(
            relevantPosts.map(async (post: CommunityPost) => {
              let dataset = undefined;

              if (post.dataset_id) {
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
                    dataset = datasets.find((ds: Dataset) => ds.id === post.dataset_id);
                  }
                } catch (error) {
                  console.error(`Failed to fetch dataset ${post.dataset_id}:`, error);
                }
              }

              // Use real user data from API response
              const author = {
                name: post.user?.name || `User ${post.user_id.slice(0, 8)}`,
                avatar: "/placeholder.svg?height=40&width=40",
                username: post.user?.email?.split('@')[0] || post.user_id.slice(0, 8).toLowerCase(),
              };

              return {
                ...post,
                dataset,
                author,
                timestamp: post.created_at ? new Date(post.created_at).toLocaleDateString() : "Recently",
              };
            })
          );

          // Sort by most recent using real timestamps
          const sortedPosts = postsWithDatasets
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 10); // Show top 10 latest

          console.log('Final posts with datasets:', sortedPosts);
          setRealPosts(sortedPosts);

          // Calculate dataset counts for popular communities
          const counts: {[key: string]: number} = {};
          communities.forEach(community => {
            const communityPosts = allPosts.filter((post: any) =>
              post.community_id === community.id.toString()
            );

            const approvedCommunityPosts = communityPosts.filter((post: any) =>
              approvedPostIds.includes(post.id)
            );

            const uniqueDatasetIds = [...new Set(
              approvedCommunityPosts
                .filter((post: any) => post.dataset_id)
                .map((post: any) => post.dataset_id)
            )];

            counts[community.id.toString()] = uniqueDatasetIds.length;
          });

          setDatasetCounts(counts);
        } else {
          throw new Error('Failed to fetch posts or requests');
        }
      } catch (error) {
        console.error('Error fetching latest posts:', error);
        setPostsError(error instanceof Error ? error.message : 'Failed to load posts');
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchLatestPosts();
  }, [joinedCommunities.length, loading]);

  // Take the first 3 real posts or fallback to static placeholder if no real posts
  const trendingPosts = realPosts.length > 0 ? realPosts.slice(0, 3) : [];

  // Sort communities by member count (descending) and take top 3
  const popularCommunities = [...communities]
    .sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0))
    .slice(0, 3);

  return (
    <div className="">
      {/* Main Content */}
      <div className=" space-y-8">
        <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {trendingPosts.length > 0 ? (
            trendingPosts.map((post) => (
              <ExpandableContentCard 
                key={post.id} 
                id={post.id}
                title={post.title}
                author={post.author}
                timestamp={post.timestamp}
                content={post.description || post.content}
                videoThumbnail={post.dataset?.thumbnail || post.file_url || "/placeholder.svg?height=200&width=400"}
              />
            ))
          ) : (
            // Show placeholder cards if no real posts
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-4">
                  <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center mb-3">
                    <PlayCircle className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <h3 className="font-semibold">Loading trending content...</h3>
                  <p className="text-sm text-muted-foreground mt-1">Content will appear once available.</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Section */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Latest Contents</h2>
            <div className="space-y-4">
              {isLoadingPosts ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading latest posts from your communities...</span>
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
              ) : realPosts.length > 0 ? (
                realPosts.map((post) => (
                  <ExpandableContentCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    author={post.author!}
                    timestamp={post.timestamp!}
                    content={post.description}
                    videoThumbnail={post.dataset?.thumbnail || post.file_url || "/placeholder.svg?height=200&width=400"}
                    showEngagement={true}
                  />
                ))
              ) : joinedCommunities.length === 0 ? (
                <div className="p-6 text-center border rounded-lg">
                  <p className="text-muted-foreground mb-4">Join some communities to see personalized content here!</p>
                  <Button onClick={() => router.push('/community-member-wf/discover-community')}>
                    Discover Communities
                  </Button>
                </div>
              ) : (
                <div className="p-6 text-center border rounded-lg">
                  <p className="text-muted-foreground mb-4">No posts yet in your joined communities.</p>
                  <p className="text-sm text-muted-foreground">Check back later or encourage members to share content!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Popular Communities</h2>
            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="text-muted-foreground text-sm">Loading communities...</div>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center py-4">
                <div className="text-red-500 text-sm">Error: {error}</div>
              </div>
            )}
            {!loading && !error && popularCommunities.length === 0 && (
              <div className="flex items-center justify-center py-4">
                <div className="text-muted-foreground text-sm">No communities found.</div>
              </div>
            )}
            {!loading && !error && popularCommunities.length > 0 && (
              <div className="space-y-4">
                {popularCommunities.map((community) => (
                  <div 
                    key={community.id}
                    onClick={() => router.push(`/community-member-wf/community-details/${community.id}`)}
                    className="w-full h-32 flex flex-row gap-2 cursor-pointer bg-card border border-border rounded-lg p-4"
                  >
                    <div className="relative w-[40%] bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={community.coverImage || "/placeholder.svg?height=128&width=128"}
                        alt={community.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="w-[60%] flex flex-col justify-center">
                      <h3 className="font-semibold text-lg">{community.name}</h3>
                      <ul className="text-xs text-muted-foreground list-disc ml-3 space-y-1">
                        <li>{community.memberCount || 0} members</li>
                        <li>{datasetCounts[community.id.toString()] || 0} datasets</li>
                        <li>{community.community_category?.name || 'General'} data & research</li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}