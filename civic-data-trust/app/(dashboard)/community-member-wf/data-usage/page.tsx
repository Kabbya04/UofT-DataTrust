"use client"

import { useState } from "react"
import { Download, Upload, Eye, Share2, Calendar, TrendingUp, Database } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

export default function DataUsagePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")

  const usageStats = {
    totalDatasets: 847, totalDownloads: 12456, totalUploads: 234,
    storageUsed: "45.7 GB", storageLimit: "100 GB"
  }

  const recentActivity = [
    { id: 1, action: "Downloaded", dataset: "Healthcare Analytics Dataset 2024", community: "Medical AI Research Hub", size: "2.3 GB", time: "2 hours ago", type: "download" },
    { id: 2, action: "Uploaded", dataset: "Urban Traffic Patterns", community: "Smart Cities Initiative", size: "856 MB", time: "5 hours ago", type: "upload" },
    { id: 3, action: "Shared", dataset: "Climate Change Models", community: "Environmental Research", size: "1.2 GB", time: "1 day ago", type: "share" },
    { id: 4, action: "Viewed", dataset: "Financial Market Trends Q4", community: "Financial Analytics Pro", size: "512 MB", time: "1 day ago", type: "view" },
    { id: 5, action: "Downloaded", dataset: "Gaming Behavior Analytics", community: "Gaming Analytics Pro", size: "3.1 GB", time: "2 days ago", type: "download" }
  ]

  const topDatasets = [
    { name: "Global Health Indicators", downloads: 1234, views: 8765, size: "2.1 GB" },
    { name: "E-commerce Transaction Data", downloads: 987, views: 6543, size: "1.8 GB" },
    { name: "Social Media Sentiment Analysis", downloads: 876, views: 5432, size: "945 MB" },
    { name: "Weather Pattern Models", downloads: 765, views: 4321, size: "3.2 GB" },
    { name: "Transportation Networks", downloads: 654, views: 3210, size: "1.5 GB" }
  ]

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'download': return <Download className="h-4 w-4 text-blue-500" />
      case 'upload': return <Upload className="h-4 w-4 text-foreground" />
      case 'share': return <Share2 className="h-4 w-4 text-purple-500" />
      case 'view': return <Eye className="h-4 w-4 text-orange-500" />
      default: return <Database className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Data Usage</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2"><Calendar className="h-4 w-4" />Last 7 days</Button>
            <Button variant="outline" size="sm">Export Report</Button>
          </div>
        </div>
        <p className="text-muted-foreground">Monitor your data consumption and activity across communities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Datasets</CardTitle><Database className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{usageStats.totalDatasets}</div><p className="text-xs text-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3" />+12% from last month</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Downloads</CardTitle><Download className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{usageStats.totalDownloads.toLocaleString()}</div><p className="text-xs text-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3" />+8% from last month</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Uploads</CardTitle><Upload className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{usageStats.totalUploads}</div><p className="text-xs text-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3" />+23% from last month</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Storage Used</CardTitle><Database className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{usageStats.storageUsed}</div><p className="text-xs text-muted-foreground">of {usageStats.storageLimit} limit</p></CardContent></Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="popular">Popular Datasets</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          {recentActivity.map((activity) => (<Card key={activity.id} className="p-4"><div className="flex items-center justify-between"><div className="flex items-start gap-3">{getActionIcon(activity.type)}<div className="flex-1"><div className="flex items-center gap-2 mb-1"><span className="text-sm font-medium">{activity.action}</span><span className="text-sm text-foreground">{activity.dataset}</span></div><div className="flex items-center gap-4 text-xs text-muted-foreground"><span>Community: {activity.community}</span><span>Size: {activity.size}</span><span>{activity.time}</span></div></div></div><Button variant="ghost" size="sm">View Details</Button></div></Card>))}
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          {topDatasets.map((dataset, index) => (<Card key={dataset.name} className="p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-sm font-bold text-primary">#{index + 1}</span></div><div><h3 className="font-semibold text-foreground">{dataset.name}</h3><div className="flex items-center gap-4 text-xs text-muted-foreground mt-1"><div className="flex items-center gap-1"><Download className="h-3 w-3" />{dataset.downloads} downloads</div><div className="flex items-center gap-1"><Eye className="h-3 w-3" />{dataset.views} views</div><div className="flex items-center gap-1"><Database className="h-3 w-3" />{dataset.size}</div></div></div></div><div className="flex gap-2"><Button variant="outline" size="sm">View</Button><Button variant="default" size="sm">Download</Button></div></div></Card>))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6"><h3 className="text-lg font-semibold mb-4">Usage by Category</h3><div className="space-y-4"><div className="flex justify-between items-center"><span className="text-sm">Healthcare</span><div className="flex items-center gap-2"><div className="w-24 h-2 bg-muted rounded-full overflow-hidden"><div className="w-3/4 h-full bg-blue-500"></div></div><span className="text-sm text-muted-foreground">75%</span></div></div><div className="flex justify-between items-center"><span className="text-sm">Technology</span><div className="flex items-center gap-2"><div className="w-24 h-2 bg-muted rounded-full overflow-hidden"><div className="w-3/5 h-full bg-primary"></div></div><span className="text-sm text-muted-foreground">60%</span></div></div><div className="flex justify-between items-center"><span className="text-sm">Business</span><div className="flex items-center gap-2"><div className="w-24 h-2 bg-muted rounded-full overflow-hidden"><div className="w-2/5 h-full bg-purple-500"></div></div><span className="text-sm text-muted-foreground">40%</span></div></div></div></Card>
            <Card className="p-6"><h3 className="text-lg font-semibold mb-4">Activity Trends</h3><div className="space-y-4"><div className="flex justify-between items-center"><span className="text-sm">This Week</span><span className="text-sm font-medium">234 activities</span></div><div className="flex justify-between items-center"><span className="text-sm">Last Week</span><span className="text-sm font-medium">198 activities</span></div><div className="flex justify-between items-center"><span className="text-sm">This Month</span><span className="text-sm font-medium">1,024 activities</span></div><div className="flex justify-between items-center"><span className="text-sm">Last Month</span><span className="text-sm font-medium">896 activities</span></div></div></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}