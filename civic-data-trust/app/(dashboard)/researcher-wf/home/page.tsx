'use client';

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { PlayCircle, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import ExpandableContentCard from "@/app/components/dashboard/expandable-content-card";

const communityData = [
  { name: "Toronto Health Community", members: 124, datasets: 18, field: "Healthcare data & research" },
  { name: "Urban Mobility Project", members: 88, datasets: 12, field: "Transportation data" },
  { name: "AI Research Collective", members: 210, datasets: 45, field: "AI model datasets" },
];

const trendingPosts = [
  {
    id: "1",
    title: "Lorem Ipsum Dolor Sit Amet",
    author: { name: "Ronald Richards", avatar: "/placeholder.svg", username: "ronaldrichards" },
    timestamp: "1 hour ago",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros",
    videoThumbnail: "/placeholder.svg",
  },
  {
    id: "2", 
    title: "Lorem Ipsum Dolor Sit Amet",
    author: { name: "Darrell Steward", avatar: "/placeholder.svg", username: "darrellsteward" },
    timestamp: "1 hour ago",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros",
    videoThumbnail: "/placeholder.svg",
  },
  {
    id: "3",
    title: "Lorem Ipsum Dolor Sit Amet", 
    author: { name: "Robert Fox", avatar: "/placeholder.svg", username: "robertfox" },
    timestamp: "1 hour ago",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros",
    videoThumbnail: "/placeholder.svg",
  },
];

const latestPosts = [
  {
    id: "4",
    title: "Lorem Ipsum Dolor Sit Amet",
    author: { name: "Ronald Richards", avatar: "/placeholder.svg", username: "ronaldrichards" },
    timestamp: "1 hour ago", 
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    videoThumbnail: "/placeholder.svg",
  },
  {
    id: "5",
    title: "Lorem Ipsum Dolor Sit Amet",
    author: { name: "Ronald Richards", avatar: "/placeholder.svg", username: "ronaldrichards" },
    timestamp: "1 hour ago",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    videoThumbnail: "/placeholder.svg",
  },
  {
    id: "6",
    title: "Lorem Ipsum Dolor Sit Amet",
    author: { name: "Ronald Richards", avatar: "/placeholder.svg", username: "ronaldrichards" },
    timestamp: "1 hour ago",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    videoThumbnail: "/placeholder.svg",
  },
];

export default function ResearcherHomePage() {
  return (
    <div className="space-y-8 font-urbanist">
      {/* Trending Now Section */}
      <div>
        <h2 className="text-figma-3xl font-bold text-civic-gray-900 mb-6">Trending Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingPosts.map((post) => (
            <ExpandableContentCard key={post.id} {...post} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Contents Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-figma-3xl font-bold text-civic-gray-900">Latest Contents</h2>
          <div className="space-y-6">
            {latestPosts.map((post) => (
              <ExpandableContentCard key={post.id} {...post} />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <h2 className="text-figma-3xl font-bold text-civic-gray-900">Popular Communities</h2>
          <div className="space-y-4">
            {communityData.map((community, i) => (
              <Card key={i} className="bg-white border border-civic-gray-200 rounded-lg shadow-figma hover:shadow-figma-card transition-all duration-200">
                <div className="flex gap-4 p-4">
                  <div className="w-[119px] h-[107px] bg-gradient-to-br from-green-400 to-blue-500 rounded-md flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <h3 className="font-bold text-figma-lg text-civic-gray-900">{community.name}</h3>
                    <div className="space-y-1.5 text-figma-base text-civic-gray-500">
                      <p>{community.members} members</p>
                      <p>{community.datasets} datasets</p>
                      <p>{community.field}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}