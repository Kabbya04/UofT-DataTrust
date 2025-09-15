'use client';

import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ClubIcon, CheckCircle, BarChart, Filter, Image as ImageIcon, Circle, CheckCircle2, XCircle, Clock } from "lucide-react";
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

// Status icon component with proper Figma design
const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'Completed':
            return <CheckCircle2 className="h-4 w-4" style={{ color: '#2196F3' }} />;
        case 'In Progress':
            return <Clock className="h-4 w-4 text-button-warning" />;
        case 'Failed':
            return <XCircle className="h-4 w-4 text-button-danger" />;
        default:
            return <Circle className="h-4 w-4 text-civic-gray-300" />;
    }
};

// A dedicated component for the execution timeline following Figma high-fidelity design
const ExecutionTimeline = ({ executions }: { executions: typeof projects[0]['executions'] }) => {
    return (
        <div className="relative pl-8">
            {/* The vertical line connecting the steps - Figma styled */}
            <div className="absolute left-[0.75rem] top-3 h-[calc(100%-1.5rem)] w-px bg-border"></div>
            {executions.map((exec, index) => (
                <div key={index} className="relative pb-6 last:pb-2 flex items-start gap-4">
                    {/* Status indicator with proper Figma design */}
                    <div className="absolute left-[-0.125rem] top-0.5 h-6 w-6 rounded-full bg-card border-2 border-border flex items-center justify-center shadow-sm">
                        <StatusIcon status={exec.status} />
                    </div>
                    
                    {/* Content section with Figma typography */}
                    <div className="ml-8 flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <p className="font-bold text-figma-lg text-card-foreground">{exec.step}</p>
                            <Badge 
                                variant="outline" 
                                className={cn(
                                    "text-figma-sm font-medium rounded-lg px-2 py-1 border",
                                    exec.status === 'Completed' && "bg-civic-accent-green/10 text-civic-accent-green border-civic-accent-green/20",
                                    exec.status === 'In Progress' && "bg-button-warning/10 text-button-warning border-button-warning/20",
                                    exec.status === 'Failed' && "bg-button-danger/10 text-button-danger border-button-danger/20"
                                )}
                            >
                                {exec.status}
                            </Badge>
                        </div>
                        <p className="text-figma-base text-muted-foreground">{exec.timestamp}</p>
                    </div>
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

      {/* Stats Cards - Figma Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-card border shadow-figma hover:shadow-figma-card transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-figma-base font-medium text-muted-foreground">Projects</CardTitle>
            <div className="p-2 bg-muted rounded-lg">
              <ClubIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-figma-3xl font-bold text-card-foreground">90,000</div>
            <p className="text-figma-sm text-muted-foreground">+100% vs last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card border shadow-figma hover:shadow-figma-card transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-figma-base font-medium text-muted-foreground">Successful Projects</CardTitle>
            <div className="p-2 bg-muted rounded-lg">
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-figma-3xl font-bold text-card-foreground">50,000</div>
            <p className="text-figma-sm text-muted-foreground">+100% vs last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card border shadow-figma hover:shadow-figma-card transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-figma-base font-medium text-muted-foreground">Success Rate</CardTitle>
            <div className="p-2 bg-muted rounded-lg">
              <BarChart className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-figma-3xl font-bold text-card-foreground">30,000</div>
            <p className="text-figma-sm text-muted-foreground">+100% vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects List with Tabs - Figma Design */}
      <Tabs defaultValue="projects">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-muted border border-border rounded-xl p-1">
            <TabsTrigger value="projects" className="text-figma-base font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-sm rounded-lg">My Projects</TabsTrigger>
            <TabsTrigger value="credentials" className="text-figma-base font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-sm rounded-lg">Credentials</TabsTrigger>
            <TabsTrigger value="executions" className="text-figma-base font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-sm rounded-lg">Executions</TabsTrigger>
          </TabsList>
          <button className="p-2 rounded-lg hover:bg-accent transition-colors">
            <Filter className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        
        <TabsContent value="projects" className="space-y-4">
          {projects.map((project, index) => (
            <Card key={index} className="bg-card border shadow-figma hover:shadow-figma-card transition-all duration-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-figma-lg text-card-foreground">{project.name}</h3>
                  <p className="text-figma-base text-muted-foreground">{project.date} &nbsp; {project.size}</p>
                </div>
              </div>
              <Badge variant="outline" className="border-border text-muted-foreground bg-card rounded-lg px-3 py-1 text-figma-base">
                {project.tag}
              </Badge>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          {projects.map((project, index) => (
            <Card key={index} className="bg-card border shadow-figma hover:shadow-figma-card transition-all duration-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-figma-lg text-card-foreground">{project.name}</h3>
                  <p className="text-figma-base text-muted-foreground">{project.date} &nbsp; {project.size}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-figma-sm text-muted-foreground mb-2">Data provided by</p>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    {project.credentials.map((cred, i) => (
                        <Badge key={i} variant="secondary" className="bg-muted text-card-foreground border-border rounded-lg px-3 py-1 text-figma-sm font-normal" style={{ backgroundColor: '#2196F3', color: 'white' }}>{cred.name}</Badge>
                    ))}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="executions" className="space-y-6">
            {projects.map((project, index) => (
                <Card key={index} className="bg-card border shadow-figma hover:shadow-figma-card transition-all duration-200 p-8">
                    <div className="mb-6">
                        <h3 className="font-bold text-figma-xl text-card-foreground mb-2">{project.name}</h3>
                        <p className="text-figma-base text-muted-foreground">{project.date}</p>
                    </div>
                    <ExecutionTimeline executions={project.executions} />
                </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}