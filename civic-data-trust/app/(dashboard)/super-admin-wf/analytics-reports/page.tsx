"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Users, FileText, BarChart2, TrendingUp, Download, FileSpreadsheet, X, Calendar, Clock, Mail } from "lucide-react";

const lineChartData = [
    { name: 'Jan', new: 4000, active: 2400 }, { name: 'Feb', new: 3000, active: 1398 },
    { name: 'Mar', new: 2000, active: 9800 }, { name: 'Apr', new: 2780, active: 3908 },
    { name: 'May', new: 1890, active: 4800 }, { name: 'Jun', new: 2390, active: 3800 },
];
const communityPerformance = Array(10).fill({ topic: "Health", community: "Live Life", members: "67,899", engagement: "67%", growth: "+23%" });
const savedReports = Array(10).fill({ title: "Monthly Users Report", date: "Sep 10, 2025" });

// Export Data Modal Component
function ExportDataModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [selectedData, setSelectedData] = useState<string[]>([]);
    const [format, setFormat] = useState("csv");
    const [dateRange, setDateRange] = useState("30d");

    const dataOptions = [
        { id: "users", label: "User Data", description: "User profiles, registration dates, activity" },
        { id: "communities", label: "Community Data", description: "Community details, member counts, engagement" },
        { id: "posts", label: "Post Data", description: "Post content, timestamps, interactions" },
        { id: "engagement", label: "Engagement Metrics", description: "Likes, comments, shares, views" },
        { id: "analytics", label: "Analytics Data", description: "Traffic, conversion rates, user journeys" },
        { id: "moderation", label: "Moderation Data", description: "Flagged content, review actions, reports" }
    ];

    const handleDataToggle = (dataId: string, checked: boolean) => {
        if (checked) {
            setSelectedData(prev => [...prev, dataId]);
        } else {
            setSelectedData(prev => prev.filter(id => id !== dataId));
        }
    };

    const handleExport = () => {
        if (selectedData.length === 0) {
            alert("Please select at least one data type to export");
            return;
        }
        
        // Simulate export process
        console.log("Exporting data:", { selectedData, format, dateRange });
        alert(`Exporting ${selectedData.length} data types as ${format.toUpperCase()}. Download will begin shortly.`);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto p-0 gap-0 [&>button]:hidden">
                {/* Header */}
                <div className="flex flex-row items-center justify-between p-6 pb-4 border-b">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        Export Data
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
                    {/* Date Range Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">DATE RANGE</Label>
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="24h">Last 24 hours</SelectItem>
                                <SelectItem value="7d">Last 7 days</SelectItem>
                                <SelectItem value="30d">Last 30 days</SelectItem>
                                <SelectItem value="90d">Last 90 days</SelectItem>
                                <SelectItem value="1y">Last year</SelectItem>
                                <SelectItem value="all">All time</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Data Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">SELECT DATA TO EXPORT</Label>
                        <div className="space-y-3">
                            {dataOptions.map((option) => (
                                <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                                    <Checkbox
                                        id={option.id}
                                        checked={selectedData.includes(option.id)}
                                        onCheckedChange={(checked) => 
                                            handleDataToggle(option.id, checked as boolean)
                                        }
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <Label 
                                            htmlFor={option.id} 
                                            className="text-sm font-medium cursor-pointer"
                                        >
                                            {option.label}
                                        </Label>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {option.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Format Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">EXPORT FORMAT</Label>
                        <Select value={format} onValueChange={setFormat}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                                <SelectItem value="xlsx">XLSX (Excel Spreadsheet)</SelectItem>
                                <SelectItem value="json">JSON (JavaScript Object Notation)</SelectItem>
                                <SelectItem value="pdf">PDF (Portable Document Format)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Export Info */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Export Information</h4>
                        <ul className="text-xs text-blue-700 space-y-1">
                            <li>• Large exports may take several minutes to process</li>
                            <li>• You&apos;ll receive a download link via email when ready</li>
                            <li>• Data is exported according to your current access permissions</li>
                            <li>• Files are automatically deleted after 7 days</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-6">
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleExport} className="bg-black hover:bg-black/90 text-white">
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Generate Report Modal Component
function GenerateReportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [reportName, setReportName] = useState("");
    const [reportType, setReportType] = useState("comprehensive");
    const [schedule, setSchedule] = useState("once");
    const [recipients, setRecipients] = useState("");
    const [description, setDescription] = useState("");

    const reportTypes = [
        { value: "comprehensive", label: "Comprehensive Report", description: "All platform metrics and analytics" },
        { value: "user-activity", label: "User Activity Report", description: "User engagement and behavior data" },
        { value: "community-performance", label: "Community Performance", description: "Community growth and engagement" },
        { value: "content-analysis", label: "Content Analysis", description: "Post performance and content insights" },
        { value: "moderation-summary", label: "Moderation Summary", description: "Content moderation activities and trends" },
        { value: "custom", label: "Custom Report", description: "Build your own report with specific metrics" }
    ];

    const handleGenerate = () => {
        if (!reportName.trim()) {
            alert("Please enter a report name");
            return;
        }

        // Simulate report generation
        console.log("Generating report:", { reportName, reportType, schedule, recipients, description });
        alert(`Report "${reportName}" is being generated. You'll receive it via email when ready.`);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto p-0 gap-0 [&>button]:hidden">
                {/* Header */}
                <div className="flex flex-row items-center justify-between p-6 pb-4 border-b">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <BarChart2 className="h-5 w-5" />
                        Generate Report
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
                    {/* Report Name */}
                    <div className="space-y-2">
                        <Label htmlFor="reportName" className="text-sm font-medium">
                            REPORT NAME
                        </Label>
                        <Input
                            id="reportName"
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                            placeholder="Enter report name"
                            className="w-full"
                        />
                    </div>

                    {/* Report Type */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">REPORT TYPE</Label>
                        <Select value={reportType} onValueChange={setReportType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {reportTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        <div>
                                            <div className="font-medium">{type.label}</div>
                                            <div className="text-xs text-muted-foreground">{type.description}</div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Schedule */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">SCHEDULE</Label>
                        <Select value={schedule} onValueChange={setSchedule}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="once">Generate Once</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Recipients */}
                    <div className="space-y-2">
                        <Label htmlFor="recipients" className="text-sm font-medium">
                            EMAIL RECIPIENTS
                        </Label>
                        <Input
                            id="recipients"
                            value={recipients}
                            onChange={(e) => setRecipients(e.target.value)}
                            placeholder="Enter email addresses (comma separated)"
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                            Leave empty to send to your email only
                        </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            DESCRIPTION (OPTIONAL)
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add notes or specific requirements for this report"
                            className="w-full min-h-[80px]"
                        />
                    </div>

                    {/* Report Info */}
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Report Generation Info
                        </h4>
                        <ul className="text-xs text-green-700 space-y-1">
                            <li>• Reports are generated based on your current date range selection</li>
                            <li>• Complex reports may take 10-15 minutes to generate</li>
                            <li>• You&apos;ll receive an email notification when the report is ready</li>
                            <li>• Scheduled reports will be sent automatically at the specified interval</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-6">
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleGenerate} className="bg-black hover:bg-black/90 text-white">
                            <BarChart2 className="h-4 w-4 mr-2" />
                            Generate Report
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function AnalyticsReportsPage() {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Analytics & Reports</h1>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsExportModalOpen(true)}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                    <Button onClick={() => setIsReportModalOpen(true)}>
                        <BarChart2 className="h-4 w-4 mr-2" />
                        Generate Report
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="30d">
                <TabsList>
                    <TabsTrigger value="24h">Last 24 hours</TabsTrigger>
                    <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
                    <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
                    <TabsTrigger value="90d">Last 90 Days</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
            </Tabs>

            <Card>
                <CardHeader><CardTitle>Filter By</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Select><SelectTrigger className="w-full"><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                        <Select><SelectTrigger className="w-full"><SelectValue placeholder="Community" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                        <Select><SelectTrigger className="w-full"><SelectValue placeholder="Users" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                        <Select><SelectTrigger className="w-full"><SelectValue placeholder="Device" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">90,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Communities</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">50,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Posts</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">30,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Engagement Rate</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">5,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle>User Growth & Activity</CardTitle></CardHeader>
                <CardContent className="h-[350px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={lineChartData}><XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} /><Line type="monotone" dataKey="new" stroke="hsl(var(--primary))" strokeWidth={2} /><Line type="monotone" dataKey="active" stroke="#82ca9d" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Community Performance</CardTitle></CardHeader>
                    <CardContent><Table><TableHeader><TableRow><TableHead>Topic</TableHead><TableHead>Community</TableHead><TableHead>Members</TableHead><TableHead>Engagement</TableHead><TableHead>Growth</TableHead></TableRow></TableHeader><TableBody>{communityPerformance.map((item, i) => (<TableRow key={i}><TableCell>{item.topic}</TableCell><TableCell>{item.community}</TableCell><TableCell>{item.members}</TableCell><TableCell>{item.engagement}</TableCell><TableCell>{item.growth}</TableCell></TableRow>))}</TableBody></Table></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Saved Reports</CardTitle></CardHeader>
                    <CardContent className="space-y-2">{savedReports.map((report, i) => (<div key={i} className="flex items-center justify-between p-3 border rounded-md"><div className="flex items-center gap-3"><FileText className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm font-medium">{report.title}</p><p className="text-xs text-muted-foreground">{report.date}</p></div></div></div>))}</CardContent>
                </Card>
            </div>

            {/* Export Data Modal */}
            <ExportDataModal 
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
            />

            {/* Generate Report Modal */}
            <GenerateReportModal 
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
            />
        </div>
    );
}