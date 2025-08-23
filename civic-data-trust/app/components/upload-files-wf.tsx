"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Upload as UploadIcon, FileText } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useCommunity } from "./contexts/community-context"

interface UploadFilesWFProps {
  communityId?: string
}

export function UploadFilesWF({ communityId }: UploadFilesWFProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { communities } = useCommunity()
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [comments, setComments] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Get community ID from props or URL params
  const targetCommunityId = communityId || searchParams.get('communityId')
  
  // Find the community
  const community = communities.find(c => c.id.toString() === targetCommunityId)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    setSelectedFiles(prev => [...prev, ...files])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...files])
    }
  }

  const handleUpload = async () => {
    if (!title.trim()) {
      alert("Please enter a title")
      return
    }

    if (selectedFiles.length === 0) {
      alert("Please select at least one file")
      return
    }

    setIsUploading(true)
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, this would upload files to the server
      console.log("Uploading files:", selectedFiles)
      console.log("Title:", title)
      console.log("Tags:", tags)
      console.log("Comments:", comments)
      console.log("Community:", targetCommunityId)
      
      // Redirect back to community page with success message
      if (targetCommunityId) {
        router.push(`/community-member-wf/community-discovery-and-membership/community-details-wf/${targetCommunityId}?uploaded=success`)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveAsDraft = async () => {
    setIsUploading(true)
    
    try {
      // Simulate save as draft
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log("Saving as draft:", { title, tags, comments, files: selectedFiles })
      
      alert("Saved as draft successfully!")
    } catch (error) {
      console.error("Save as draft failed:", error)
      alert("Failed to save as draft. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Upload File/s</h1>
        {community && (
          <p className="text-sm text-muted-foreground mt-1">
            Uploading to: {community.name}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {/* File Upload Area */}
        <Card className="border border-border">
          <CardContent className="p-8">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <UploadIcon className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Drag and drop files here</p>
                  <p className="text-sm text-muted-foreground mt-1">or</p>
                </div>
                <Button variant="outline" asChild>
                  <label className="cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </Button>
              </div>
            </div>

            {/* File Type Information */}
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Supported Files: PNG, JPG, MOV, CSV, Html, Raw files (file size: 500 MB)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ☐ Check video tutorials to help properly upload complex data
              </p>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="mt-6 space-y-2">
                <h4 className="font-medium text-sm">Selected Files:</h4>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-xs h-6 px-2"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground text-right mt-1">
              {title.length}/50
            </div>
          </div>

          {/* Tags */}
          <div>
            <Input
              placeholder="Add Tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Additional Comments */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              ADDITIONAL COMMENT
            </label>
            <Textarea
              placeholder="Your remarks here"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right mt-1">
              {comments.length}/500
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleUpload}
            disabled={isUploading || !title.trim() || selectedFiles.length === 0}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveAsDraft}
            disabled={isUploading}
          >
            Save as Draft
          </Button>
        </div>
      </div>
    </div>
  )
}