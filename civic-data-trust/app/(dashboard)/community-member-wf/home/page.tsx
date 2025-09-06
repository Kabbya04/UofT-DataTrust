'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { PlayCircle, Image as ImageIcon } from "lucide-react";
import { useCommunity } from "@/app/components/contexts/community-context";
import ExpandableContentCard from "../../../components/dashboard/expandable-content-card"
export default function CommunityMemberHomePage() {
  const router = useRouter();
  const { communities, loading, error } = useCommunity();

  const posts = [
    {
      id: "1",
      title: "Title Goes Here",
      author: {
        name: "Jhon Doe",
        avatar: "/placeholder.svg?height=40&width=40",
        username: "jhondoe",
      },
      timestamp: "1 hour ago",
      content:
        "urna ex enim, commodo amet, faucibus tincidunt urna tortor, luctus odio sed elit, amet, consectetur risus est. ipsum Praesent Nullam leo. tortor, laoreet nulla, commodo nisl lacus faucibus non. eu quam eu orci nec quis elit amet, turpis. Quisque felis, Nunc in lobortis, facilisis ullamcorper ipsum Ut hendrerit laoreet varius luctus odio dolor lacus laoreet sit tincidunt elit risus dui. sodales. venenatis felis, non convallis. ipsum venenatis viverra est. commodo elit. Sed",
      videoThumbnail: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "2",
      title: "Another Post Title",
      author: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        username: "janesmith",
      },
      timestamp: "2 hours ago",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      videoThumbnail: "/placeholder.svg?height=200&width=400",
    },
  ]

  const topGridItems = [
    { title: "Intro to Data Sharing", type: "video" },
    { title: "Latest Community Datasets", type: "image" },
    { title: "How to Join a Project", type: "video" },
  ];


  // Sort communities by member count (descending) and take top 3
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
                <p className="text-sm text-muted-foreground mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Latest Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Latest (Based on your interest)</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <ExpandableContentCard key={post.id} {...post} />
            ))}

            {/* {latestItems.map((item, i) => (
              <Card key={i} className="flex flex-col md:flex-row items-center gap-6 p-4">
                <div className="w-full md:w-48 h-32 bg-muted rounded-md flex-shrink-0 flex items-center justify-center">
                    <PlayCircle className="h-12 w-12 text-muted-foreground/50"/>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.</p>
                </div>
              </Card>
            ))} */}
          </div>
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
            {popularCommunities.map((community, i) => (
              <Card key={i}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{community.name}</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 mb-4">
                  <li>{community.memberCount || 0} members</li>
                  <li>{Math.floor(Math.random() * 20) + 5} datasets</li>
                  <li>{community.community_category?.name || 'General'} data & research</li>
                </ul>
                <div className="flex items-center gap-1 ">
                  <Button variant="outline" className="w-fit text-xs" onClick={() => router.push(`/community-member-wf/community-details/${community.id}`)}>View Details</Button>
                  <Button className="w-fit text-xs" onClick={() => router.push(`/community-member-wf/join-community?communityId=${community.id}`)}>Join Community</Button>
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