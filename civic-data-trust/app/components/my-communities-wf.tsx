"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, Database, TrendingUp, Clock, Settings, Plus } from "lucide-react"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { useCommunity } from "./contexts/community-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export function MyCommunitiesWF() {
  const { communities, createCommunity, loading, error } = useCommunity()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [communityName, setCommunityName] = useState("")
  const [creating, setCreating] = useState(false)

  // Filter joined communities
  const joinedCommunities = communities.filter(c => c.isJoined)

  const handleViewCommunity = (communityId: string) => {
    router.push(`/community-member-wf/community-discovery-and-membership/community-details-wf/${communityId}`)
  }

  const handleJoinCommunity = (communityId: string) => {
    // In a real app, this would join the community
    router.push(`/community-member-wf/community-discovery-and-membership/community-details-wf/${communityId}`)
  }

  const handleCreateCommunity = async () => {
    if (communityName.trim()) {
      setCreating(true)
      const success = await createCommunity(communityName.trim())
      setCreating(false)
      
      if (success) {
        setCommunityName("")
        setOpen(false)
      }
    }
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">My Communities</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Community
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a new community</DialogTitle>
                <DialogDescription>
                  Give your community a name. You can change this later.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleCreateCommunity}
                  disabled={creating || !communityName.trim()}
                >
                  {creating ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-muted-foreground">Manage your communities and stay updated with recent activities</p>
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>

      <Tabs defaultValue="joined" className="space-y-6">
        <TabsList>
          <TabsTrigger value="joined">Joined Communities</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="recommendations">Recommended</TabsTrigger>
        </TabsList>

        <TabsContent value="joined" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading communities...</div>
            </div>
          ) : joinedCommunities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">You haven't joined any communities yet.</div>
              <Button 
                variant="outline" 
                onClick={() => router.push('/community-member-wf/community-discovery-and-membership')}
              >
                Discover Communities
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedCommunities.map((community) => (
              <Card key={community.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{community.name}</h3>
                      {community.category && <Badge variant="secondary" className="mb-2">{community.category}</Badge>}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {community.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {community.description}
                  </p>}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{community.memberCount?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Database className="h-4 w-4" />
                      <span>{Math.floor(Math.random() * 50) + 10} datasets</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewCommunity(community.id)}
                    >
                      View Community
                    </Button>
                    <Button variant="default" size="sm" className="flex-1">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <p>Recent activity is not available yet.</p>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <p>Recommendations are not available yet.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
