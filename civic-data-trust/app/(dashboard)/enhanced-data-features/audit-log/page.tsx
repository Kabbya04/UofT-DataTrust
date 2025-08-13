import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { User, Shield, Upload, Download, Clock } from "lucide-react";

const AuditLogItem = ({ user, action, target, date, ip }: { user: string; action: string; target: string; date: string; ip: string; }) => {
  const getActionColor = () => {
    if (action.includes('CREATE') || action.includes('UPLOAD')) return 'bg-blue-500/20 text-blue-400';
    if (action.includes('ACCESS') || action.includes('DOWNLOAD')) return 'bg-green-500/20 text-green-400';
    if (action.includes('DENY') || action.includes('DELETE')) return 'bg-red-500/20 text-red-400';
    return 'bg-neutral-500/20 text-neutral-400';
  };

  return (
  <div className="flex items-center gap-4 border-b border-border/50 dark:border-neutral-800 py-3 last:border-b-0">
    <p className="w-24 text-sm text-muted-foreground font-mono flex items-center gap-2"><Clock className="w-3 h-3"/>{date}</p>
    <div className="w-40 flex items-center gap-2">
      <User className="w-3 h-3 text-muted-foreground"/>
      <p className="font-mono text-sm">{user}</p>
    </div>
    <div className="w-28">
      <Badge className={`text-xs text-mono-caps ${getActionColor()}`}>{action}</Badge>
    </div>
    <p className="flex-1 font-mono text-sm">{target}</p>
    <p className="text-sm text-muted-foreground font-mono">{ip}</p>
  </div>
)};

export default function AuditLogPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-mono-caps">System Audit Logs</h1>
        <p className="text-muted-foreground mt-2 font-mono">Immutable, timestamped record of all system-level events.</p>
      </div>

      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono px-4 pb-2 border-b border-border/50 dark:border-neutral-800">
             <p className="w-24">TIMESTAMP</p>
             <p className="w-40">USER</p>
             <p className="w-28">ACTION</p>
             <p className="flex-1">TARGET RESOURCE</p>
             <p>SOURCE IP</p>
          </div>
          <AuditLogItem date="14:23:05" user="Alex Ryder" action="UPLOAD" target="Dataset: 'Public Housing Survey 2023'" ip="192.168.1.101" />
          <AuditLogItem date="14:22:10" user="System" action="ACCESS_DENY" target="User: 'Anonymous' on 'Public Safety Records'" ip="203.0.113.55" />
          <AuditLogItem date="14:21:55" user="Admin" action="POLICY_UPDATE" target="Role: 'Researcher'" ip="192.168.1.1" />
          <AuditLogItem date="14:20:01" user="Jane Doe" action="DOWNLOAD" target="Dataset: 'Urban Tree Canopy Data'" ip="198.51.100.22" />
        </CardContent>
      </Card>
    </div>
  );
}