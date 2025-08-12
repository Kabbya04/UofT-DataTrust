import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { History, Eye, GitBranch } from "lucide-react";

const VersionItem = ({ version, date, status }: { version: string; date: string; status: 'Active' | 'Archived' }) => (
  <div className="flex items-center gap-4 border-b border-border/50 dark:border-neutral-800 py-4 last:border-b-0">
    <GitBranch className="w-5 h-5 text-primary"/>
    <div className="flex-1">
      <p className="font-semibold text-mono-caps">Version {version}</p>
      <p className="text-xs text-muted-foreground font-mono">Published on {date}</p>
    </div>
    <Badge className={`${status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-neutral-500/20 text-neutral-400'} text-mono-caps`}>{status}</Badge>
    <button className="text-sm font-mono text-primary hover:underline flex items-center gap-1.5"><Eye className="w-4 h-4"/> View</button>
  </div>
);

export default function VersionControlPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold text-mono-caps">T&C Version Control</h1>
        <p className="text-muted-foreground mt-2 font-mono">Review the history and changelog of the platform's legal documents.</p>
      </div>
      <Card className="bg-card dark:bg-neutral-900 border border-border dark:border-neutral-800 rounded-xl">
        <CardContent className="p-4">
          <VersionItem version="2.1" date="2024-04-30" status="Active" />
          <VersionItem version="2.0" date="2023-11-15" status="Archived" />
          <VersionItem version="1.5" date="2023-01-20" status="Archived" />
        </CardContent>
      </Card>
    </div>
  );
}