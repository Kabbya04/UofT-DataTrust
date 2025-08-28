"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Upload, FileText, ImageIcon, Music, Video, Database, Code, Archive, Users } from "lucide-react"

const categoryFormats = {
  images: {
    icon: ImageIcon,
    formats: ["JPEG", "PNG", "GIF", "BMP", "TIFF", "SVG", "WebP"],
    description: "Supported image formats for visual data analysis",
  },
  audio: {
    icon: Music,
    formats: ["MP3", "WAV", "FLAC", "AAC", "OGG", "M4A"],
    description: "Audio files for sound analysis and processing",
  },
  videos: {
    icon: Video,
    formats: ["MP4", "AVI", "MOV", "WMV", "FLV", "MKV", "WebM"],
    description: "Video files for motion and visual content analysis",
  },
  documents: {
    icon: FileText,
    formats: ["PDF", "DOC", "DOCX", "TXT", "RTF", "ODT"],
    description: "Text documents for natural language processing",
  },
  structured: {
    icon: Database,
    formats: ["CSV", "JSON", "XML", "XLSX", "SQL", "Parquet"],
    description: "Structured data for statistical analysis",
  },
  code: {
    icon: Code,
    formats: ["PY", "JS", "TS", "JAVA", "CPP", "R", "IPYNB"],
    description: "Source code files for code analysis",
  },
  archives: {
    icon: Archive,
    formats: ["ZIP", "RAR", "TAR", "GZ", "7Z"],
    description: "Compressed archives containing multiple files",
  },
}

const communities = [
  { id: "1", name: "Tech Innovators", members: 1250, category: "Technology" },
  { id: "2", name: "Data Scientists", members: 890, category: "Data Science" },
  { id: "3", name: "Creative Writers", members: 567, category: "Literature" },
  { id: "4", name: "Urban Gardening", members: 423, category: "Environment" },
  { id: "5", name: "Blockchain Developers", members: 789, category: "Cryptocurrency" },
  { id: "6", name: "Sustainable Living", members: 1100, category: "Lifestyle" },
]

export default function UploadDataSetPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [attachLater, setAttachLater] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Dataset upload form submitted:", formData)
    // Handle form submission here
    setIsOpen(false)
    setFormData({ name: "", description: "", category: "" })
  }

  const handleAttachLaterToggle = () => {
    setAttachLater(!attachLater)
    if (!attachLater) {
      setFormData((prev) => ({ ...prev, community: "" }))
    }
  }

  const selectedCategory = formData.category as keyof typeof categoryFormats
  const CategoryIcon = selectedCategory ? categoryFormats[selectedCategory]?.icon : Upload
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Dataset</h1>
          <p className="text-muted-foreground mt-2">Upload and manage your datasets for analysis and processing</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Ready to Upload Your Dataset?</CardTitle>
            <CardDescription>
              Click the button below to start uploading your dataset with detailed information
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full max-w-sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Dataset
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload New Dataset
                  </DialogTitle>
                  <DialogDescription>
                    Provide information about your dataset to help with organization and analysis
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Dataset Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter dataset name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your dataset, its purpose, and contents"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select dataset category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoryFormats).map(([key, { icon: Icon }]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedCategory && (
                      <Card className="bg-muted/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <CategoryIcon className="w-4 h-4" />
                            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Format Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground mb-3">
                            {categoryFormats[selectedCategory].description}
                          </p>
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Supported Formats:</Label>
                            <div className="flex flex-wrap gap-1">
                              {categoryFormats[selectedCategory].formats.map((format) => (
                                <span
                                  key={format}
                                  className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                                >
                                  {format}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="community" >Attach to Community (Optional)</Label>
                      <div className="flex items-center gap-2 mb-2">
                        <Button
                          type="button"
                          variant={attachLater ? "default" : "outline"}
                          size="sm"
                          onClick={handleAttachLaterToggle}
                          className={attachLater ? "bg-primary text-primary-foreground" : ""}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Attach Later
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          {attachLater ? "You can attach to a community later" : "Toggle to attach later"}
                        </span>
                      </div>
                      <Select
                        // value={formData.community}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, community: value }))}
                        disabled={attachLater}
                      >
                        <SelectTrigger className={attachLater ? "opacity-50 cursor-not-allowed" : ""}>
                          <SelectValue placeholder={attachLater ? "Attach Later selected" : "Select a community"} />
                        </SelectTrigger>
                        <SelectContent>
                          {communities.map((community) => (
                            <SelectItem key={community.id} value={community.id}>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <div className="flex flex-col items-start">
                                  <span>{community.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {community.members} members • {community.category}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {attachLater
                          ? "You've chosen to attach this dataset to a community later."
                          : "Choose a community to share your dataset with, or click 'Attach Later' to decide later."}
                      </p>
                    </div>


                  </div>

                  <div className="flex items-center justify-between gap-3">

                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Dataset
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-5 h-5" />
              Recent Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No datasets uploaded yet. Start by uploading your first dataset.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used</span>
                <span>0 GB / 100 GB</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Datasets</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Categories</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Upload</span>
                <span className="font-medium">Never</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}