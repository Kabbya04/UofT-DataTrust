"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { FileText, ImageIcon, Video, Music } from "lucide-react"
import ExpandableContentCard from "../../../components/dashboard/expandable-content-card"

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState("all")

  const tabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ]

  const myFiles = [
    { type: "document", icon: FileText },
    { type: "image", icon: ImageIcon },
    { type: "video", icon: Video },
    { type: "document", icon: FileText },
    { type: "image", icon: ImageIcon },
    { type: "audio", icon: Music },
  ]

  const posts = [
    {
      id: 1,
      title: "Title Goes Here",
      author: {
        name: "Jhon Doe",
        avatar: "/avatars/jhon-doe.png", // Replace with actual avatar path or URL
        username: "jhon_doe"
      },
      timestamp: "1 hour ago",
      content:
        "eget Vestibulum dignissim, non. placerat lobortis, elit varius cursus Quisque Sed varius elit elit. Nam libero, nisl. Morbi placerat lobortis, elit varius cursus Quisque elit varius cursus Quisque.",
      communityName: "Community Name",
      hasVideo: true,
    },
    {
      id: 2,
      title: "Title Goes Here",
      author: {
        name: "Jhon Doe",
        avatar: "/avatars/jhon-doe.png", // Replace with actual avatar path or URL
        username: "jhon_doe"
      },
      timestamp: "1 hour ago",
      content:
        "eget Vestibulum dignissim, non. placerat lobortis, elit varius cursus Quisque Sed varius elit elit. Nam libero, nisl. Morbi placerat lobortis, elit varius cursus Quisque elit varius cursus Quisque.",
      communityName: "Community Name",
      hasVideo: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">

        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <ExpandableContentCard
                  key={post.id}
                  id={post.id.toString()}
                  title={post.title}
                  author={post.author}
                  timestamp={post.timestamp}
                  content={post.content}
                  communityName={post.communityName}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Files */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">My Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {myFiles.map((file, index) => {
                    const IconComponent = file.icon
                    return (
                      <div
                        key={index}
                        className="aspect-square bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer"
                      >
                        <IconComponent className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-muted-foreground">Communities</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">18</div>
                    <div className="text-sm text-muted-foreground">Datasets</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
