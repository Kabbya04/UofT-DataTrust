"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Calendar, FileClock } from "lucide-react";

// Mock audit log data
const auditLogs = [
	{
		id: 1,
		time: "3 pm, 3 Jan 2025",
		user: "John Doe",
		action: "View",
		data: "Spiderman Image",
	},
	{
		id: 2,
		time: "3 pm, 3 Jan 2025",
		user: "John Doe",
		action: "View",
		data: "Spiderman Image",
	},
	{
		id: 3,
		time: "3 pm, 3 Jan 2025",
		user: "John Doe",
		action: "Download",
		data: "Spiderman Image",
	},
	{
		id: 4,
		time: "3 pm, 3 Jan 2025",
		user: "John Doe",
		action: "Download",
		data: "Spiderman Image",
	},
];

export default function CommunityAuditLogsPage() {
	return (
		<div className="space-y-8">
			<h1 className="text-3xl font-bold">Community Audit Logs</h1>

			{/* Filters Card */}
			<Card>
				<CardHeader>
					<CardTitle>Filters</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-6">
						<div className="flex items-center gap-2">
							<label className="text-sm font-medium">Date</label>
							<div className="relative">
								<Input
									type="text"
									defaultValue="1 Sep, 2025"
									className="w-40 pr-8"
								/>
								<Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							</div>
						</div>

						<div className="flex items-center gap-2">
							<label className="text-sm font-medium">to</label>
							<div className="relative">
								<Input
									type="text"
									defaultValue="9 Sep, 2025"
									className="w-40 pr-8"
								/>
								<Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							</div>
						</div>

						<div className="flex items-center gap-2">
							<label className="text-sm font-medium">User</label>
							<Select defaultValue="all">
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All</SelectItem>
									<SelectItem value="john">John Doe</SelectItem>
									<SelectItem value="jane">Jane Smith</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex items-center gap-2">
							<label className="text-sm font-medium">Data Type</label>
							<Select defaultValue="all">
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All</SelectItem>
									<SelectItem value="image">Image</SelectItem>
									<SelectItem value="document">Document</SelectItem>
									<SelectItem value="video">Video</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<Button className="bg-blue-600 hover:bg-blue-700 text-white">
							Export
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Audit Logs Table */}
			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow className="border-b">
								<TableHead className="font-semibold text-foreground">
									Time
								</TableHead>
								<TableHead className="font-semibold text-foreground">
									User
								</TableHead>
								<TableHead className="font-semibold text-foreground">
									Action
								</TableHead>
								<TableHead className="font-semibold text-foreground">
									Data
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{auditLogs.map((log) => (
								<TableRow key={log.id} className="border-b">
									<TableCell className="font-medium">{log.time}</TableCell>
									<TableCell>{log.user}</TableCell>
									<TableCell>{log.action}</TableCell>
									<TableCell>{log.data}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}