'use client';

import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ClubIcon, CheckCircle, BarChart, Filter, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Augmented mock data with credentials and execution steps
const projects = [
  { 
    name: "Climate Change", 
    date: "7 Aug 2025", 
    size: "2.5 MB", 
    tag: "Sports",
    credentials: [
      { name: "Jhon Doe" },
      { name: "Jane Doe" },
      { name: "Steve Smith" }
    ],
    executions: [
      { step: "Data Validation - Climate Change", status: "Completed", timestamp: "Completed: 1 pm, 5 Aug 2025" },
      { step: "Data Import - Civic", status: "Completed", timestamp: "Completed: 1 pm, 5 Aug 2025" },
      { step: "Data Cleaning - Community", status: "Completed", timestamp: "Completed: 1 pm, 5 Aug 2025" }
    ]
  },
  { 
    name: "Market Trends Analysis", 
    date: "15 Jul 2025", 
    size: "5.1 MB", 
    tag: "Business",
    credentials: [
      { name: "Jhon Doe" },
      { name: "Steve Smith" }
    ],
    executions: [
      { step: "Initial Data Pull", status: "Completed", timestamp: "Completed: 9 am, 14 Jul 2025" },
      { step: "Sentiment Analysis", status: "In Progress", timestamp: "Started: 10 am, 14 Jul 2025" }
    ]
  },
  { 
    name: "AI Model Training", 
    date: "2 Jun 2025", 
    size: "12.8 MB", 
    tag: "Technology",
    credentials: [
      { name: "Jane Doe" }
    ],
    executions: [
      { step: "Dataset Preprocessing", status: "Completed", timestamp: "Completed: 10 am, 1 Jun 2025" },
      { step: "Model Training", status: "Completed", timestamp: "Completed: 4 pm, 1 Jun 2025" },
      { step: "Model Evaluation", status: "Failed", timestamp: "Failed: 5 pm, 1 Jun 2025" }
    ]
  },
];

// A dedicated component for the execution timeline for better readability
const ExecutionTimeline = ({ executions }: { executions: typeof projects[0]['executions'] }) => {
    return (
        <div className="relative pl-6">
            {/* The vertical line connecting the steps */}
            <div className="absolute left-[0.2rem] top-2 h-[calc(100%-2rem)] w-px bg-border -translate-x-1/2"></div>
            {executions.map((exec, index) => (
                <div key={index} className="relative pb-6 last:pb-0">
                    <div className="absolute left-[-0.5rem] top-1 h-4 w-4 rounded-full border-2 bg-background border-border -translate-x-1/2"></div>
                    <p className="font-medium text-sm text-foreground">{exec.step}</p>
                    <p className="text-xs text-muted-foreground">{exec.timestamp}</p>
                </div>
            ))}
        </div>
    );
};


export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Researcher / Research / Overview</p>
        <h1 className="text-4xl font-bold text-mono-caps">Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Projects</CardTitle><div className="p-2 bg-muted rounded-md"><ClubIcon className="h-5 w-5 text-muted-foreground" /></div></CardHeader><CardContent><div className="text-3xl font-bold">90,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Successful Projects</CardTitle><div className="p-2 bg-muted rounded-md"><CheckCircle className="h-5 w-5 text-muted-foreground" /></div></CardHeader><CardContent><div className="text-3xl font-bold">50,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Success Rate</CardTitle><div className="p-2 bg-muted rounded-md"><BarChart className="h-5 w-5 text-muted-foreground" /></div></CardHeader><CardContent><div className="text-3xl font-bold">30,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
      </div>

      {/* Projects List with Tabs */}
      <Tabs defaultValue="projects">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="executions">Executions</TabsTrigger>
          </TabsList>
          <button className="p-2 rounded-md hover:bg-muted"><Filter className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        
        <TabsContent value="projects" className="space-y-4">
          {projects.map((project, index) => (
            <Card key={index} className="p-4 flex items-center justify-between hover:border-primary transition-colors">
              <div className="flex items-center gap-4"><div className="p-3 bg-muted rounded-lg"><ImageIcon className="h-6 w-6 text-muted-foreground" /></div><div><h3 className="font-semibold">{project.name}</h3><p className="text-sm text-muted-foreground">{project.date} &nbsp; {project.size}</p></div></div>
              <Badge variant="outline">{project.tag}</Badge>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          {projects.map((project, index) => (
            <Card key={index} className="p-4 flex items-center justify-between hover:border-primary transition-colors">
              <div className="flex items-center gap-4"><div className="p-3 bg-muted rounded-lg"><ImageIcon className="h-6 w-6 text-muted-foreground" /></div><div><h3 className="font-semibold">{project.name}</h3><p className="text-sm text-muted-foreground">{project.date} &nbsp; {project.size}</p></div></div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Data provided by</p>
                <div className="flex items-center gap-2">
                    {project.credentials.map((cred, i) => (
                        <Badge key={i} variant="secondary" className="font-normal">{cred.name}</Badge>
                    ))}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="executions" className="space-y-4">
            {projects.map((project, index) => (
                <Card key={index} className="p-4 hover:border-primary transition-colors">
                    <h3 className="font-semibold mb-1">{project.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{project.date}</p>
                    <ExecutionTimeline executions={project.executions} />
                </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}