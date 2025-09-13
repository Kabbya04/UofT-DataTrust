"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { useCommunity } from "@/app/components/contexts/community-context";

interface JoinRequest {
    id: string
    user_id: string
    community_id: string
    message?: string
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
    user: {
        id: string
        name: string
        email: string
    }
}

const rejectionReasons = [
    "Incomplete application",
    "Does not meet community guidelines",
    "Suspicious activity detected",
    "Duplicate application",
    "Invalid email address",
    "Insufficient information provided",
    "Application expired",
    "Other (please specify)"
];

export default function MembershipRequestsPage() {
    const { getAllJoinRequests, approveJoinRequest, rejectJoinRequest, loading, communities, fetchCommunities } = useCommunity();
    const [activeTab, setActiveTab] = useState('pending');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [requests, setRequests] = useState<JoinRequest[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedCommunityId, setSelectedCommunityId] = useState<string>('');
    
    // Use "all" as default selection to show all requests
    useEffect(() => {
        if (communities.length > 0 && !selectedCommunityId) {
            setSelectedCommunityId('all');
        }
    }, [communities, selectedCommunityId]);

    useEffect(() => {
        fetchJoinRequests();
    }, [selectedCommunityId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-refresh every 10 seconds to catch new requests
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Auto-refreshing join requests...');
            fetchJoinRequests();
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, [selectedCommunityId]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchJoinRequests = async () => {
        try {
            setError(null);
            console.log('=== FETCHING JOIN REQUESTS ===');
            console.log('Selected community ID:', selectedCommunityId);

            const fetchedRequests = await getAllJoinRequests();
            console.log('Total fetched requests:', fetchedRequests.length);
            console.log('All requests:', fetchedRequests);

            // Debug: Show what community IDs we got vs what we expected
            const fetchedCommunityIds = [...new Set(fetchedRequests.map(req => req.community_id))];
            console.log('Community IDs in fetched requests:', fetchedCommunityIds);

            // Show which communities we should see requests for
            const adminCommunities = communities.filter(community =>
                community.admins?.some((admin: any) => admin.id === localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').id : null)
            );
            console.log('Communities where current user is admin:', adminCommunities.map(c => ({ id: c.id, name: c.name })));
            console.log('Expected community IDs:', adminCommunities.map(c => c.id));

            // Log pending requests specifically
            const pendingRequests = fetchedRequests.filter(req => req.status === 'pending');
            console.log('Pending requests count:', pendingRequests.length);
            console.log('Pending requests:', pendingRequests);

            // Filter by selected community if one is selected (but not "all")
            if (selectedCommunityId && selectedCommunityId !== 'all') {
                const filteredRequests = fetchedRequests.filter(req => req.community_id === selectedCommunityId);
                console.log('Filtered requests for community:', selectedCommunityId, filteredRequests);
                setRequests(filteredRequests);
            } else {
                console.log('Showing all requests');
                setRequests(fetchedRequests);
            }

            console.log('=== FETCH COMPLETE ===');
        } catch (err) {
            console.error('Failed to fetch join requests:', err);
            setError('Failed to load join requests');
            // Fallback to empty array if API fails
            setRequests([]);
        }
    };

    const handleReject = (request: JoinRequest) => {
        setSelectedRequest(request);
        setShowRejectModal(true);
        setRejectionReason('');
        setCustomMessage('');
    };

    const handleConfirmReject = async () => {
        if (!rejectionReason || !selectedRequest) return;
        
        setIsProcessing(true);
        
        try {
            console.log('Rejecting request:', {
                requestId: selectedRequest.id,
                reason: rejectionReason,
                message: customMessage
            });
            
            await rejectJoinRequest(selectedRequest.id, rejectionReason, customMessage);
            
            // Refresh the requests list after successful rejection
            await fetchJoinRequests();
            
            setShowRejectModal(false);
            setSelectedRequest(null);
            setRejectionReason('');
            setCustomMessage('');
        } catch (error) {
            console.error('Failed to reject request:', error);
            alert('Failed to reject request. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleApprove = async (request: JoinRequest) => {
        try {
            console.log('Approving request:', request.id);
            await approveJoinRequest(request.id);
            
            // Refresh the requests list after successful approval
            await fetchJoinRequests();
            
            alert('Join request approved successfully!');
        } catch (error) {
            console.error('Failed to approve request:', error);
            alert('Failed to approve request. Please try again.');
        }
    };

    const filteredRequests = requests.filter(request => {
        if (activeTab === 'all') return true;
        return request.status === activeTab;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Membership Requests</h1>
                
                {/* Community Selector */}
                <div className="flex items-center gap-4">
                    <Label htmlFor="community-select" className="text-sm font-medium whitespace-nowrap">
                        Select Community:
                    </Label>
                    <Select value={selectedCommunityId} onValueChange={setSelectedCommunityId}>
                        <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Choose a community" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Communities</SelectItem>
                            {communities.map((community) => (
                                <SelectItem key={community.id} value={community.id}>
                                    {community.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={fetchJoinRequests} disabled={loading}>
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </Button>
                    <Button variant="outline" onClick={() => {
                        console.log('Force refresh clicked - clearing all cache');
                        setRequests([]);
                        fetchJoinRequests();
                    }}>
                        Force Refresh
                    </Button>
                </div>
            </div>
            
            {!selectedCommunityId && (
                <div className="p-4 bg-muted/50 border border-muted rounded-lg">
                    <p className="text-muted-foreground">Loading communities...</p>
                </div>
            )}
            
            {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive">{error}</p>
                    <Button variant="outline" onClick={fetchJoinRequests} className="mt-2">
                        Retry
                    </Button>
                </div>
            )}
            
            {selectedCommunityId && (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">ALL ({requests.length})</TabsTrigger>
                        <TabsTrigger value="pending">Pending ({requests.filter(r => r.status === 'pending').length})</TabsTrigger>
                        <TabsTrigger value="approved">Approved ({requests.filter(r => r.status === 'approved').length})</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected ({requests.filter(r => r.status === 'rejected').length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value={activeTab}>
                        <Card>
                            <CardContent className="p-0">
                                {loading ? (
                                    <div className="p-8 text-center">
                                        <div className="inline-block h-6 w-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                        <p className="mt-2 text-muted-foreground">Loading requests...</p>
                                    </div>
                                ) : filteredRequests.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        No {activeTab === 'all' ? '' : activeTab} requests found.
                                        {activeTab === 'pending' && (
                                            <div className="mt-2 text-sm">
                                                <p>To test the functionality, try submitting a join request from:</p>
                                                <p className="font-mono text-xs mt-1">
                                                    http://localhost:3001/community-member-wf/discover-community
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Community</TableHead>
                                                <TableHead>Request Time</TableHead>
                                                <TableHead>Message</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredRequests.map((req) => {
                                                const community = communities.find(c => c.id === req.community_id);
                                                return (
                                                <TableRow key={req.id}>
                                                    <TableCell className="font-medium">{req.user.name}</TableCell>
                                                    <TableCell className="font-medium">{community?.name || 'Unknown Community'}</TableCell>
                                                    <TableCell>{formatDate(req.created_at)}</TableCell>
                                                    <TableCell>{req.message || 'No message'}</TableCell>
                                                    <TableCell>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {req.status === 'pending' && (
                                                            <div className="flex gap-2 justify-end">
                                                                <Button onClick={() => handleApprove(req)}>
                                                                    Approve
                                                                </Button>
                                                                <Button 
                                                                    variant="outline" 
                                                                    onClick={() => handleReject(req)}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}

            {/* Rejection Modal */}
            <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            <span>Reason for Rejection</span>
                        </DialogTitle>
                        <DialogDescription>
                            Please select a reason for rejecting <strong>{selectedRequest?.user.name}&#39;s</strong> membership request. 
                            This information will help improve the application process.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Reason Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-sm font-medium">
                                Select a reason *
                            </Label>
                            <Select value={rejectionReason} onValueChange={setRejectionReason}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a rejection reason" />
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

                        {/* Custom Message */}
                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-sm font-medium">
                                Additional message {rejectionReason === "Other (please specify)" ? "*" : "(optional)"}
                            </Label>
                            <Textarea
                                id="message"
                                placeholder={
                                    rejectionReason === "Other (please specify)" 
                                        ? "Please specify the reason for rejection..."
                                        : "Add any additional details or feedback for the applicant..."
                                }
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                className="min-h-[100px] resize-none"
                                required={rejectionReason === "Other (please specify)"}
                            />
                            <p className="text-xs text-muted-foreground">
                                {rejectionReason === "Other (please specify)" 
                                    ? "Please provide specific details about the rejection reason."
                                    : "This message will be included in the rejection notification email."}
                            </p>
                        </div>

                        {/* Warning Notice */}
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <div className="flex items-start space-x-2">
                                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-destructive mb-1">Important Notice</p>
                                    <p className="text-muted-foreground">
                                        The applicant will be notified of this rejection via email. 
                                        This action cannot be undone, but they may reapply in the future.
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
                            className="min-w-[100px]"
                        >
                            {isProcessing ? (
                                <div className="flex items-center space-x-2">
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Rejecting...</span>
                                </div>
                            ) : (
                                'Reject Request'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}