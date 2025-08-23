import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { UserCheck, UserX, FileQuestion, Clock } from "lucide-react";

const RequestItem = ({ user, dataset, date, reason }: { user: string; dataset: string; date: string; reason: string }) => (
  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center border-b border-border/50 dark:border-neutral-800 p-4 last:border-b-0">
    <div className="flex items-center gap-3">
      <FileQuestion className="w-8 h-8 text-primary shrink-0" />
      <div>
        <p className="font-semibold text-mono-caps">{user}</p>
        <p className="text-sm text-muted-foreground font-mono">requests access to <span className="text-foreground font-semibold">{dataset}</span></p>
      </div>
    </div>
    <div className="flex-1 text-sm text-muted-foreground font-mono italic">
      &ldquo;{reason}&rdquo;
    </div>
    <div className="flex items-center gap-2 mt-2 md:mt-0 ml-auto">
      <Button variant="ghost" size="sm" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-400"><UserCheck className="w-4 h-4 mr-2"/> Approve</Button>
      <Button variant="ghost" size="sm" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400"><UserX className="w-4 h-4 mr-2"/> Deny</Button>
    </div>
  </div>
);

export default function RequestReviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-mono-caps">Pending Access Requests</h1>
        <p className="text-muted-foreground mt-2 font-mono">Review and respond to new data requests from community members.</p>
      </div>

      <Card className="rounded-xl">
        <CardContent className="p-0">
          <RequestItem user="Dr. Evelyn Reed" dataset="Economic Mobility Study" date="2024-05-21" reason="Academic research on post-pandemic economic recovery." />
          <RequestItem user="City Planning Dept." dataset="Public Transportation Usage" date="2024-05-19" reason="To inform the new downtown transit corridor project." />
        </CardContent>
      </Card>
    </div>
  );
}