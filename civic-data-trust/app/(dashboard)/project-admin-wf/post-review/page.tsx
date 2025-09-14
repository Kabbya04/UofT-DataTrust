"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import { PlayCircle, AlertTriangle, Flag, Eye, MessageSquare, Edit3, Info, MoreHorizontal, Loader2 } from 'lucide-react';

// Types for API responses - Updated to match new backend structure
interface Community {
  id: string;
  name: string;
  logo: string | null;
  description: string;
  community_category: {
    id: string;
    name: string;
    disable: boolean;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  status: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}

interface CommunityPost {
  id: string;
  community_id: string;
  user_id: string;
  file_url: string;
  title: string;
  description: string;
  dataset_id: string;
  created_at: string;
  updated_at: string;
}

interface CommunityPostRequest {
  id: string;
  community_id: string;
  user_id: string;
  post_id: string;
  message: string | null;
  reason: string | null;
  admin_message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  // Nested objects from API response
  community: Community;
  user: User;
  post: CommunityPost;
}

// No need for PostRequestWithContent since data comes nested
type PostRequestWithContent = CommunityPostRequest;

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
    const [selectedPost, setSelectedPost] = useState<PostRequestWithContent | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [selectedViolations, setSelectedViolations] = useState<string[]>([]);
    const [notifyAuthor, setNotifyAuthor] = useState(true);
    const [allowResubmission, setAllowResubmission] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Real data state
    const [postRequests, setPostRequests] = useState<PostRequestWithContent[]>([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(false);
    const [requestsError, setRequestsError] = useState<string | null>(null);

    // Request Changes Modal State
    const [changeRequestReason, setChangeRequestReason] = useState('');
    const [changeRequestMessage, setChangeRequestMessage] = useState('');
    const [selectedChanges, setSelectedChanges] = useState<string[]>([]);
    const [setDeadline, setSetDeadline] = useState(true);
    const [deadlineDays, setDeadlineDays] = useState('7');
    const [notifyAuthorChanges, setNotifyAuthorChanges] = useState(true);

    // Fetch post requests and their content
    useEffect(() => {
        const fetchPostRequests = async () => {
            setIsLoadingRequests(true);
            setRequestsError(null);

            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                // Fetch all post requests
                const requestsResponse = await fetch('/api/community-post-request/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (!requestsResponse.ok) {
                    const errorData = await requestsResponse.json();
                    throw new Error(errorData.error || 'Failed to fetch post requests');
                }

                const requestsResult = await requestsResponse.json();
                console.log('Post requests API response:', requestsResult);

                // The API now returns complete data with nested post, community, and user objects
                const requests: CommunityPostRequest[] = requestsResult.data || requestsResult || [];

                console.log('Processed post requests:', requests);
                setPostRequests(requests);
            } catch (error) {
                console.error('Error fetching post requests:', error);
                setRequestsError(error instanceof Error ? error.message : 'Failed to load post requests');
            } finally {
                setIsLoadingRequests(false);
            }
        };

        fetchPostRequests();
    }, []);

    // Filter posts based on active tab
    const filteredPosts = postRequests.filter(request => {
        if (activeTab === 'all') return true;
        return request.status === activeTab;
    });

    const handleReject = (post: PostRequestWithContent) => {
        setSelectedPost(post);
        setShowRejectModal(true);
        setRejectionReason('');
        setCustomMessage('');
        setSelectedViolations([]);
        setNotifyAuthor(true);
        setAllowResubmission(true);
    };

    const handleRequestChanges = (post: PostRequestWithContent) => {
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
        if (!rejectionReason || !selectedPost) return;

        setIsProcessing(true);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const rejectData = {
                request_id: selectedPost.id,
                reason: rejectionReason,
                admin_message: customMessage || undefined
            };

            const response = await fetch('/api/community-post-request/reject', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(rejectData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to reject post');
            }

            // Update local state
            setPostRequests(prev =>
                prev.map(request =>
                    request.id === selectedPost.id
                        ? { ...request, status: 'rejected' as const, admin_message: customMessage }
                        : request
                )
            );

            console.log('Post rejected successfully');
        } catch (error) {
            console.error('Error rejecting post:', error);
            alert(error instanceof Error ? error.message : 'Failed to reject post');
        } finally {
            setIsProcessing(false);
            setShowRejectModal(false);
            setSelectedPost(null);
        }
    };

    const handleConfirmRequestChanges = async () => {
        if (!changeRequestReason || !changeRequestMessage.trim() || !selectedPost) return;

        setIsProcessing(true);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const changeData = {
                request_id: selectedPost.id,
                reason: changeRequestReason,
                admin_message: changeRequestMessage
            };

            const response = await fetch('/api/community-post-request/request-change', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(changeData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to request changes');
            }

            // Update local state
            setPostRequests(prev =>
                prev.map(request =>
                    request.id === selectedPost.id
                        ? {
                            ...request,
                            status: 'pending' as const,
                            admin_message: changeRequestMessage,
                            reason: changeRequestReason
                        }
                        : request
                )
            );

            console.log('Changes requested successfully');
        } catch (error) {
            console.error('Error requesting changes:', error);
            alert(error instanceof Error ? error.message : 'Failed to request changes');
        } finally {
            setIsProcessing(false);
            setShowRequestChangesModal(false);
            setSelectedPost(null);
        }
    };

    const handleApprove = async (post: PostRequestWithContent) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const approveData = {
                request_id: post.id
            };

            const response = await fetch('/api/community-post-request/approve', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(approveData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to approve post');
            }

            // Update local state
            setPostRequests(prev =>
                prev.map(request =>
                    request.id === post.id
                        ? { ...request, status: 'approved' as const }
                        : request
                )
            );

            console.log('Post approved successfully');
        } catch (error) {
            console.error('Error approving post:', error);
            alert(error instanceof Error ? error.message : 'Failed to approve post');
        }
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
            <h1 className="text-3xl font-bold">Post Review ({postRequests.length})</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">ALL ({postRequests.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({postRequests.filter(r => r.status === 'pending').length})</TabsTrigger>
                    <TabsTrigger value="approved">Approved ({postRequests.filter(r => r.status === 'approved').length})</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected ({postRequests.filter(r => r.status === 'rejected').length})</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="pt-6">
                    {isLoadingRequests ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            <span>Loading post requests...</span>
                        </div>
                    ) : requestsError ? (
                        <div className="p-6 border border-red-200 rounded-lg bg-red-50">
                            <p className="text-red-600 text-sm mb-2">{requestsError}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.reload()}
                            >
                                Retry
                            </Button>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-muted-foreground">No posts found for this status.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredPosts.map((request) => (
                                <Card key={request.id} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        {/* Video/Media Section */}
                                        <div className="relative bg-muted h-48 flex items-center justify-center">
                                            {request.post?.file_url ? (
                                                <img
                                                    src={request.post.file_url}
                                                    alt="Post media"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <PlayCircle className="h-16 w-16" />
                                            )}

                                            {/* Status Badge */}
                                            <div className="absolute top-2 left-2">
                                                <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                                                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {request.status}
                                                </span>
                                            </div>

                                            {/* Action Buttons Overlay - Only show for pending */}
                                            {request.status === 'pending' && (
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprove(request)}
                                                        className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleReject(request)}
                                                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
                                                    >
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRequestChanges(request)}
                                                        className="bg-primary hover:bg-primary/90"
                                                    >
                                                        Request changes
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-lg">
                                                        {request.post?.title || 'Loading...'}
                                                    </h3>
                                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    {request.community?.name || `Community ${request.community_id.slice(0, 8)}...`}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {request.post?.description || 'No description available'}
                                            </p>
                                            <div className="mt-2 text-xs text-muted-foreground">
                                                <div>User: {request.user?.name || request.user_id.slice(0, 8)}</div>
                                                <div>Created: {request.post?.created_at ? new Date(request.post.created_at).toLocaleDateString() : 'Unknown'}</div>
                                            </div>
                                            {request.admin_message && (
                                                <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                                                    <strong>Admin Message:</strong> {request.admin_message}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
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
                            Request specific changes to &quot;<strong>{selectedPost?.post?.title}</strong>&quot; by {selectedPost?.user?.name || selectedPost?.user_id.slice(0, 8)}...
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
                            <h4 className="font-medium">{selectedPost?.post?.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{selectedPost?.post?.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {selectedPost?.community?.name} • By {selectedPost?.user?.name} • {selectedPost?.post?.created_at ? new Date(selectedPost.post.created_at).toLocaleDateString() : ''}
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
                            Please provide a reason for rejecting &quot;<strong>{selectedPost?.post?.title}</strong>&quot; by {selectedPost?.user?.name || selectedPost?.user_id.slice(0, 8)}....
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
                            <h4 className="font-medium">{selectedPost?.post?.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{selectedPost?.post?.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {selectedPost?.community?.name} • By {selectedPost?.user?.name} • {selectedPost?.post?.created_at ? new Date(selectedPost.post.created_at).toLocaleDateString() : ''}
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