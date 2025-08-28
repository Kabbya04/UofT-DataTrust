'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { PlayCircle, Image as ImageIcon } from "lucide-react";
import { useCommunity } from "@/app/components/contexts/community-context";

export default function CommunityMemberHomePage() {
  const router = useRouter();
  const { communities } = useCommunity();

  const topGridItems = [
    { title: "Intro to Data Sharing", type: "video" },
    { title: "Latest Community Datasets", type: "image" },
    { title: "How to Join a Project", type: "video" },
  ];

  const latestItems = [
    { title: "Revolutionary Data Sharing Protocol Implementation" },
    { title: "New Healthcare Analytics Framework Released" },
    { title: "Community Data Privacy Guidelines Update" },
    { title: "Machine Learning in Pediatric Diagnosis" },
  ];

  const popularCommunities = communities.filter(c => c.category === "Technology" || c.category === "Medicine").slice(0, 3);
  
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
                  {item.type === 'video' ? <PlayCircle className="h-12 w-12 text-muted-foreground/50"/> : <ImageIcon className="h-12 w-12 text-muted-foreground/50"/>}
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
            {latestItems.map((item, i) => (
              <Card key={i} className="flex flex-col md:flex-row items-center gap-6 p-4">
                <div className="w-full md:w-48 h-32 bg-muted rounded-md flex-shrink-0 flex items-center justify-center">
                    <PlayCircle className="h-12 w-12 text-muted-foreground/50"/>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Popular Communities</h2>
        <div className="space-y-4">
          {popularCommunities.map((community, i) => (
             <Card key={i}>
               <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{community.name}</h3>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 mb-4">
                    <li>{community.memberCount} members</li>
                    <li>{Math.floor(Math.random() * 20) + 5} datasets</li>
                    <li>{community.category} data & research</li>
                  </ul>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="w-full" onClick={() => router.push(`/community-member-wf/community-details/${community.id}`)}>View Details</Button>
                    <Button className="w-full" onClick={() => router.push(`/community-member-wf/join-community?communityId=${community.id}`)}>Join Community</Button>
                  </div>
               </CardContent>
             </Card>
          ))}
        </div>
      </div>
    </div>
  );
}