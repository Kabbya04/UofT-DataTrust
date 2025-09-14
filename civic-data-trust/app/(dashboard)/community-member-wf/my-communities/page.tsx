"use client"

import { useRouter } from "next/navigation"
import { Users, Database, TrendingUp, Clock, Settings, Plus } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { useCommunity } from "@/app/components/contexts/community-context"
import { useState, useEffect } from "react"

export default function MyCommunitiesPage() {
  const { communities, loading, error } = useCommunity()
  const router = useRouter()
  const [datasetCounts, setDatasetCounts] = useState<{[key: string]: number}>({})
  const [isLoadingCounts, setIsLoadingCounts] = useState<boolean>(false)
  const [recommendedCommunities, setRecommendedCommunities] = useState<any[]>([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState<boolean>(false)

  const joinedCommunities = communities.filter(c => c.isJoined)
  
  // Debug logging
  console.log('MyCommunitiesPage - All communities:', communities.length)
  console.log('MyCommunitiesPage - Joined communities:', joinedCommunities.length)
  console.log('MyCommunitiesPage - Loading:', loading)
  console.log('MyCommunitiesPage - Error:', error)

  // Fetch dataset counts for joined communities
  useEffect(() => {
    const fetchDatasetCounts = async () => {
      if (joinedCommunities.length === 0 || loading) return;

      setIsLoadingCounts(true);

      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        // Fetch all posts and post requests once
        const [postsResponse, requestsResponse] = await Promise.all([
          fetch('/api/community-post/?pageNumber=1&limit=200', {
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

          // Calculate dataset count for each joined community
          const counts: {[key: string]: number} = {};

          joinedCommunities.forEach(community => {
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
        }
      } catch (error) {
        console.error('Error fetching dataset counts:', error);
      } finally {
        setIsLoadingCounts(false);
      }
    };

    fetchDatasetCounts();
  }, [joinedCommunities.length, loading]);

  // Fetch smart recommendations based on joined community categories
  useEffect(() => {
    const fetchSmartRecommendations = async () => {
      if (joinedCommunities.length === 0 || loading) {
        return;
      }

      setIsLoadingRecommendations(true);

      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        // Get categories of joined communities
        const joinedCategoryIds = [...new Set(
          joinedCommunities
            .map(community => community.community_category?.id)
            .filter(Boolean)
        )];

        console.log('=== Smart Recommendations Debug ===');
        console.log('Joined communities:', joinedCommunities);
        console.log('Joined category IDs:', joinedCategoryIds);

        if (joinedCategoryIds.length === 0) {
          // Fallback: get all communities if no categories
          setRecommendedCommunities([]);
          return;
        }

        // Fetch all communities to find recommendations
        const allCommunitiesResponse = await fetch('/api/community/?pageNumber=1&limit=100', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (allCommunitiesResponse.ok) {
          const allCommunitiesResult = await allCommunitiesResponse.json();
          const allCommunities = allCommunitiesResult.data?.items || allCommunitiesResult.data || allCommunitiesResult || [];

          console.log('All communities fetched:', allCommunities.length);
          console.log('Sample community structure:', allCommunities[0]);

          // Filter communities by similar categories that user hasn't joined
          const recommendations = allCommunities.filter((community: any) => {
            // Exclude communities user has already joined
            const isAlreadyJoined = joinedCommunities.some(joined => joined.id.toString() === community.id.toString());
            if (isAlreadyJoined) {
              console.log('Excluding already joined community:', community.name);
              return false;
            }

            // Include communities from similar categories
            const hasSimilarCategory = joinedCategoryIds.includes(community.community_category?.id);
            console.log(`Community "${community.name}" category:`, community.community_category?.id, 'Match:', hasSimilarCategory);
            return hasSimilarCategory;
          });

          console.log('Filtered recommendations before shuffle:', recommendations.length);

          // Shuffle and take top 6 recommendations
          const shuffledRecommendations = recommendations.sort(() => Math.random() - 0.5).slice(0, 6);

          // Fetch dataset counts for recommended communities (same logic as joined communities)
          const recommendationsWithCounts = await Promise.all([
            // Fetch posts and requests for calculating dataset counts
            fetch('/api/community-post/?pageNumber=1&limit=200', {
              headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            }),
            fetch('/api/community-post-request/', {
              headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            }),
          ]).then(async ([postsRes, requestsRes]) => {
            if (postsRes.ok && requestsRes.ok) {
              const postsData = await postsRes.json();
              const requestsData = await requestsRes.json();

              const allPosts = postsData.data || postsData || [];
              const allRequests = requestsData.data || requestsData || [];

              const approvedPostIds = allRequests
                .filter((request: any) => request.status === 'approved')
                .map((request: any) => request.post_id);

              return shuffledRecommendations.map((community: any) => {
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

                return {
                  ...community,
                  datasetCount: uniqueDatasetIds.length
                };
              });
            }
            return shuffledRecommendations.map((community: any) => ({ ...community, datasetCount: 0 }));
          });

          console.log('Smart recommendations:', recommendationsWithCounts);
          setRecommendedCommunities(recommendationsWithCounts);
        }
      } catch (error) {
        console.error('Error fetching smart recommendations:', error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchSmartRecommendations();
  }, [joinedCommunities.length, loading]);
  
  const recentActivity = [
    {
      id: 1, action: "New post in", community: "Data Science Enthusiasts", communityId: 1,
      title: "Machine Learning Best Practices", time: "2 hours ago", type: "post"
    },
    {
      id: 2, action: "Dataset uploaded to", community: "Urban Gardening", communityId: 5,
      title: "Soil Composition Data 2024", time: "5 hours ago", type: "dataset"
    },
    {
      id: 3, action: "Comment on your post in", community: "Sustainable Living", communityId: 2,
      title: "Climate Action Framework", time: "1 day ago", type: "comment"
    },
    {
      id: 4, action: "New member joined", community: "Data Science Enthusiasts", communityId: 1,
      title: "Dr. Sarah Mitchell", time: "2 days ago", type: "member"
    }
  ]


  const handleViewCommunity = (communityId: string) => {
    router.push(`/community-member-wf/community-details/${communityId}`)
  }

  const handleJoinCommunity = (communityId: string) => {
    router.push(`/community-member-wf/join-community?communityId=${communityId}`)
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">My Communities</h1>
          {/* <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Community
          </Button> */}
        </div>
        <p className="text-muted-foreground">Manage your communities and stay updated with recent activities</p>
      </div>

      <Tabs defaultValue="joined" className="space-y-6">
        <TabsList>
          <TabsTrigger value="joined">Joined Communities</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="recommendations">Recommended</TabsTrigger>
        </TabsList>

        <TabsContent value="joined" className="space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading communities...</div>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-500">Error: {error}</div>
            </div>
          )}
          {!loading && !error && (
            <>
              {joinedCommunities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {joinedCommunities.map((community) => (
                    <Card key={community.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{community.name}</h3>
                          <Badge variant="secondary" className="mb-2">{community.community_category?.name || 'General'}</Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{community.description || 'No description available'}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1"><Users className="h-4 w-4" /><span>{community.memberCount?.toLocaleString() || '0'}</span></div>
                        <div className="flex items-center gap-1"><Database className="h-4 w-4" /><span>{isLoadingCounts ? '...' : (datasetCounts[community.id.toString()] || 0)} datasets</span></div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewCommunity(community.id)}>View Community</Button>
                        <Button variant="default" size="sm" className="flex-1">Manage</Button>
                      </div>
                    </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Communities Joined</h3>
                  <p className="text-muted-foreground mb-4 max-w-sm">
                    You haven't joined any communities yet. Browse communities and request to join ones that interest you.
                  </p>
                  <Button onClick={() => router.push('/community-member-wf/discover-communities')}>
                    Discover Communities
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {recentActivity.map((activity) => (
            <Card key={activity.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {activity.type === 'post' && <TrendingUp className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'dataset' && <Database className="h-4 w-4 text-foreground" />}
                    {activity.type === 'comment' && <Users className="h-4 w-4 text-orange-500" />}
                    {activity.type === 'member' && <Plus className="h-4 w-4 text-purple-500" />}
                    <span className="text-sm text-muted-foreground">{activity.action}{' '}
                      <span className="font-medium text-foreground hover:text-primary cursor-pointer" onClick={() => handleViewCommunity(activity.communityId.toString())}>{activity.community}</span>
                    </span>
                  </div>
                  <h4 className="font-medium text-foreground mb-1">{activity.title}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{activity.time}</div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {isLoadingRecommendations ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading smart recommendations...</div>
            </div>
          ) : recommendedCommunities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Database className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Recommendations Available</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                {joinedCommunities.length === 0
                  ? "Join some communities first to get personalized recommendations based on your interests."
                  : "We couldn't find communities similar to your current interests. Check back later for new communities."
                }
              </p>
              {joinedCommunities.length === 0 && (
                <Button onClick={() => router.push('/community-member-wf/discover-communities')}>
                  Discover Communities
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCommunities.map((community) => (
                <Card key={community.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{community.name}</h3>
                      <Badge variant="outline" className="mb-2">
                        {community.community_category?.name || 'General'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {community.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{community.memberCount?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Database className="h-4 w-4" />
                        <span>{community.datasetCount || 0} datasets</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewCommunity(community.id.toString())}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleJoinCommunity(community.id.toString())}
                      >
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}