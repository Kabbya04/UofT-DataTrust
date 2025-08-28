"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation";
import { Upload as UploadIcon, FileText } from "lucide-react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { useCommunity } from "@/app/components/contexts/community-context"

function UploadFilesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { communities } = useCommunity()
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [comments, setComments] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const targetCommunityId = searchParams.get('communityId')
  const community = communities.find(c => c.id.toString() === targetCommunityId)

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false) }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false)
    setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)])
  }
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])
  }
  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove))
  }
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'; const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleUpload = async () => {
    if (!title.trim() || selectedFiles.length === 0) return alert("Title and at least one file are required.");
    setIsUploading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push(targetCommunityId ? `/community-member-wf/community-details/${targetCommunityId}?uploaded=success` : '/community-member-wf/my-communities');
    } catch (error) { console.error("Upload failed:", error); alert("Upload failed.") } finally { setIsUploading(false) }
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Upload File/s</h1>
        {community && <p className="text-sm text-muted-foreground mt-1">Uploading to: {community.name}</p>}
      </div>
      <div className="space-y-6">
        <Card className="border border-border">
          <CardContent className="p-8">
            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <div className="flex flex-col items-center gap-4"><UploadIcon className="h-12 w-12 text-muted-foreground" /><div><p className="text-lg font-medium">Drag and drop files here</p><p className="text-sm text-muted-foreground mt-1">or</p></div><Button variant="outline" asChild><label className="cursor-pointer">Browse Files<input type="file" multiple className="hidden" onChange={handleFileSelect} /></label></Button></div>
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-6 space-y-2">
                <h4 className="font-medium text-sm">Selected Files:</h4>
                {selectedFiles.map((file, index) => (<div key={index} className="flex items-center justify-between p-2 bg-muted rounded"><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{file.name}</span><span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span></div><Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="text-xs h-6 px-2">Remove</Button></div>))}
              </div>
            )}
          </CardContent>
        </Card>
        <div className="space-y-4">
          <div><Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /><div className="text-xs text-muted-foreground text-right mt-1">{title.length}/50</div></div>
          <div><Input placeholder="Add Tags" value={tags} onChange={(e) => setTags(e.target.value)} /></div>
          <div><label className="text-sm font-medium text-foreground mb-2 block">ADDITIONAL COMMENT</label><Textarea placeholder="Your remarks here" value={comments} onChange={(e) => setComments(e.target.value)} className="min-h-[100px] resize-none" maxLength={500} /><div className="text-xs text-muted-foreground text-right mt-1">{comments.length}/500</div></div>
        </div>
        <div className="flex gap-3 pt-4">
          <Button onClick={handleUpload} disabled={isUploading || !title.trim() || selectedFiles.length === 0} className="bg-foreground text-background hover:bg-foreground/90">{isUploading ? "Uploading..." : "Upload"}</Button>
          <Button variant="outline" disabled={isUploading}>Save as Draft</Button>
        </div>
      </div>
    </div>
  )
}

export default function UploadFilesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UploadFilesContent />
        </Suspense>
    )
}