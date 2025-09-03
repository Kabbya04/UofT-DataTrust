"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import { PlayCircle, AlertTriangle, Flag, Eye, MessageSquare, Edit3, Info, MoreHorizontal } from 'lucide-react';

const postsToReview = Array(3).fill(null).map((_, index) => ({
    id: index + 1,
    title: "Title",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    communityName: "Community Name",
    author: "John Doe",
    submittedAt: "2 hours ago"
}));

const rejectionReasons = [
    "Inappropriate content",
    "Spam or promotional content",
    "Misinformation or false claims",
    "Violates community guidelines",
    "Copyright infringement",
    "Low quality or irrelevant content",
    "Duplicate post",
    "Offensive language or harassment",
    "Privacy violation",
    "Other (please specify)"
];

const violationCategories = [
    { id: "content", label: "Content Guidelines" },
    { id: "community", label: "Community Rules" },
    { id: "legal", label: "Legal Issues" },
    { id: "quality", label: "Quality Standards" }
];

const changeRequestCategories = [
    "Content quality improvements needed",
    "Missing required information",
    "Formatting issues",
    "Inappropriate title or description",
    "Content needs fact-checking",
    "Image or media quality issues",
    "Community guidelines compliance",
    "Technical requirements not met",
    "Other (please specify)"
];

const suggestedChanges = [
    { id: "title", label: "Update title" },
    { id: "description", label: "Improve description" },
    { id: "content", label: "Revise content" },
    { id: "media", label: "Replace media files" },
    { id: "tags", label: "Add appropriate tags" },
    { id: "formatting", label: "Fix formatting" }
];

export default function PostReviewPage() {
    const [activeTab, setActiveTab] = useState('pending');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [selectedViolations, setSelectedViolations] = useState<string[]>([]);
    const [notifyAuthor, setNotifyAuthor] = useState(true);
    const [allowResubmission, setAllowResubmission] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Request Changes Modal State
    const [changeRequestReason, setChangeRequestReason] = useState('');
    const [changeRequestMessage, setChangeRequestMessage] = useState('');
    const [selectedChanges, setSelectedChanges] = useState<string[]>([]);
    const [setDeadline, setSetDeadline] = useState(true);
    const [deadlineDays, setDeadlineDays] = useState('7');
    const [notifyAuthorChanges, setNotifyAuthorChanges] = useState(true);

    const handleReject = (post: any) => {
        setSelectedPost(post);
        setShowRejectModal(true);
        setRejectionReason('');
        setCustomMessage('');
        setSelectedViolations([]);
        setNotifyAuthor(true);
        setAllowResubmission(true);
    };

    const handleRequestChanges = (post: any) => {
        setSelectedPost(post);
        setShowRequestChangesModal(true);
        setChangeRequestReason('');
        setChangeRequestMessage('');
        setSelectedChanges([]);
        setSetDeadline(true);
        setDeadlineDays('7');
        setNotifyAuthorChanges(true);
    };

    const handleConfirmReject = async () => {
        if (!rejectionReason) return;
        
        setIsProcessing(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Rejecting post:', {
            postId: selectedPost.id,
            reason: rejectionReason,
            message: customMessage,
            violations: selectedViolations,
            notifyAuthor,
            allowResubmission
        });
        
        setIsProcessing(false);
        setShowRejectModal(false);
        setSelectedPost(null);
    };

    const handleConfirmRequestChanges = async () => {
        if (!changeRequestReason || !changeRequestMessage.trim()) return;
        
        setIsProcessing(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Requesting changes for post:', {
            postId: selectedPost.id,
            reason: changeRequestReason,
            message: changeRequestMessage,
            suggestedChanges: selectedChanges,
            deadline: setDeadline ? deadlineDays : null,
            notifyAuthor: notifyAuthorChanges
        });
        
        setIsProcessing(false);
        setShowRequestChangesModal(false);
        setSelectedPost(null);
    };

    const handleApprove = async (post: any) => {
        console.log('Approving post:', post.id);
        // Handle approval logic here
    };

    const handleViolationToggle = (violationId: string) => {
        setSelectedViolations(prev => 
            prev.includes(violationId)
                ? prev.filter(id => id !== violationId)
                : [...prev, violationId]
        );
    };

    const handleChangesToggle = (changeId: string) => {
        setSelectedChanges(prev => 
            prev.includes(changeId)
                ? prev.filter(id => id !== changeId)
                : [...prev, changeId]
        );
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Post Review (320)</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">ALL</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="pt-6">
                    <div className="grid gird-cols-2">
                        {postsToReview.map((post, index) => (
                            <Card key={index} className="overflow-hidden">
                                <CardContent className="p-0">
                                    {/* Video/Media Section */}
                                    <div className="relative bg-muted h-48 flex items-center justify-center">
                                        <PlayCircle className="h-16 w-16 "/>
                                        
                                        {/* Action Buttons Overlay */}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <Button 
                                                size="sm" 
                                                onClick={() => handleApprove(post)}
                                                className="bg-green-600 hover:bg-green-700 focus:ring-green-500 hover:cursor-pointer"
                                            >
                                                Approve
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                onClick={() => handleReject(post)}
                                                className=" bg-red-600 hover:bg-red-700 focus:ring-red-500 hover:cursor-pointer"
                                            >
                                                Reject
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                onClick={() => handleRequestChanges(post)}
                                                className=" bg-primary hover:bg-primary-700 focus:ring-primary-500 hover:cursor-pointer"
                                            >
                                                Request changes
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {/* Content Section */}
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg">{post.title}</h3>
                                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <span className="text-sm text-muted-foreground">{post.communityName}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {post.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Request Changes Modal */}
            <Dialog open={showRequestChangesModal} onOpenChange={setShowRequestChangesModal}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <Edit3 className="h-5 w-5 text-orange-600" />
                            <span>Request Changes</span>
                        </DialogTitle>
                        <DialogDescription>
                            Request specific changes to &quot;<strong>{selectedPost?.title}</strong>&quot; by {selectedPost?.author}. 
                            The author will be notified and can resubmit after making the requested modifications.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Post Preview */}
                        <div className="p-4 bg-muted/50 rounded-lg border">
                            <div className="flex items-center gap-3 mb-2">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Post Preview</span>
                            </div>
                            <h4 className="font-medium">{selectedPost?.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{selectedPost?.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {selectedPost?.communityName} • By {selectedPost?.author} • {selectedPost?.submittedAt}
                            </p>
                        </div>

                        {/* Change Request Category */}
                        <div className="space-y-2">
                            <Label htmlFor="changeReason" className="text-sm font-medium">
                                Primary reason for requesting changes *
                            </Label>
                            <Select value={changeRequestReason} onValueChange={setChangeRequestReason}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a reason for requesting changes" />
                                </SelectTrigger>
                                <SelectContent>
                                    {changeRequestCategories.map((reason) => (
                                        <SelectItem key={reason} value={reason}>
                                            {reason}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Suggested Changes */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Specific areas to improve (optional)
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                {suggestedChanges.map((change) => (
                                    <div key={change.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={change.id}
                                            checked={selectedChanges.includes(change.id)}
                                            onCheckedChange={() => handleChangesToggle(change.id)}
                                        />
                                        <Label 
                                            htmlFor={change.id} 
                                            className="text-sm cursor-pointer"
                                        >
                                            {change.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detailed Feedback */}
                        <div className="space-y-2">
                            <Label htmlFor="changeMessage" className="text-sm font-medium">
                                Detailed feedback and suggestions *
                            </Label>
                            <Textarea
                                id="changeMessage"
                                placeholder="Provide specific feedback on what needs to be changed and how to improve the post..."
                                value={changeRequestMessage}
                                onChange={(e) => setChangeRequestMessage(e.target.value)}
                                className="min-h-[120px] resize-none"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Be specific about what changes are needed to help the author improve their post effectively.
                            </p>
                        </div>

                        {/* Deadline Settings */}
                        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                Revision Settings
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="deadline"
                                        checked={setDeadline}
                                        onCheckedChange={(checked) => {
                                            if (typeof checked === 'boolean') {
                                                setSetDeadline(checked);
                                            }
                                        }}
                                    />
                                    <Label htmlFor="deadline" className="text-sm cursor-pointer">
                                        Set deadline for revisions
                                    </Label>
                                </div>
                                
                                {setDeadline && (
                                    <div className="ml-6 space-y-2">
                                        <Label className="text-sm">Deadline (days from now)</Label>
                                        <Select value={deadlineDays} onValueChange={setDeadlineDays}>
                                            <SelectTrigger className="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="3">3 days</SelectItem>
                                                <SelectItem value="7">7 days</SelectItem>
                                                <SelectItem value="14">14 days</SelectItem>
                                                <SelectItem value="30">30 days</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="notifyChanges"
                                        checked={notifyAuthorChanges}
                                        onCheckedChange={(checked) => {
                                            if (typeof checked === 'boolean') {
                                                setNotifyAuthorChanges(checked);
                                            }
                                        }}
                                    />
                                    <Label htmlFor="notifyChanges" className="text-sm cursor-pointer">
                                        Send notification email to author
                                    </Label>
                                    </div>
                            </div>
                        </div>

                        {/* Information Notice */}
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-start space-x-2">
                                <Info className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-orange-800 mb-1">Change Request Process</p>
                                    <p className="text-orange-700">
                                        The author will receive your feedback and can make the requested changes. 
                                        The post will return to the review queue once resubmitted.
                                        {setDeadline && ` They have ${deadlineDays} days to make the changes.`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setShowRequestChangesModal(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="default"
                            onClick={handleConfirmRequestChanges}
                            disabled={
                                isProcessing || 
                                !changeRequestReason || 
                                !changeRequestMessage.trim() ||
                                (changeRequestReason === "Other (please specify)" && !changeRequestMessage.trim())
                            }
                            className="min-w-[140px] bg-orange-600 hover:bg-orange-700"
                        >
                            {isProcessing ? (
                                <div className="flex items-center space-x-2">
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Sending...</span>
                                </div>
                            ) : (
                                'Request Changes'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rejection Modal */}
            <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <Flag className="h-5 w-5 text-destructive" />
                            <span>Reject Post</span>
                        </DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting &quot;<strong>{selectedPost?.title}</strong>&quot; by {selectedPost?.author}. 
                            This information will help improve content quality.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Post Preview */}
                        <div className="p-4 bg-muted/50 rounded-lg border">
                            <div className="flex items-center gap-3 mb-2">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Post Preview</span>
                            </div>
                            <h4 className="font-medium">{selectedPost?.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{selectedPost?.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {selectedPost?.communityName} • By {selectedPost?.author} • {selectedPost?.submittedAt}
                            </p>
                        </div>

                        {/* Reason Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-sm font-medium">
                                Primary reason for rejection *
                            </Label>
                            <Select value={rejectionReason} onValueChange={setRejectionReason}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a rejection reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    {rejectionReasons.map((reason) => (
                                        <SelectItem key={reason} value={reason}>
                                            {reason}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Violation Categories */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Violation categories (optional)
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                {violationCategories.map((violation) => (
                                    <div key={violation.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={violation.id}
                                            checked={selectedViolations.includes(violation.id)}
                                            onCheckedChange={() => handleViolationToggle(violation.id)}
                                        />
                                        <Label 
                                            htmlFor={violation.id} 
                                            className="text-sm cursor-pointer"
                                        >
                                            {violation.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Custom Message */}
                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-sm font-medium">
                                Message to author {rejectionReason === "Other (please specify)" ? "*" : "(optional)"}
                            </Label>
                            <Textarea
                                id="message"
                                placeholder={
                                    rejectionReason === "Other (please specify)" 
                                        ? "Please specify the reason for rejection..."
                                        : "Provide specific feedback or suggestions for improvement..."
                                }
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                className="min-h-[100px] resize-none"
                                required={rejectionReason === "Other (please specify)"}
                            />
                            <p className="text-xs text-muted-foreground">
                                This message will be included in the notification to help the author understand the decision.
                            </p>
                        </div>

                        {/* Action Options */}
                        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Notification Options
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="notify"
                                        checked={notifyAuthor}
                                       onCheckedChange={(checked) => {
                                            if (typeof checked === 'boolean') {
                                                setNotifyAuthor(checked);
                                            }
                                        }}
                                    />
                                    <Label htmlFor="notify" className="text-sm cursor-pointer">
                                        Send notification email to author
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="resubmit"
                                        checked={allowResubmission}
                                        onCheckedChange={(checked) => {
                                            if (typeof checked === 'boolean') {
                                                setAllowResubmission(checked);
                                            }
                                        }}
                                    />
                                    <Label htmlFor="resubmit" className="text-sm cursor-pointer">
                                        Allow author to edit and resubmit this post
                                    </Label>
                                </div>
                            </div>
                        </div>

                        {/* Warning Notice */}
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <div className="flex items-start space-x-2">
                                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-destructive mb-1">Important Notice</p>
                                    <p className="text-muted-foreground">
                                        Rejecting this post will remove it from the review queue. 
                                        {allowResubmission ? " The author will be able to edit and resubmit if enabled above." : " The author will not be able to resubmit this post."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setShowRejectModal(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive"
                            onClick={handleConfirmReject}
                            disabled={
                                isProcessing || 
                                !rejectionReason || 
                                (rejectionReason === "Other (please specify)" && !customMessage.trim())
                            }
                            className="min-w-[120px]"
                        >
                            {isProcessing ? (
                                <div className="flex items-center space-x-2">
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Rejecting...</span>
                                </div>
                            ) : (
                                'Reject Post'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}