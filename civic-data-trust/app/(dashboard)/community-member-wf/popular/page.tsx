"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { TrendingUp, Clock, Users, Database, Flame, ChevronUp, ChevronDown, MessageSquare, Share2, Bookmark, Eye, ArrowUp, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { useUser } from "@/app/components/contexts/user-context";

// This component now receives the helper function
function PopularPostCard({ post, rank, onVote, getUserIdFromName }: { post: any, rank: number, onVote: (id: number, type: 'up' | 'down') => void, getUserIdFromName: (name: string) => string }) {
  const netScore = post.upvotes - post.downvotes;
  const router = useRouter();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-3 w-3 text-foreground" />;
      case 'falling': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default: return <TrendingUp className="h-3 w-3 text-muted-foreground rotate-90" />;
    }
  };

  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-200 border border-border bg-card">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex flex-col items-center gap-1 min-w-[50px]">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-sm font-bold text-primary">#{rank}</span></div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-primary" onClick={() => onVote(post.id, 'up')}><ChevronUp className="h-4 w-4" /></Button>
            <span className={`text-xs font-medium`}>{netScore > 999 ? `${(netScore / 1000).toFixed(1)}k` : netScore}</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-destructive" onClick={() => onVote(post.id, 'down')}><ChevronDown className="h-4 w-4" /></Button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 text-sm">
              <span className="font-medium text-primary cursor-pointer hover:underline" onClick={() => router.push(`/community-member-wf/community-details/${post.communityId}`)}>{post.community}</span>
              <span className="text-muted-foreground">•</span>
              {/* Author Link */}
              <Link href={`/community-member-wf/user-profile/${getUserIdFromName(post.author)}`} className="text-muted-foreground hover:underline">by {post.author}</Link>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.timestamp}</div>
              {post.isHot && <Badge variant="destructive" className="px-1.5 py-0 text-xs"><Flame className="h-3 w-3 mr-1" />HOT</Badge>}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">{post.title}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.content}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views.toLocaleString()} views</div>
              <div className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{post.comments} comments</div>
              <div className="flex items-center gap-1">{getTrendIcon(post.trend)}{post.trend}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ... other components from the original popular-wf page remain the same ...

export default function PopularPage() {
  const [posts, setPosts] = useState([
      { id: 1, title: "AI Breakthrough: 99.7% Accuracy in Cancer Detection", content: "Revolutionary deep learning model...", author: "Alex Chen", community: "Medical AI Research Hub", communityId: 8, timestamp: "6 hours ago", upvotes: 15847, downvotes: 234, comments: 892, views: 45623, isHot: true, trend: "rising" },
      { id: 2, title: "Global Climate Dataset Now Open Source", content: "Massive dataset containing 150 years of global climate data released...", author: "Maria Rodriguez", community: "Climate Science Collective", communityId: 15, timestamp: "12 hours ago", upvotes: 12456, downvotes: 189, comments: 634, views: 38291, isHot: true, trend: "stable" },
      { id: 3, title: "Quantum Computing Achieves 1000x Speedup", content: "IBM's quantum computer successfully processes complex financial risk calculations...", author: "Dr. James Wilson", community: "Financial Analytics Pro", communityId: 38, timestamp: "1 day ago", upvotes: 9876, downvotes: 145, comments: 456, views: 29847, isHot: false, trend: "rising" },
  ]);
  const [sortBy, setSortBy] = useState<'hot' | 'top' | 'rising'>('hot');
  const { getUserIdFromName } = useUser(); // Get the utility function from context

  const handleVote = (postId: number, type: 'up' | 'down') => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              upvotes: type === 'up' ? p.upvotes + 1 : p.upvotes,
              downvotes: type === 'down' ? p.downvotes + 1 : p.downvotes,
            }
          : p
      )
    );
  };
  
  const sortedPosts = [...posts].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));

  return (
    <div className="flex-1 flex">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-4">Popular Posts</h1>
          <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <TabsList>
              <TabsTrigger value="hot"><Flame className="h-4 w-4 mr-2" />Hot</TabsTrigger>
              <TabsTrigger value="top"><ArrowUp className="h-4 w-4 mr-2" />Top</TabsTrigger>
              <TabsTrigger value="rising"><BarChart3 className="h-4 w-4 mr-2" />Rising</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="space-y-4">
          {sortedPosts.map((post, index) => (
            <PopularPostCard
              key={post.id}
              post={post}
              rank={index + 1}
              onVote={handleVote}
              getUserIdFromName={getUserIdFromName}
            />
          ))}
        </div>
      </div>
      {/* Right sidebar for trending communities can be added here as in the original file */}
    </div>
  );
}