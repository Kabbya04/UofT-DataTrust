"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { X, AlertTriangle } from "lucide-react";

const requests = Array(10).fill(null).map((_, index) => ({
    id: index + 1,
    name: "Jhon Doe", 
    requestTime: "10:15 am, 7 Sep 2025", 
    message: "Interested in joining"
}));

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
    const [activeTab, setActiveTab] = useState('pending');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleReject = (request: any) => {
        setSelectedRequest(request);
        setShowRejectModal(true);
        setRejectionReason('');
        setCustomMessage('');
    };

    const handleConfirmReject = async () => {
        if (!rejectionReason) return;
        
        setIsProcessing(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Rejecting request:', {
            requestId: selectedRequest.id,
            reason: rejectionReason,
            message: customMessage
        });
        
        setIsProcessing(false);
        setShowRejectModal(false);
        setSelectedRequest(null);
        setRejectionReason('');
        setCustomMessage('');
    };

    const handleApprove = async (request: any) => {
        console.log('Approving request:', request.id);
        // Handle approval logic here
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Membership Requests</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">ALL</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab}>
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Request Time</TableHead>
                                        <TableHead>Message</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.map((req, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{req.name}</TableCell>
                                            <TableCell>{req.requestTime}</TableCell>
                                            <TableCell>{req.message}</TableCell>
                                            <TableCell className="text-right">
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
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Rejection Modal */}
            <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            <span>Reason for Rejection</span>
                        </DialogTitle>
                        <DialogDescription>
                            Please select a reason for rejecting <strong>{selectedRequest?.name}&#39;s</strong> membership request. 
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