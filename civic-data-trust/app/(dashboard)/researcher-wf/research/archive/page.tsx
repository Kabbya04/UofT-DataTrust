"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Archive, Search, Filter, FileText, Download, Calendar, Tag, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { DATASET_TAGS, DatasetTag } from "@/app/constants/dataset-tags";
// Mock data for archived datasets
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
    status: "Processing"
  },
  {
    id: 3,
    title: "Product Images Dataset",
    description: "High-resolution product images with metadata",
    type: "Image",
    size: "127.3 MB",
    dateArchived: "2024-03-08",
    tags: ["Images", "Products", "E-commerce"],
    status: "Ready"
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

export default function ArchivePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
   const [filterTags, setFilterTags] = useState<DatasetTag[]>([]);
  const filteredDatasets = archivedDatasets.filter(dataset => 
    filterTags.length === 0 || 
    filterTags.some(tag => dataset.tags.includes(tag))
  );


  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Archive className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Archive</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your archived datasets and use them in research projects
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search archived datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="tabular">Tabular</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="size">File Size</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDatasets.map((dataset) => (
          <Card key={dataset.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{dataset.title}</CardTitle>
                  <Badge variant={dataset.status === "Ready" ? "default" : "secondary"} className="mb-2">
                    {dataset.status}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Remove from Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {dataset.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{dataset.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-medium">{dataset.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Archived:</span>
                  <span className="font-medium">{dataset.dateArchived}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {dataset.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button 
                className="w-full" 
                variant="outline"
                disabled={dataset.status !== "Ready"}
              >
                Use in Project
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDatasets.length === 0 && (
        <div className="text-center py-12">
          <Archive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No archived datasets found</h3>
          <p className="text-muted-foreground">
            {searchQuery || filterType !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Start by uploading and archiving datasets to use in your research projects"
            }
          </p>
        </div>
      )}
    </div>
  );
}