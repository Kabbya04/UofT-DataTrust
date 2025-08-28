'use client';

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { PlayCircle, MoreHorizontal } from "lucide-react";

const communityData = [
  { name: "Toronto Health Community", members: 124, datasets: 18, field: "Healthcare data & research" },
  { name: "Urban Mobility Project", members: 88, datasets: 12, field: "Transportation data" },
];

export default function ResearcherHomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader className="flex-row items-start justify-between">
                  <div className="w-12 h-12 bg-muted rounded-md"></div>
                  <MoreHorizontal className="h-5 w-5 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold">Title</h3>
                <p className="text-sm text-muted-foreground mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Latest Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Latest (Based on your interest)</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="flex flex-col md:flex-row items-center gap-6 p-4">
                <div className="w-full md:w-48 h-32 bg-muted rounded-md flex-shrink-0 flex items-center justify-center">
                    <PlayCircle className="h-12 w-12 text-muted-foreground/50"/>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Title</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.</p>
                </div>
                <Button variant="outline">Access for Research</Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Popular Communities</h2>
        <div className="space-y-4">
          {communityData.map((community, i) => (
             <Card key={i}>
               <CardHeader>
                 <CardTitle>{community.name}</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{community.members} members</p>
                  <p className="text-sm text-muted-foreground">{community.datasets} datasets</p>
                  <p className="text-sm text-muted-foreground">{community.field}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Button variant="outline" className="w-full">View Details</Button>
                    <Button className="w-full">Join Community</Button>
                  </div>
               </CardContent>
             </Card>
          ))}
        </div>
      </div>
    </div>
  );
}