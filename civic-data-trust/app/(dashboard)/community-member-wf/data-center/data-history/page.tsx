import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { GitCommit, Clock, User, Download } from "lucide-react";

const HistoryItem = ({ version, user, date, description }: { version: string; user: string; date: string; description: string }) => (
  <div className="flex gap-4 border-b border-border/50 dark:border-neutral-800 py-4 last:border-b-0">
    <div className="mt-1">
      <GitCommit className="w-5 h-5 text-primary" />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-mono-caps">{version}</p>
        <p className="text-xs text-muted-foreground font-mono flex items-center gap-2"><Clock className="w-3 h-3"/> {date}</p>
      </div>
      <p className="text-sm text-muted-foreground font-mono mt-1">{description}</p>
      <div className="flex justify-between items-center mt-3">
        <p className="text-xs text-muted-foreground font-mono flex items-center gap-2"><User className="w-3 h-3"/> Uploaded by {user}</p>
        <button className="text-xs font-mono text-primary hover:underline flex items-center gap-1"><Download className="w-3 h-3"/> Download</button>
      </div>
    </div>
  </div>
);

export default function DataHistoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-mono-caps">Data History & Versioning</h1>
        <p className="text-muted-foreground mt-2 font-mono">Track changes and revisions for the &apos;Public Housing Survey 2023&apos; dataset.</p>
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-mono-caps">Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <HistoryItem version="Version 1.2" user="Alex Ryder" date="2024-05-20" description="Corrected typos in column headers and added Q4 data." />
          <HistoryItem version="Version 1.1" user="Jane Doe" date="2024-03-15" description="Added supplementary data for Ward 7." />
          <HistoryItem version="Version 1.0" user="Alex Ryder" date="2024-02-01" description="Initial dataset upload." />
        </CardContent>
      </Card>
    </div>
  );
}