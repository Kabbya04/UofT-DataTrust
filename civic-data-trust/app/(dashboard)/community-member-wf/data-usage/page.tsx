"use client"

import { useRouter } from "next/navigation";
import { Download, Upload, Eye, Share2, Calendar, Database } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

export default function DataUsagePage() {
  const router = useRouter();

  const usageStats = {
    totalDatasets: 847, totalDownloads: 12456, totalUploads: 234,
    storageUsed: "45.7 GB"
  }

  const recentActivity = [
    { id: 1, action: "Downloaded", title: "Healthcare Analytics Dataset 2024", community: "Medical AI Research Hub", size: "2.3 GB", time: "2 hours ago", type: "download" },
    { id: 2, action: "Uploaded", title: "Urban Traffic Patterns", community: "Smart Cities Initiative", size: "856 MB", time: "5 hours ago", type: "upload" },
  ]

  const myDatasets = [
    { id: 'DS-201', name: 'Urban Traffic Patterns', description: 'Dataset containing traffic flow from major intersections.', type: 'CSV', size: '856 MB' },
    { id: 'DS-101', name: 'Healthcare Analytics Dataset 2024', description: 'Anonymized patient data for predictive modeling.', type: 'Tabular', size: '2.3 GB' },
  ]

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'download': return <Download className="h-5 w-5 text-blue-400" />
      case 'upload': return <Upload className="h-5 w-5 text-gray-400" />
      default: return <Database className="h-5 w-5" />
    }
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-foreground">Data Usage</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Calendar className="h-4 w-4 mr-2" />Last 7 days</Button>
            <Button variant="outline" size="sm">Export Report</Button>
            <Button size="sm" onClick={() => router.push('/community-member-wf/upload-dataset')} className="bg-primary hover:bg-primary/90">
              <Upload className="h-4 w-4 mr-2" />
              Upload Dataset
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">Monitor your data consumption and activity across communities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Datasets</CardTitle><Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader><CardContent><div className="text-2xl font-bold">{usageStats.totalDatasets}</div></CardContent>
        </Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Downloads</CardTitle><Download className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{usageStats.totalDownloads.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Uploads</CardTitle><Upload className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{usageStats.totalUploads}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Storage Used</CardTitle><Database className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{usageStats.storageUsed}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="popular">Popular Datasets</TabsTrigger>
          <TabsTrigger value="mydatasets">My Datasets</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          {recentActivity.map((activity) => (
            <Card key={activity.id} className="p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getActionIcon(activity.type)}
                  <div>
                    <p className="font-medium">{activity.action} {activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Community: {activity.community} &nbsp;&nbsp; Size: {activity.size} &nbsp;&nbsp; {activity.time}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="popular">
          <p className="text-muted-foreground p-4 text-center">Popular datasets will be listed here.</p>
        </TabsContent>

        <TabsContent value="mydatasets" className="space-y-4">
          {myDatasets.map((dataset) => (
            <Card key={dataset.id} className="p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{dataset.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{dataset.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">Type: {dataset.type} &nbsp;&nbsp; Size: {dataset.size}</p>
                </div>
                <Button
                  onClick={() => router.push(`/community-member-wf/upload-files?datasetId=${dataset.id}`)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Post
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}