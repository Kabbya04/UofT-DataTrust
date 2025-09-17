"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Play, PlayCircle, Clock, BookOpen, Video, ChevronRight, Download, ExternalLink } from "lucide-react";

const tutorialVideos = [
    {
        id: 1,
        title: "Platform Overview",
        description: "Get familiar with the research platform interface and main features",
        duration: "5:30",
        thumbnail: "/api/placeholder/400/225",
        isCompleted: false,
        category: "Basics"
    },
    {
        id: 2,
        title: "Uploading Your First Dataset",
        description: "Learn how to upload, organize, and archive your research data",
        duration: "8:15",
        thumbnail: "/api/placeholder/400/225",
        isCompleted: false,
        category: "Data Management"
    },
    {
        id: 3,
        title: "Creating Research Projects",
        description: "Step-by-step guide to creating and configuring research projects",
        duration: "12:45",
        thumbnail: "/api/placeholder/400/225",
        isCompleted: false,
        category: "Projects"
    },
    {
        id: 4,
        title: "Working with Plugins",
        description: "Understanding and utilizing research plugins for data analysis",
        duration: "15:20",
        thumbnail: "/api/placeholder/400/225",
        isCompleted: false,
        category: "Advanced"
    }
];

const quickStartGuides = [
    {
        title: "5-Minute Quick Start",
        description: "Essential steps to get up and running immediately",
        icon: PlayCircle,
        action: "Start Guide"
    },
    {
        title: "Platform Documentation",
        description: "Comprehensive guide covering all platform features",
        icon: BookOpen,
        action: "Read Docs"
    },
    {
        title: "Sample Projects",
        description: "Download example projects to explore platform capabilities",
        icon: Download,
        action: "Download"
    }
];

export default function GetStartedPage() {
    const [selectedVideo, setSelectedVideo] = useState(tutorialVideos[0]);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleVideoSelect = (video: typeof tutorialVideos[0]) => {
        setSelectedVideo(video);
        setIsPlaying(false);
    };

    const handlePlayVideo = () => {
        setIsPlaying(true);
        // In a real implementation, this would start the video
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">How to get started</h1>
                <p className="text-muted-foreground">
                    Learn how to use the research platform effectively with our guided tutorials and resources
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Video Player */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardContent className="p-0">
                            <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                                {!isPlaying ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                        <Button
                                            size="lg"
                                            onClick={handlePlayVideo}
                                            className="bg-white/90 hover:bg-white text-gray-800 shadow-lg"
                                        >
                                            <Play className="h-6 w-6 mr-2" />
                                            Play Video
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                                        <div className="text-white text-center">
                                            <Video className="h-12 w-12 mx-auto mb-4" />
                                            <p>Video Player Placeholder</p>
                                            <p className="text-sm text-gray-300 mt-2">
                                                {selectedVideo.title} - {selectedVideo.duration}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">{selectedVideo.title}</h2>
                                        <p className="text-muted-foreground">{selectedVideo.description}</p>
                                    </div>
                                    <Badge variant="secondary" className="ml-4">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {selectedVideo.duration}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Badge variant="outline">{selectedVideo.category}</Badge>
                                    <Button variant="ghost" size="sm">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Open in New Tab
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Progress Section */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Your Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium">Tutorial Completion</span>
                                <span className="text-sm text-muted-foreground">0 of {tutorialVideos.length} completed</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mb-4">
                                <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h4 className="font-medium mb-2">Next Steps</h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Complete the platform overview to understand the basics
                                    </p>
                                    <Button size="sm" variant="outline" style={{ backgroundColor: "#2196F3", color: "white", border: "none" }}>
                                        Continue Learning
                                    </Button>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h4 className="font-medium mb-2">Need Help?</h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Contact our support team for personalized assistance
                                    </p>
                                    <Button size="sm" variant="outline" style={{ backgroundColor: "#CCCCCC", color: "black", border: "none" }}>
                                        Get Support
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Video Playlist */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Tutorial Videos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {tutorialVideos.map((video) => (
                                <div
                                    key={video.id}
                                    onClick={() => handleVideoSelect(video)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${selectedVideo.id === video.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="relative">
                                            <div className="w-16 h-10 bg-muted rounded overflow-hidden flex items-center justify-center">
                                                <Play className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            {video.isCompleted && (
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm mb-1 line-clamp-1">{video.title}</h4>
                                            <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                                                {video.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <Badge variant="outline" className="text-xs">{video.category}</Badge>
                                                <span className="text-xs text-muted-foreground">{video.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Start Guides */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Start</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {quickStartGuides.map((guide, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
                                >
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <guide.icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm mb-1">{guide.title}</h4>
                                        <p className="text-xs text-muted-foreground">{guide.description}</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>


        </div>
    );
}