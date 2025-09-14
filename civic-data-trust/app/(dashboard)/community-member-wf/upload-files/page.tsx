"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { useCommunity } from "@/app/components/contexts/community-context"
import { useUser } from "@/app/components/contexts/user-context"
import { FileText, ChevronRight, Loader2 } from "lucide-react"

// Types for dataset
interface Dataset {
  id: string;
  uploader_id: string;
  name: string;
  description: string;
  filename: string;
  file_url: string;
  file_type: string;
  tags: string[];
  thumbnail: string;
}

function CreatePostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { communities } = useCommunity();
  const { currentUser } = useUser();

  const preselectedCommunityId = searchParams.get('communityId');
  const preselectedDatasetId = searchParams.get('datasetId');

  const [selectedCommunityId, setSelectedCommunityId] = useState(preselectedCommunityId || "");
  const [selectedDatasetId, setSelectedDatasetId] = useState(preselectedDatasetId || "");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [comments, setComments] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [userDatasets, setUserDatasets] = useState<Dataset[]>([]);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(false);
  const [datasetsError, setDatasetsError] = useState<string | null>(null);

  const selectedCommunity = communities.find(c => c.id.toString() === selectedCommunityId);
  const selectedDataset = Array.isArray(userDatasets) ? userDatasets.find(d => d.id === selectedDatasetId) : undefined;
  const userJoinedCommunities = communities.filter(c => c.isJoined);

  // Fetch user's datasets
  useEffect(() => {
    const fetchUserDatasets = async () => {
      if (!currentUser?.id) return;

      setIsLoadingDatasets(true);
      setDatasetsError(null);

      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Use a real user ID from your backend for testing - replace currentUser.id with actual authenticated user ID
        const testUserId = "4e2172d8-a9fa-4a85-b1e6-970864bfc8a1"; // Use the real user ID from your Postman test
        const response = await fetch(`/api/datasets/${testUserId}?limit=50`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch datasets');
        }

        const result = await response.json();
        console.log('Raw API response:', result);

        // Handle the nested response structure: { status, message, data: { items: [] } }
        const datasets = result.data?.items || result || [];
        console.log('Extracted datasets:', datasets);

        // Ensure it's always an array
        const datasetsArray = Array.isArray(datasets) ? datasets : [];
        setUserDatasets(datasetsArray);
      } catch (error) {
        console.error('Error fetching user datasets:', error);
        setDatasetsError(error instanceof Error ? error.message : 'Failed to load datasets');
      } finally {
        setIsLoadingDatasets(false);
      }
    };

    fetchUserDatasets();
  }, [currentUser?.id]);

  const handleCreatePost = async () => {
    if (!selectedCommunityId || !selectedDatasetId || !title) {
        alert("Please select a community, a dataset, and provide a title.");
        return;
    }

    if (!currentUser?.id) {
        alert("User not authenticated");
        return;
    }

    setIsPosting(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const testUserId = "4e2172d8-a9fa-4a85-b1e6-970864bfc8a1"; // Use the real user ID from your backend
      const postData = {
        community_id: selectedCommunityId,
        user_id: testUserId,
        file_url: selectedDataset?.file_url || "",
        title: title,
        description: comments || "",
        dataset_id: selectedDatasetId
      };

      const response = await fetch('/api/community-post/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      const createdPost = await response.json();
      console.log('Post created successfully:', createdPost);

      // Redirect to the community feed where the post was made
      router.push(`/community-member-wf/community-details/${selectedCommunityId}?posted=success`);
    } catch (error) {
      console.error('Error creating post:', error);
      alert(error instanceof Error ? error.message : 'Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Post</h1>
        <p className="text-sm text-muted-foreground mt-1">Share your dataset with a community by creating a post.</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Section 1: Community Selection */}
          <div>
            <Label htmlFor="community-select" className="text-lg font-semibold">1. Select a Community</Label>
            <Select 
                value={selectedCommunityId} 
                onValueChange={setSelectedCommunityId}
                disabled={!!preselectedCommunityId} // Disable if coming from a specific community
            >
              <SelectTrigger id="community-select" className="mt-2">
                <SelectValue placeholder="Choose a community to post in..." />
              </SelectTrigger>
              <SelectContent>
                {userJoinedCommunities.map(community => (
                    <SelectItem key={community.id} value={community.id.toString()}>{community.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {preselectedCommunityId && <p className="text-xs text-muted-foreground mt-1">Posting to the "{selectedCommunity?.name}" community.</p>}
          </div>

          {/* Section 2: Dataset Selection */}
          <div>
            <Label htmlFor="dataset-select" className="text-lg font-semibold">2. Select a Dataset to Attach</Label>
            {preselectedDatasetId && selectedDataset ? (
                <Card className="mt-2 p-4 bg-muted">
                    <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-primary flex-shrink-0"/>
                        <div>
                            <p className="font-semibold">{selectedDataset.name}</p>
                            <p className="text-sm text-muted-foreground">{selectedDataset.description}</p>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="mt-2">
                  {isLoadingDatasets ? (
                    <div className="flex items-center justify-center p-4 border rounded-lg">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span>Loading your datasets...</span>
                    </div>
                  ) : datasetsError ? (
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <p className="text-red-600 text-sm">{datasetsError}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => window.location.reload()}
                      >
                        Retry
                      </Button>
                    </div>
                  ) : userDatasets.length === 0 ? (
                    <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                      <p className="text-yellow-700 text-sm">No datasets found. Please upload a dataset first.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => router.push('/community-member-wf/upload-dataset')}
                      >
                        Upload Dataset
                      </Button>
                    </div>
                  ) : (
                    <Select value={selectedDatasetId} onValueChange={setSelectedDatasetId}>
                      <SelectTrigger id="dataset-select">
                        <SelectValue placeholder="Choose one of your uploaded datasets..." />
                      </SelectTrigger>
                      <SelectContent>
                        {userDatasets.map(dataset => (
                            <SelectItem key={dataset.id} value={dataset.id}>
                              {dataset.name} ({dataset.filename})
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
            )}
          </div>

          {/* Section 3: Post Details */}
          <div>
            <Label className="text-lg font-semibold">3. Add Post Details</Label>
            <div className="space-y-4 mt-2">
               <div><Input placeholder="Post Title*" value={title} onChange={(e) => setTitle(e.target.value)} /><div className="text-xs text-muted-foreground text-right mt-1">{title.length}/100</div></div>
               <div><Input placeholder="Add Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} /></div>
               <div><Textarea placeholder="Additional Comment (optional)" value={comments} onChange={(e) => setComments(e.target.value)} className="min-h-[120px] resize-none" maxLength={500} /><div className="text-xs text-muted-foreground text-right mt-1">{comments.length}/500</div></div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button
              onClick={handleCreatePost}
              disabled={isPosting || isLoadingDatasets || !selectedCommunityId || !selectedDatasetId || !title || userDatasets.length === 0}
            >
              {isPosting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                "Create Post"
              )}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

// Use Suspense boundary because useSearchParams is a client-side hook
export default function CreatePostPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreatePostContent />
        </Suspense>
    )
}