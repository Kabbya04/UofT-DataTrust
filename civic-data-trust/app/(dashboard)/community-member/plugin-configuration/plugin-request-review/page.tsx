import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Check, X, Puzzle, User } from "lucide-react";

const PluginRequestItem = ({ pluginName, requestedBy, description }: { pluginName: string; requestedBy: string; description: string }) => (
  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center border-b border-border/50 dark:border-neutral-800 p-4 last:border-b-0">
    <div className="flex items-center gap-3">
      <Puzzle className="w-8 h-8 text-primary shrink-0" />
      <div>
        <p className="font-semibold text-mono-caps">{pluginName}</p>
        <p className="text-sm text-muted-foreground font-mono flex items-center gap-1.5"><User className="w-3 h-3"/> Requested by {requestedBy}</p>
      </div>
    </div>
    <div className="flex-1 text-sm text-muted-foreground font-mono italic">
      &ldquo;{description}&rdquo;
    </div>
    <div className="flex items-center gap-2 mt-2 md:mt-0 ml-auto">
      <Button variant="ghost" size="sm" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-400"><Check className="w-4 h-4 mr-2"/> Approve</Button>
      <Button variant="ghost" size="sm" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400"><X className="w-4 h-4 mr-2"/> Deny</Button>
    </div>
  </div>
);


export default function PluginRequestReviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-mono-caps">Plugin Request Review</h1>
        <p className="text-muted-foreground mt-2 font-mono">Review and approve new third-party plugins for the platform.</p>
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-mono-caps">Pending Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <PluginRequestItem pluginName="Advanced Geo-Spatial Analyzer" requestedBy="Urban Planning Dept." description="Needed for mapping transit efficiency against population density." />
          <PluginRequestItem pluginName="Statistical Modeler (R-Lang)" requestedBy="UofT Research Group" description="Required for academic study on economic trends." />
        </CardContent>
      </Card>
    </div>
  );
}