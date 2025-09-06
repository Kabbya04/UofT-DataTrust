"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, Database, TrendingUp, Clock, Settings, Plus } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { useCommunity } from "@/app/components/contexts/community-context"

export default function MyCommunitiesPage() {
  const { communities } = useCommunity()
  const router = useRouter()
  
  const joinedCommunities = communities.filter(c => c.isJoined)
  
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

  const recommendedCommunities = [
    { id: 7, name: "Medical AI Research Hub", memberCount: 892, datasets: 23, description: "AI applications in healthcare", category: "Medicine" },
    { id: 8, name: "Gaming Analytics Pro", memberCount: 4567, datasets: 67, description: "Game performance metrics", category: "Games" },
    { id: 9, name: "Financial Analytics Pro", memberCount: 4123, datasets: 58, description: "Financial market data", category: "Business" }
  ]

  const handleViewCommunity = (communityId: number) => {
    router.push(`/community-member-wf/community-details/${communityId}`)
  }

  const handleJoinCommunity = (communityId: number) => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedCommunities.map((community) => (
              <Card key={community.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{community.name}</h3>
                      <Badge variant="secondary" className="mb-2">{community.category}</Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{community.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1"><Users className="h-4 w-4" /><span>{community.memberCount.toLocaleString()}</span></div>
                    <div className="flex items-center gap-1"><Database className="h-4 w-4" /><span>{Math.floor(Math.random() * 50) + 10} datasets</span></div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewCommunity(community.id)}>View Community</Button>
                    <Button variant="default" size="sm" className="flex-1">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                      <span className="font-medium text-foreground hover:text-primary cursor-pointer" onClick={() => handleViewCommunity(activity.communityId)}>{activity.community}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCommunities.map((community) => (
              <Card key={community.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{community.name}</h3>
                    <Badge variant="outline" className="mb-2">{community.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{community.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1"><Users className="h-4 w-4" /><span>{community.memberCount.toLocaleString()}</span></div>
                    <div className="flex items-center gap-1"><Database className="h-4 w-4" /><span>{community.datasets} datasets</span></div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewCommunity(community.id)}>View Details</Button>
                    <Button variant="default" size="sm" className="flex-1" onClick={() => handleJoinCommunity(community.id)}>Join</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}