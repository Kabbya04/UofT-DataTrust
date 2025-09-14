'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { PlayCircle, Image as ImageIcon, Loader2 } from "lucide-react";
import { useCommunity } from "@/app/components/contexts/community-context";
import ExpandableContentCard from "../../../components/dashboard/expandable-content-card"
import { useState, useEffect } from "react";

// Types for community posts
interface CommunityPost {
  id: string;
  community_id: string;
  user_id: string;
  file_url: string;
  title: string;
  description: string;
  dataset_id: string;
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

export default function ResearcherHomePage() {
  const router = useRouter();
  const { communities, loading, error } = useCommunity();

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

          console.log('Relevant posts from joined research communities:', relevantPosts);

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

              // Generate researcher-focused author data
              const author = {
                name: `Researcher ${post.user_id.slice(0, 8)}`,
                avatar: "/placeholder.svg?height=40&width=40",
                username: post.user_id.slice(0, 8).toLowerCase(),
              };

              return {
                ...post,
                dataset,
                author,
                timestamp: "Recently", // You can enhance this with real timestamps
              };
            })
          );

          // Sort by most recent (or you can add created_at field later for proper sorting)
          const sortedPosts = postsWithDatasets.slice(0, 10); // Show top 10 latest

          console.log('Final posts with datasets for researcher:', sortedPosts);
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
        console.error('Error fetching latest research posts:', error);
        setPostsError(error instanceof Error ? error.message : 'Failed to load posts');
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchLatestPosts();
  }, [joinedCommunities.length, loading]);

  const topGridItems = [
    { title: "Research Data Access", type: "video" },
    { title: "Latest Community Datasets", type: "image" },
    { title: "Collaborative Research Guide", type: "video" },
  ];

  // Sort communities by member count (descending) and take top 3 for research focus
  const popularCommunities = communities
    .sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0))
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topGridItems.map((item, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center mb-3">
                  {item.type === 'video' ? <PlayCircle className="h-12 w-12 text-muted-foreground/50" /> : <ImageIcon className="h-12 w-12 text-muted-foreground/50" />}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Access research datasets and collaborate with other researchers.</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Latest Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Latest Research Data (Based on your communities)</h2>
          <div className="space-y-4">
            {isLoadingPosts ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading latest research posts from your communities...</span>
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
                  showResearchButton={true}
                />
              ))
            ) : joinedCommunities.length === 0 ? (
              <div className="p-6 text-center border rounded-lg">
                <p className="text-muted-foreground mb-4">Join research communities to see relevant datasets and collaboration opportunities!</p>
                <Button onClick={() => router.push('/researcher-wf/discover-community')}>
                  Discover Research Communities
                </Button>
              </div>
            ) : (
              <div className="p-6 text-center border rounded-lg">
                <p className="text-muted-foreground mb-4">No research data available yet in your joined communities.</p>
                <p className="text-sm text-muted-foreground">Check back later for new research datasets and collaboration opportunities!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Popular Research Communities</h2>
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
            {popularCommunities.map((community, i) => (
              <Card key={i}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{community.name}</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 mb-4">
                  <li>{community.memberCount || 0} researchers</li>
                  <li>{datasetCounts[community.id.toString()] || 0} datasets</li>
                  <li>{community.community_category?.name || 'General'} research focus</li>
                </ul>
                <div className="flex items-center gap-1 ">
                  <Button variant="outline" className="w-fit text-xs" onClick={() => router.push(`/researcher-wf/community-details/${community.id}`)}>View Details</Button>
                  <Button className="w-fit text-xs" onClick={() => router.push(`/researcher-wf/join-community?communityId=${community.id}`)}>Join Community</Button>
                </div>
              </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}