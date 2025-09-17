"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { ShieldAlert, ShieldCheck, ShieldX, ArrowUpRightFromSquare, FileText, X, AlertTriangle, CheckCircle, XCircle, Flag } from "lucide-react";

// Mock data for different tabs
const profilesData = [
    { user: "Marvin McKinney", userType: "Community Member", lastActivity: "Jan 15, 2024", profileCreated: "Jan 15, 2025" },
    { user: "Ralph Edwards", userType: "Researcher", lastActivity: "Jan 15, 2024", profileCreated: "Jan 15, 2025" },
    { user: "Kristin Watson", userType: "Super Admin", lastActivity: "Jan 15, 2024", profileCreated: "Jan 15, 2025" },
    { user: "Esther Howard", userType: "Project Admin", lastActivity: "Jan 15, 2024", profileCreated: "Jan 15, 2025" },
    { user: "Darrell Steward", userType: "Community Member", lastActivity: "Jan 15, 2024", profileCreated: "Jan 15, 2025" },
];

const contentsData = [
    { post: "Get Better", community: "Health", admin: "Marvin McKinney", dateCreated: "Jan 15, 2025" },
    { post: "Get Better", community: "Health", admin: "Courtney Henry", dateCreated: "Jan 15, 2025" },
    { post: "Get Better", community: "Health", admin: "Jacob Jones", dateCreated: "Jan 15, 2025" },
    { post: "Get Better", community: "Health", admin: "Robert Fox", dateCreated: "Jan 15, 2025" },
    { post: "Get Better", community: "Health", admin: "Bessie Cooper", dateCreated: "Jan 15, 2025" },
];

const communitiesData = [
    { community: "Get Better", type: "Health", admin: "Ralph Edwards", dateCreated: "Jan 15, 2025" },
    { community: "Get Better", type: "Health", admin: "Brooklyn Simmons", dateCreated: "Jan 15, 2025" },
    { community: "Get Better", type: "Health", admin: "Ronald Richards", dateCreated: "Jan 15, 2025" },
    { community: "Get Better", type: "Health", admin: "Courtney Henry", dateCreated: "Jan 15, 2025" },
    { community: "Get Better", type: "Health", admin: "Annette Black", dateCreated: "Jan 15, 2025" },
];

// Moderation Guidelines Modal Component
function ModerationGuidelinesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-0 gap-0 [&>button]:hidden">
                {/* Header */}
                <div className="flex flex-row items-center justify-between p-6 pb-4 border-b">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Content Moderation Guidelines
                    </DialogTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-6 w-6 p-0 hover:bg-muted rounded-sm"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Overview */}
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">Overview</h2>
                        <p className="text-muted-foreground">
                            These guidelines help ensure our platform maintains high standards for content quality, 
                            user safety, and community engagement. All content should be reviewed according to these standards.
                        </p>
                    </div>

                    {/* Content Review Criteria */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Content Review Criteria</h2>
                        
                        <div className="grid gap-4">
                            {/* Approval Criteria */}
                            <Card className="border-green-200 bg-green-50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2 text-green-700">
                                        <CheckCircle className="h-4 w-4" />
                                        Approve Content When:
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <ul className="space-y-1 text-sm text-green-700">
                                        <li>• Content is relevant to the community topic</li>
                                        <li>• Information is accurate and well-sourced</li>
                                        <li>• Language is respectful and professional</li>
                                        <li>• Follows community posting guidelines</li>
                                        <li>• Contributes value to the discussion</li>
                                        <li>• Does not contain personal attacks or harassment</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Rejection Criteria */}
                            <Card className="border-red-200 bg-red-50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2 text-red-700">
                                        <XCircle className="h-4 w-4" />
                                        Reject Content When:
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <ul className="space-y-1 text-sm text-red-700">
                                        <li>• Contains hate speech, harassment, or discrimination</li>
                                        <li>• Includes spam or excessive self-promotion</li>
                                        <li>• Shares false or misleading information</li>
                                        <li>• Violates copyright or intellectual property rights</li>
                                        <li>• Contains personal information or doxxing</li>
                                        <li>• Includes illegal content or activities</li>
                                        <li>• Off-topic or irrelevant to the community</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Escalation Criteria */}
                            <Card className="border-yellow-200 bg-yellow-50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2 text-yellow-700">
                                        <AlertTriangle className="h-4 w-4" />
                                        Escalate When:
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <ul className="space-y-1 text-sm text-yellow-700">
                                        <li>• Content involves potential legal issues</li>
                                        <li>• Unclear if content violates guidelines</li>
                                        <li>• High-profile user or sensitive topic</li>
                                        <li>• Multiple reports on the same content</li>
                                        <li>• Content could impact platform reputation</li>
                                        <li>• Technical issues affecting moderation</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Severity Levels */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Severity Classification</h2>
                        <div className="grid gap-3">
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div>
                                    <span className="font-medium">Low:</span>
                                    <span className="text-muted-foreground ml-2">Minor guideline violations, off-topic posts</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div>
                                    <span className="font-medium">Medium:</span>
                                    <span className="text-muted-foreground ml-2">Spam, misleading information, inappropriate language</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                <div>
                                    <span className="font-medium">High:</span>
                                    <span className="text-muted-foreground ml-2">Harassment, hate speech, personal attacks</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div>
                                    <span className="font-medium">Critical:</span>
                                    <span className="text-muted-foreground ml-2">Illegal content, doxxing, threats of violence</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Response Times */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Expected Response Times</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-red-600">2 hours</div>
                                    <div className="text-sm text-muted-foreground">Critical severity items</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-orange-600">8 hours</div>
                                    <div className="text-sm text-muted-foreground">High severity items</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-yellow-600">24 hours</div>
                                    <div className="text-sm text-muted-foreground">Medium severity items</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-green-600">72 hours</div>
                                    <div className="text-sm text-muted-foreground">Low severity items</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-3 border-t pt-4">
                        <h2 className="text-lg font-semibold">Need Help?</h2>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>For questions about these guidelines or escalation procedures:</p>
                            <p>• Contact: moderation-team@datatrust.org</p>
                            <p>• Emergency escalation: +1 (555) 123-4567</p>
                            <p>• Last updated: January 2025</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-6">
                    <div className="flex justify-end">
                        <Button onClick={onClose} className="bg-black hover:bg-black/90 text-white">
                            Got it
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function ContentModerationPage() {
    const [activeTab, setActiveTab] = useState("profiles");
    const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

    const handleModerationGuidelines = () => {
        setIsGuidelinesOpen(true);
    };

    const handleApprove = (item: any, type: string) => {
        console.log(`Approved ${type}:`, item);
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} approved successfully!`);
    };

    const handleReject = (item: any, type: string) => {
        console.log(`Rejected ${type}:`, item);
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} rejected successfully!`);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Content Moderation</h1>
                <Button 
                    variant="outline" 
                    onClick={handleModerationGuidelines}
                    style={{ backgroundColor: "#2196F3", color: "white", border: "none" }}
                >
                    <FileText className="h-4 w-4 mr-2" />
                    Moderation Guidelines
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                        <ShieldAlert className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">90,000</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
                        <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">50,000</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
                        <ShieldX className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">50,000</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Escalated</CardTitle>
                        <ArrowUpRightFromSquare className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">30,000</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Tabs */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="communities">Communities</TabsTrigger>
                            <TabsTrigger value="contents">Contents</TabsTrigger>
                            <TabsTrigger value="profiles">Profiles</TabsTrigger>
                        </TabsList>
                        
                        {/* Filter Dropdowns */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Flag Reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="spam">Spam</SelectItem>
                                    <SelectItem value="harassment">Harassment</SelectItem>
                                    <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                                    <SelectItem value="copyright">Copyright Violation</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Reporter Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="community">Community Member</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Date" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="all">All Time</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tab Contents */}
                        <TabsContent value="profiles">
                            <Card>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>User Type</TableHead>
                                                <TableHead>Last Activity</TableHead>
                                                <TableHead>Profile Created</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {profilesData.map((profile, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="font-medium">{profile.user}</TableCell>
                                                    <TableCell>{profile.userType}</TableCell>
                                                    <TableCell>{profile.lastActivity}</TableCell>
                                                    <TableCell>{profile.profileCreated}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex gap-2 justify-end">
                                                            <Button 
                                                                size="sm"
                                                                onClick={() => handleApprove(profile, 'profile')}
                                                                style={{ backgroundColor: "#43CD41", color: "white", border: "none" }}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button 
                                                                size="sm"
                                                                variant="outline" 
                                                                onClick={() => handleReject(profile, 'profile')}
                                                                style={{ backgroundColor: "#CC0000E5", color: "white", border: "none" }}
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

                        <TabsContent value="contents">
                            <Card>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Post</TableHead>
                                                <TableHead>Community</TableHead>
                                                <TableHead>Admin</TableHead>
                                                <TableHead>Date Created</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {contentsData.map((content, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="font-medium">{content.post}</TableCell>
                                                    <TableCell>{content.community}</TableCell>
                                                    <TableCell>{content.admin}</TableCell>
                                                    <TableCell>{content.dateCreated}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex gap-2 justify-end">
                                                            <Button 
                                                                size="sm"
                                                                onClick={() => handleApprove(content, 'content')}
                                                                style={{ backgroundColor: "#43CD41", color: "white", border: "none" }}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button 
                                                                size="sm"
                                                                variant="outline" 
                                                                onClick={() => handleReject(content, 'content')}
                                                                style={{ backgroundColor: "#CC0000E5", color: "white", border: "none" }}
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

                        <TabsContent value="communities">
                            <Card>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Community</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Admin</TableHead>
                                                <TableHead>Date Created</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {communitiesData.map((community, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="font-medium">{community.community}</TableCell>
                                                    <TableCell>{community.type}</TableCell>
                                                    <TableCell>{community.admin}</TableCell>
                                                    <TableCell>{community.dateCreated}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex gap-2 justify-end">
                                                            <Button 
                                                                size="sm"
                                                                onClick={() => handleApprove(community, 'community')}
                                                                style={{ backgroundColor: "#43CD41", color: "white", border: "none" }}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button 
                                                                size="sm"
                                                                variant="outline" 
                                                                onClick={() => handleReject(community, 'community')}
                                                                style={{ backgroundColor: "#CC0000E5", color: "white", border: "none" }}
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
                </CardContent>
            </Card>

            {/* Moderation Guidelines Modal */}
            <ModerationGuidelinesModal 
                isOpen={isGuidelinesOpen}
                onClose={() => setIsGuidelinesOpen(false)}
            />
        </div>
    );
}