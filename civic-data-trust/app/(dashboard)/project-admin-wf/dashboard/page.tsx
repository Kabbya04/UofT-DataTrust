"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, TrendingUp, BarChart2, RefreshCw, AlertCircle } from "lucide-react";
import Link from 'next/link';

interface ActivityLog {
  id: string;
  user_id: string;
  community_id: string | null;
  activity_type: string;
  activity_description: string;
  timestamp: string;
  activity: null;
  file_type: null;
  post_id: string | null;
  community_join_request_id: string | null;
  project_id: string | null;
  shared_file_id: string | null;
  // Resolved names (we'll add these)
  user_name?: string;
  community_name?: string;
  user_role?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Community {
  id: string;
  name: string;
  description?: string;
}
// Removed mock data - will be fetched from API

const barChartData = [
    { name: 'Jan', value: 2400 }, { name: 'Feb', value: 1398 }, { name: 'Mar', value: 3800 },
    { name: 'Apr', value: 2908 }, { name: 'May', value: 4800 }, { name: 'Jun', value: 3800 },
];

const pieChartData = [{ name: 'Group A', value: 400 }, { name: 'Group B', value: 300 }];
const COLORS = ['#2196F3', '#4FC3F7'];

export default function AdminDashboardPage() {
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(true);
    const [logsError, setLogsError] = useState<string | null>(null);
    const [pageNumber] = useState(1);
    const [limit] = useState(10);

    // Dashboard metrics state
    const [totalMembers, setTotalMembers] = useState<number>(0);
    const [activeMembers, setActiveMembers] = useState<number>(0);
    const [engagementCount, setEngagementCount] = useState<number>(0);
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
    const [metricsError, setMetricsError] = useState<string | null>(null);

    // Cache for user and community names to avoid repeated API calls
    const [userCache, setUserCache] = useState<Map<string, User>>(new Map());
    const [communityCache, setCommunityCache] = useState<Map<string, Community>>(new Map());

    // Helper function to fetch user details
    const fetchUserDetails = async (userId: string): Promise<User | null> => {
        if (userCache.has(userId)) {
            return userCache.get(userId) || null;
        }

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`/api/users/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                const user = result.data || result;
                setUserCache(prev => new Map(prev.set(userId, user)));
                return user;
            }
        } catch (error) {
            console.error(`Failed to fetch user ${userId}:`, error);
        }
        return null;
    };

    // Helper function to fetch community details
    const fetchCommunityDetails = async (communityId: string): Promise<Community | null> => {
        if (communityCache.has(communityId)) {
            return communityCache.get(communityId) || null;
        }

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`/api/community/${communityId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                const community = result.data || result;
                setCommunityCache(prev => new Map(prev.set(communityId, community)));
                return community;
            }
        } catch (error) {
            console.error(`Failed to fetch community ${communityId}:`, error);
        }
        return null;
    };

    // Function to resolve names for activity logs
    const resolveActivityLogNames = async (logs: ActivityLog[]): Promise<ActivityLog[]> => {
        const resolvedLogs = await Promise.all(
            logs.map(async (log) => {
                const resolvedLog = { ...log };

                // Resolve user name
                if (log.user_id) {
                    const user = await fetchUserDetails(log.user_id);
                    if (user) {
                        resolvedLog.user_name = user.name;
                        // You could also determine role here if available
                    }
                }

                // Resolve community name
                if (log.community_id) {
                    const community = await fetchCommunityDetails(log.community_id);
                    if (community) {
                        resolvedLog.community_name = community.name;
                    }
                }

                return resolvedLog;
            })
        );

        return resolvedLogs;
    };

    const fetchActivityLogs = async () => {
        try {
            setIsLoadingLogs(true);
            setLogsError(null);

            console.log('Fetching activity logs...', { pageNumber, limit });

            const token = localStorage.getItem('access_token');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`/api/activity-logs/community-logs?pageNumber=${pageNumber}&limit=${limit}`, {
                method: 'GET',
                headers,
            });

            const result = await response.json();
            console.log('Activity logs response:', result);

            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch activity logs');
            }

            // Extract logs from the actual API response structure
            let logs: ActivityLog[] = [];
            if (result && result.status && Array.isArray(result.data)) {
                logs = result.data;
                console.log('Raw activity logs from API:', logs);
            } else {
                console.warn('Unexpected activity logs response format:', result);
                logs = [];
            }

            // Resolve user and community names
            const resolvedLogs = await resolveActivityLogNames(logs);
            console.log('Activity logs with resolved names:', resolvedLogs);

            setActivityLogs(resolvedLogs);

        } catch (error: any) {
            console.error('Failed to fetch activity logs:', error);
            setLogsError(error.message || 'Failed to load activity logs');
        } finally {
            setIsLoadingLogs(false);
        }
    };

    // Function to fetch dashboard metrics
    const fetchDashboardMetrics = async () => {
        try {
            setIsLoadingMetrics(true);
            setMetricsError(null);

            const token = localStorage.getItem('access_token');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            console.log('Fetching dashboard metrics...');
            console.log('Auth token:', token ? 'Present' : 'Missing');

            // Fetch all three metrics in parallel
            const [totalMembersRes, activeMembersRes, engagementRes] = await Promise.all([
                fetch('/api/community/dashboard/total-members', { headers }),
                fetch('/api/community/dashboard/active-members', { headers }),
                fetch('/api/community/dashboard/engagement', { headers })
            ]);

            console.log('Response statuses:', {
                totalMembers: totalMembersRes.status,
                activeMembers: activeMembersRes.status,
                engagement: engagementRes.status
            });

            // Process total members
            if (totalMembersRes.ok) {
                const totalMembersData = await totalMembersRes.json();
                console.log('Total members data:', totalMembersData);
                // Handle different response formats
                const totalCount = totalMembersData.data?.uniqueMemberCount || totalMembersData.total_members || totalMembersData.count || 0;
                setTotalMembers(typeof totalCount === 'number' ? totalCount : 0);
            } else {
                console.error('Failed to fetch total members:', await totalMembersRes.text());
            }

            // Process active members
            if (activeMembersRes.ok) {
                const activeMembersData = await activeMembersRes.json();
                console.log('Active members data:', activeMembersData);
                const activeCount = activeMembersData.data?.activeMemberCount || activeMembersData.data?.uniqueMemberCount || activeMembersData.active_members || activeMembersData.count || 0;
                setActiveMembers(typeof activeCount === 'number' ? activeCount : 0);
            } else {
                console.error('Failed to fetch active members:', await activeMembersRes.text());
            }

            // Process engagement count
            if (engagementRes.ok) {
                const engagementData = await engagementRes.json();
                console.log('Engagement data:', engagementData);
                const engagement = engagementData.data?.engagementCount || engagementData.data?.count || engagementData.engagement_count || engagementData.count || 0;
                setEngagementCount(typeof engagement === 'number' ? engagement : 0);
            } else {
                console.error('Failed to fetch engagement:', await engagementRes.text());
            }

        } catch (error: any) {
            console.error('Failed to fetch dashboard metrics:', error);
            setMetricsError(error.message || 'Failed to load dashboard metrics');
        } finally {
            setIsLoadingMetrics(false);
        }
    };

    useEffect(() => {
        // Fetch both metrics and activity logs on component mount
        fetchDashboardMetrics();
        fetchActivityLogs();
    }, [pageNumber]); // eslint-disable-line react-hooks/exhaustive-deps

    const formatActivityTime = (timestamp: string) => {
        if (!timestamp) return 'Unknown time';

        try {
            const date = new Date(timestamp);
            return date.toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (error) {
            return timestamp;
        }
    };

    const formatActivityDescription = (activity_description: string) => {
        // Convert camelCase/PascalCase to readable format
        const formatted = activity_description
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
            .trim();

        // Map specific activities to more readable names
        const activityMap: Record<string, string> = {
            'Create Post': 'Create Post',
            'Get All Post Requests': 'View Post Requests',
            'Get Post Request By Id': 'View Post Request',
            'Approve Post Request': 'Approve Post Request',
            'Reject Post Request': 'Reject Post Request',
            'Request Change Post Request': 'Request Post Changes',
            'Get Categories': 'View Categories'
        };

        return activityMap[formatted] || formatted;
    };

    const getUserDisplayName = (log: ActivityLog) => {
        return log.user_name || `User-${log.user_id.slice(0, 8)}...`;
    };

    const getCommunityDisplayName = (log: ActivityLog) => {
        if (!log.community_id) return 'System';
        return log.community_name || `Community-${log.community_id.slice(0, 8)}...`;
    };

    const getActivityContext = (log: ActivityLog) => {
        if (log.post_id) {
            return `Post: ${log.post_id.slice(0, 8)}...`;
        }
        if (log.shared_file_id) {
            return `File: ${log.shared_file_id.slice(0, 8)}...`;
        }
        if (log.community_join_request_id) {
            return `Join Request: ${log.community_join_request_id.slice(0, 8)}...`;
        }
        return '-';
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Community Management</h1>
                <div className="flex gap-4">
                    <Link href="/project-admin-wf/create-community">
                        <Button 
                            variant="outline" 
                            style={{ backgroundColor: "#EBEBEB", border: "none" }}
                        >
                            Create Community
                        </Button>
                    </Link>
                    <Link href="/project-admin-wf/invite-members">
                        <Button style={{ backgroundColor: "#2196F3" }}>
                            Invite Members
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {isLoadingMetrics ? (
                                <div className="flex items-center">
                                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                    <span className="text-lg">Loading...</span>
                                </div>
                            ) : metricsError ? (
                                <span className="text-red-500 text-lg">Error</span>
                            ) : (
                                totalMembers.toLocaleString()
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isLoadingMetrics ? 'Fetching data...' : 'Total community members'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {isLoadingMetrics ? (
                                <div className="flex items-center">
                                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                    <span className="text-lg">Loading...</span>
                                </div>
                            ) : metricsError ? (
                                <span className="text-red-500 text-lg">Error</span>
                            ) : (
                                activeMembers.toLocaleString()
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isLoadingMetrics ? 'Fetching data...' : 'Currently active members'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Engagement Count</CardTitle>
                        <BarChart2 className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {isLoadingMetrics ? (
                                <div className="flex items-center">
                                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                    <span className="text-lg">Loading...</span>
                                </div>
                            ) : metricsError ? (
                                <span className="text-red-500 text-lg">Error</span>
                            ) : (
                                engagementCount.toLocaleString()
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isLoadingMetrics ? 'Fetching data...' : 'Total community engagement'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">My Communities</h2>
                <Tabs defaultValue="all"><TabsList><TabsTrigger value="all">All (120)</TabsTrigger><TabsTrigger value="internet">Internet (20)</TabsTrigger><TabsTrigger value="games">Games (20)</TabsTrigger><TabsTrigger value="technology">Technology (20)</TabsTrigger><TabsTrigger value="movies">Movies (20)</TabsTrigger><TabsTrigger value="television">Television (20)</TabsTrigger><TabsTrigger value="medicine">Medicine (20)</TabsTrigger></TabsList></Tabs>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Growth of Content</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData}>
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(value) => `${value}`} 
                                />
                                <Bar 
                                    dataKey="value" 
                                    fill="#88BEF0" 
                                    radius={[4, 4, 0, 0]} 
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card><CardHeader><CardTitle>Distribution of Content</CardTitle></CardHeader><CardContent className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" labelLine={false}>{pieChartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie></PieChart></ResponsiveContainer></CardContent></Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Activity</CardTitle>
                    <div className="flex items-center gap-2">
                        {(logsError || metricsError) && (
                            <div className="flex items-center gap-1 text-red-600 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <span>Error loading</span>
                            </div>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                fetchDashboardMetrics();
                                fetchActivityLogs();
                            }}
                            disabled={isLoadingLogs || isLoadingMetrics}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${(isLoadingLogs || isLoadingMetrics) ? 'animate-spin' : ''}`} />
                            Refresh All
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {logsError ? (
                        <div className="text-center py-8">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                            <p className="text-red-600 font-medium">Failed to load activity logs</p>
                            <p className="text-sm text-muted-foreground mt-1">{logsError}</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={fetchActivityLogs}
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Activity</TableHead>
                                    <TableHead>Context</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Community</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoadingLogs ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="flex items-center justify-center gap-2">
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                                <span>Loading activity logs...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : activityLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No activity logs found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    activityLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="text-sm">
                                                {formatActivityTime(log.timestamp)}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {formatActivityDescription(log.activity_description)}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {getActivityContext(log)}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {getUserDisplayName(log)}
                                            </TableCell>
                                            <TableCell>
                                                {getCommunityDisplayName(log)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="default" 
                                                    className="p-2 h-auto text-xs mr-1"
                                                    style={{ backgroundColor: "#43CD41", color: "white" }}
                                                >
                                                    Delete
                                                </Button>
                                                <Button 
                                                    variant="default" 
                                                    className="p-2 h-auto text-xs"
                                                    style={{ backgroundColor: "#CC0000E5", color: "white" }}
                                                >
                                                    Warning
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}