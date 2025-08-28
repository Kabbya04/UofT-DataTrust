'use client';

import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ClubIcon, CheckCircle, BarChart, Filter, Image as ImageIcon } from "lucide-react";

const projects = [
  { name: "Climate Change", date: "7 Aug 2025", size: "2.5 MB", tag: "Sports" },
  { name: "Market Trends Analysis", date: "15 Jul 2025", size: "5.1 MB", tag: "Business" },
  { name: "AI Model Training", date: "2 Jun 2025", size: "12.8 MB", tag: "Technology" },
];

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Page / Page / Page</p>
        <h1 className="text-4xl font-bold text-mono-caps">Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <ClubIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">90,000</div>
            <p className="text-xs text-muted-foreground">+100% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Successful Projects</CardTitle>
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">50,000</div>
            <p className="text-xs text-muted-foreground">+100% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <BarChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">30,000</div>
            <p className="text-xs text-muted-foreground">+100% vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <Tabs defaultValue="projects">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="executions">Executions</TabsTrigger>
          </TabsList>
          <button className="p-2 rounded-md hover:bg-muted">
            <Filter className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <TabsContent value="projects" className="space-y-4">
          {projects.map((project, index) => (
            <Card key={index} className="p-4 flex items-center justify-between hover:border-primary transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.date} &nbsp; {project.size}</p>
                </div>
              </div>
              <Badge variant="outline">{project.tag}</Badge>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}