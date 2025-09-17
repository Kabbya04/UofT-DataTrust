"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Download, Flag, Filter } from "lucide-react";

// Mock data for flagged contents
const flaggedContents = [
  {
    id: 1,
    post: "Post Title",
    topic: "Health",
    reporter: "Jhon Doe",
    dateFlagged: "3 pm, Jan 15, 2025",
    status: "Pending"
  },
  {
    id: 2,
    post: "Post Title",
    topic: "Health",
    reporter: "Jhon Doe",
    dateFlagged: "3 pm, Jan 15, 2025",
    status: "Pending"
  },
  {
    id: 3,
    post: "Post Title",
    topic: "Health",
    reporter: "Jhon Doe",
    dateFlagged: "3 pm, Jan 15, 2025",
    status: "Pending"
  },
  {
    id: 4,
    post: "Post Title",
    topic: "Health",
    reporter: "Jhon Doe",
    dateFlagged: "3 pm, Jan 15, 2025",
    status: "Pending"
  },
  {
    id: 5,
    post: "Post Title",
    topic: "Health",
    reporter: "Jhon Doe",
    dateFlagged: "3 pm, Jan 15, 2025",
    status: "Pending"
  },
  {
    id: 6,
    post: "Post Title",
    topic: "Health",
    reporter: "Jhon Doe",
    dateFlagged: "3 pm, Jan 15, 2025",
    status: "Pending"
  }
];

const postTypes = ["All Post Types", "Dataset", "Discussion", "Question", "Announcement"];
const topics = ["All Topics", "Health", "Technology", "Science", "Business", "Education"];
const statuses = ["All Statuses", "Pending", "Reviewed", "Approved", "Rejected"];
const dateRanges = ["All Time", "Last 7 days", "Last 30 days", "Last 90 days", "Custom Range"];

export default function FlaggedContentsPage() {
  const [postType, setPostType] = useState("All Post Types");
  const [topic, setTopic] = useState("All Topics");
  const [status, setStatus] = useState("All Statuses");
  const [dateRange, setDateRange] = useState("All Time");

  const handleKeepPost = (id: number) => {
    console.log(`Keeping post ${id}`);
    // Handle keep post logic
  };

  const handleDeletePost = (id: number) => {
    console.log(`Deleting post ${id}`);
    // Handle delete post logic
  };

  const handleExport = () => {
    console.log("Exporting flagged contents");
    // Handle export logic
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flag className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-bold">Flagged Contents</h1>
        </div>
        <Button 
          onClick={handleExport}
          style={{ backgroundColor: "#2196F3", color: "white", border: "none" }}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter By</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Select value={postType} onValueChange={setPostType}>
              <SelectTrigger>
                <SelectValue placeholder="Post Type" />
              </SelectTrigger>
              <SelectContent>
                {postTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topicItem) => (
                  <SelectItem key={topicItem} value={topicItem}>
                    {topicItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((statusItem) => (
                  <SelectItem key={statusItem} value={statusItem}>
                    {statusItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Post</TableHead>
                  <TableHead className="font-semibold">Topic</TableHead>
                  <TableHead className="font-semibold">Reporter</TableHead>
                  <TableHead className="font-semibold">Date Flagged Time</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flaggedContents.map((content) => (
                  <TableRow key={content.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{content.post}</TableCell>
                    <TableCell>{content.topic}</TableCell>
                    <TableCell>{content.reporter}</TableCell>
                    <TableCell>{content.dateFlagged}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={content.status === "Pending" ? "secondary" : "default"}
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      >
                        {content.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleKeepPost(content.id)}
                          style={{ backgroundColor: "#2196F3", color: "white", border: "none" }}
                          className="text-xs px-3 py-1"
                        >
                          Keep post
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeletePost(content.id)}
                          style={{ backgroundColor: "#EBEBEB", color: "black", border: "none" }}
                          className="text-xs px-3 py-1"
                        >
                          Delete post
                        </Button>
                      </div>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination or Load More could be added here */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {flaggedContents.length} flagged contents
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}