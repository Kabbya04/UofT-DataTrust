"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Progress } from "@/app/components/ui/progress";
import { Upload, FileText, X, Eye, EyeOff, FolderSearch, HelpCircle, Image as LucideImage, VideoIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DATASET_TAGS, DatasetTag } from "@/app/constants/dataset-tags";
// Helper to format file size
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const Stepper = ({ step }: { step: number }) => {
    const steps = ["Select files", "Pre-processing", "Automatic classification"];
    return (
        <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-8">
            {steps.map((label, index) => (
                <div key={index} className="flex items-center flex-1 last:flex-initial">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors",
                        index + 1 === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                        index + 1 < step && "bg-primary/50 text-primary-foreground"
                    )}>
                        {index + 1}
                    </div>
                    <span className={cn("ml-2 font-medium", index + 1 === step ? "text-foreground" : "text-muted-foreground")}>{label}</span>
                    {index < steps.length - 1 && <div className="flex-1 h-0.5 bg-border mx-4"></div>}
                </div>
            ))}
        </div>
    );
};

export default function UploadDatasetPage() {
    const [selectedTags, setSelectedTags] = useState<DatasetTag[]>([]);
    const router = useRouter();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [showSecretKey, setShowSecretKey] = useState(false);
    const [activeS3Source, setActiveS3Source] = useState('AWS S3');
    const [searchTags, setSearchTags] = useState("");
    const handleTagToggle = (tag: DatasetTag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : prev.length < 5 ? [...prev, tag] : prev // Max 5 tags
        );
    };

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
        }
    };
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setSelectedFiles(prev => [...prev, ...Array.from(files)]);
        }
    };
    const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setThumbnailFile(file);
        }
    };
    const removeFile = (indexToRemove: number) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };
    const removeThumbnail = () => {
        setThumbnailFile(null);
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload Data</TabsTrigger>
                    <TabsTrigger value="s3">Add S3 Bucket</TabsTrigger>
                </TabsList>

                {/* TAB 1: UPLOAD DATA FROM LOCAL */}
                <TabsContent value="upload" className="mt-6">
                    <Card>
                        <CardHeader><CardTitle>Upload Your Dataset</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={cn(
                                    "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
                                    isDragOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                                )}
                            >
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4 text-muted-foreground">
                                    <Upload className="h-12 w-12" />
                                    <p className="text-lg font-medium text-foreground">Drag and drop files here</p>
                                    <h2 className="text-lg font-medium text-foreground">Or</h2>
                                    <Button size="sm" className=" bg-green-500 hover:bg-green-700 text-white cursor-pointer">Browse Files</Button>
                                    <p>Supported Files: PNG,JPG,MOV etc. Max file size 500 MB</p>
                                    <div className="flex items-center gap-1 hover:underline"> <VideoIcon></VideoIcon> <p>Check video tutorial to how properly upload complex data</p></div>
                                    <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileSelect} />
                                </label>
                            </div>

                            {selectedFiles.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-2">Selected Files:</h4>
                                    <div className="space-y-2">
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                                <div className="flex items-center gap-2"><FileText className="h-5 w-5" /><span className="text-sm font-medium">{file.name}</span><span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span></div>
                                                <Button variant="ghost" size="sm" onClick={() => removeFile(index)}><X className="h-4 w-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ...JSX with tag selection... */}
                            <div>
                                <Label>Dataset Tags</Label>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Select relevant tags to categorize your dataset (max 5 tags)
                                </p>
                                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                                    <div className="px-3 pb-2">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchTags}
                                            onChange={(e) => setSearchTags(e.target.value)}
                                            className="w-full px-2 py-1 text-sm border border-border rounded-md bg-background"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {DATASET_TAGS.map((tag) => (
                                            <label
                                                key={tag}
                                                className={cn(
                                                    "flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors",
                                                    selectedTags.includes(tag)
                                                        ? "bg-primary/10 border border-primary"
                                                        : "hover:bg-muted border border-transparent"
                                                )}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTags.includes(tag)}
                                                    onChange={() => handleTagToggle(tag)}
                                                    disabled={!selectedTags.includes(tag) && selectedTags.length >= 5}
                                                    className="hidden"
                                                />
                                                <span className="text-sm">{tag}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div><Label htmlFor="dataset-name">Name</Label><Input id="dataset-name" placeholder="E.g., Quarterly Sales Figures" /></div>
                                <div><Label htmlFor="dataset-description">Description (Optional)</Label><Textarea id="dataset-description" placeholder="A brief description of what this dataset contains." /></div>
                                <div><Label htmlFor="dataset-type">Dataset Type</Label><Select><SelectTrigger id="dataset-type"><SelectValue placeholder="Select a type..." /></SelectTrigger><SelectContent><SelectItem value="image">Image</SelectItem><SelectItem value="video">Video</SelectItem><SelectItem value="tabular">Tabular (CSV, Excel)</SelectItem><SelectItem value="text">Text</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>

                                {/* New Thumbnail Upload Section */}
                                <div>
                                    <Label htmlFor="thumbnail-upload">Upload Thumbnail (Optional)</Label>
                                    <div className="mt-2">
                                        {thumbnailFile ? (
                                            <div className="flex items-center gap-4">
                                                <Image
                                                    src={URL.createObjectURL(thumbnailFile)}
                                                    alt="Thumbnail preview"
                                                    width={80}
                                                    height={80}
                                                    className="h-20 w-20 object-cover rounded-md border"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        {thumbnailFile.name}

                                                    </p>
                                                    <p className="text-xs text-muted-foreground">({formatFileSize(thumbnailFile.size)})</p>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={removeThumbnail}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <LucideImage className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                <label htmlFor="thumbnail-upload" className="cursor-pointer">
                                                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                                                        <Image
                                                            src="/placeholder-thumbnail.png"
                                                            alt="Thumbnail placeholder"
                                                            width={32}
                                                            height={32}
                                                            className="h-8 w-8 mx-auto mb-2 text-muted-foreground"
                                                        />
                                                        <p className="text-sm text-muted-foreground">Click to upload thumbnail image</p>
                                                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                                                    </div>
                                                    <input
                                                        id="thumbnail-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleThumbnailSelect}
                                                    />
                                                </label>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-start gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button className="bg-primary hover:bg-primary/90">Upload</Button>
                                <Button variant="outline" className="border border-primary hover:bg-primary/90 text-primary">Save as draft</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 2: ADD S3 BUCKET (MODIFIED) */}
                <TabsContent value="s3" className="mt-6">
                    <Card>
                        <CardContent className="p-8">
                            <div className="flex justify-end mb-4"><Button variant="ghost" size="icon"><X /></Button></div>
                            <h3 className="text-xl font-semibold text-center mb-4">Upload files</h3>
                            <Stepper step={1} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                {/* Left Form Column */}
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <Label>Storage</Label>
                                            <div>
                                                {/* Color changed to primary (orange) */}
                                                <span className="text-primary font-medium">Used: 1.28</span>
                                                <span className="text-muted-foreground"> / Remaining: 28</span>
                                            </div>
                                        </div>
                                        <Progress value={(1.28 / 29.28) * 100} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><Label htmlFor="aws-id">AWS secret ID</Label><Input id="aws-id" /></div>
                                        <div className="relative"><Label htmlFor="aws-key">AWS secret key</Label><Input id="aws-key" type={showSecretKey ? "text" : "password"} className="pr-10" /><Button variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7" onClick={() => setShowSecretKey(!showSecretKey)}>{showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><Label htmlFor="aws-region">Select Region</Label><Select><SelectTrigger id="aws-region"><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="us-east-1">US East (N. Virginia)</SelectItem><SelectItem value="us-west-2">US West (Oregon)</SelectItem></SelectContent></Select></div>
                                        <div><Label htmlFor="aws-bucket">S3 bucket address</Label><Input id="aws-bucket" /></div>
                                    </div>
                                    <div><Label htmlFor="aws-path">Path (optional)</Label><Input id="aws-path" /></div>
                                    <a href="#" className="flex items-center gap-2 text-sm text-primary hover:underline"><HelpCircle className="h-4 w-4" />How to create AWS S3 bucket access key?</a>
                                    <Button variant="outline" className="w-full">Connect to AWS</Button>
                                </div>
                                {/* Right Placeholder Column */}
                                <div className="bg-muted h-96 rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                                    <FolderSearch className="h-24 w-24 opacity-50" />
                                    <p className="mt-4 font-medium">Here will be files and folders</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-8">
                                <Button variant="outline">Cancel</Button>
                                <Button disabled>Next Step</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}