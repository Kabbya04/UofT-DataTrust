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
import { FileText, ChevronRight } from "lucide-react"

// Mock data for user's central datasets
const userDatasets = [
    { id: 'DS-201', name: 'Urban Traffic Patterns', description: 'Dataset containing traffic flow from major intersections.', type: 'CSV', size: '856 MB' },
    { id: 'DS-101', name: 'Healthcare Analytics Dataset 2024', description: 'Anonymized patient data for predictive modeling.', type: 'Tabular', size: '2.3 GB' },
    { id: 'DS-305', name: 'Customer Sentiment Analysis', description: 'NLP results from product reviews.', type: 'Text', size: '120 MB' },
];

function CreatePostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { communities } = useCommunity();

  const preselectedCommunityId = searchParams.get('communityId');
  const preselectedDatasetId = searchParams.get('datasetId');

  const [selectedCommunityId, setSelectedCommunityId] = useState(preselectedCommunityId || "");
  const [selectedDatasetId, setSelectedDatasetId] = useState(preselectedDatasetId || "");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [comments, setComments] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const selectedCommunity = communities.find(c => c.id.toString() === selectedCommunityId);
  const selectedDataset = userDatasets.find(d => d.id === selectedDatasetId);
  const userJoinedCommunities = communities.filter(c => c.isJoined);

  const handleCreatePost = async () => {
    if (!selectedCommunityId || !selectedDatasetId || !title) {
        alert("Please select a community, a dataset, and provide a title.");
        return;
    }
    setIsPosting(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    setIsPosting(false);
    // Redirect to the community feed where the post was made
    router.push(`/community-member-wf/community-details/${selectedCommunityId}?posted=success`);
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
                <Select value={selectedDatasetId} onValueChange={setSelectedDatasetId}>
                  <SelectTrigger id="dataset-select" className="mt-2">
                    <SelectValue placeholder="Choose one of your uploaded datasets..." />
                  </SelectTrigger>
                  <SelectContent>
                    {userDatasets.map(dataset => (
                        <SelectItem key={dataset.id} value={dataset.id}>{dataset.name} ({dataset.size})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <Button onClick={handleCreatePost} disabled={isPosting || !selectedCommunityId || !selectedDatasetId || !title}>
              {isPosting ? "Posting..." : "Create Post"}
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