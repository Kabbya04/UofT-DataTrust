import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { UserCheck, UserX, Clock } from "lucide-react";

const HistoryLogItem = ({ user, dataset, date, status }: { user: string; dataset: string; date: string; status: 'Approved' | 'Denied' }) => (
  <div className="flex items-center gap-4 border-b border-border/50 dark:border-neutral-800 py-4 last:border-b-0">
    <div>
      {status === 'Approved' ? <UserCheck className="w-5 h-5 text-green-500"/> : <UserX className="w-5 h-5 text-red-500"/>}
    </div>
    <div className="flex-1">
      <p className="font-mono"><span className="font-semibold text-foreground">{user}</span> requested <span className="text-foreground">{dataset}</span></p>
    </div>
    <div className="text-xs text-muted-foreground font-mono flex items-center gap-2"><Clock className="w-3 h-3"/>{date}</div>
    <Badge className={`${status === 'Approved' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'} text-mono-caps`}>{status}</Badge>
  </div>
);

export default function RequestHistoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-mono-caps">Request History</h1>
        <p className="text-muted-foreground mt-2 font-mono">An audit log of all past data access decisions.</p>
      </div>

      <Card className="bg-card dark:bg-neutral-900 border border-border dark:border-neutral-800 rounded-xl">
        <CardHeader>
          <CardTitle className="text-mono-caps">Past 30 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <HistoryLogItem user="Mark Chen (UofT)" dataset="Air Quality Index 2022" date="2024-05-18" status="Approved" />
          <HistoryLogItem user="Anonymous" dataset="Public Safety Records" date="2024-05-17" status="Denied" />
          <HistoryLogItem user="GreenPath NGO" dataset="Urban Tree Canopy Data" date="2024-05-12" status="Approved" />
        </CardContent>
      </Card>
    </div>
  );
}