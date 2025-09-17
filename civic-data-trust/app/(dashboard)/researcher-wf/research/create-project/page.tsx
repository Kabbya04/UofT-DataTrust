"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Badge } from "@/app/components/ui/badge";
import { FolderPlus, Database, Search, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock archived datasets (same as archive page)
const archivedDatasets = [
  {
    id: 1,
    title: "Customer Behavior Analysis 2024",
    description: "Comprehensive analysis of customer purchasing patterns and preferences",
    type: "Tabular",
    size: "15.2 MB",
    dateArchived: "2024-03-15",
    tags: ["Customer", "Analytics", "2024"],
    status: "Ready"
  },
  {
    id: 2,
    title: "Social Media Sentiment Data",
    description: "Sentiment analysis dataset from various social media platforms",
    type: "Text",
    size: "8.7 MB",
    dateArchived: "2024-03-10",
    tags: ["Social Media", "Sentiment", "NLP"],
    status: "Ready"
  },
  {
    id: 3,
    title: "Product Images Dataset",
    description: "High-resolution product images with metadata",
    type: "Image",
    size: "127.3 MB",
    dateArchived: "2024-03-08",
    tags: ["Images", "Products", "E-commerce"],
    status: "Processing"
  },
  {
    id: 4,
    title: "Financial Market Data Q1",
    description: "Stock market data and trading volumes for Q1 2024",
    type: "Tabular",
    size: "23.1 MB",
    dateArchived: "2024-03-05",
    tags: ["Finance", "Trading", "Q1"],
    status: "Ready"
  }
];

export default function CreateProjectPage() {
  const router = useRouter();
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedDatasets, setSelectedDatasets] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const availableDatasets = archivedDatasets.filter(dataset => 
    dataset.status === "Ready" && 
    dataset.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDatasetToggle = (datasetId: number) => {
    setSelectedDatasets(prev => 
      prev.includes(datasetId) 
        ? prev.filter(id => id !== datasetId)
        : [...prev, datasetId]
    );
  };

  const handleCreateProject = () => {
    if (!projectTitle.trim()) {
      alert("Please enter a project title");
      return;
    }
    if (selectedDatasets.length === 0) {
      alert("Please select at least one dataset");
      return;
    }
    
    // Placeholder: Navigate to plugin interface
    console.log("Creating project with:", {
      title: projectTitle,
      description: projectDescription,
      datasets: selectedDatasets
    });
    
    // TODO: Implement navigation to plugin interface
    alert("Project created! This will navigate to the plugin interface.");
  };

  return (
    <div className="w-full mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FolderPlus className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Create New Project</h1>
        </div>
        <p className="text-muted-foreground">
          Set up a new research project using your archived datasets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="project-title">Project Title *</Label>
              <Input
                id="project-title"
                placeholder="Enter project title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="project-description">Description (Optional)</Label>
              <Textarea
                id="project-description"
                placeholder="Describe your research project..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div className="pt-4">
              <h4 className="font-medium mb-2">Selected Datasets</h4>
              {selectedDatasets.length === 0 ? (
                <p className="text-sm text-muted-foreground">No datasets selected yet</p>
              ) : (
                <div className="space-y-2">
                  {selectedDatasets.map(id => {
                    const dataset = archivedDatasets.find(d => d.id === id);
                    return dataset ? (
                      <div key={id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-sm font-medium">{dataset.title}</span>
                        <Badge variant="outline">{dataset.type}</Badge>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dataset Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Select Archived Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Dataset List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableDatasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className={cn(
                    "border rounded-lg p-3 cursor-pointer transition-colors hover:bg-muted/50",
                    selectedDatasets.includes(dataset.id) && "border-primary bg-primary/5"
                  )}
                  onClick={() => handleDatasetToggle(dataset.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {selectedDatasets.includes(dataset.id) ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1">{dataset.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {dataset.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{dataset.type}</Badge>
                        <span className="text-xs text-muted-foreground">{dataset.size}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {availableDatasets.length === 0 && (
                <div className="text-center py-8">
                  <Database className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "No datasets match your search" : "No ready datasets available"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6 cursor-pointer">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button 
          onClick={handleCreateProject}
          disabled={!projectTitle.trim() || selectedDatasets.length === 0}
          style={{ backgroundColor: "#2196F3", color: "white", border: "none" }}
        >
          Create Project
        </Button>
      </div>
    </div>
  );
}