import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
// import { Progress } from "@/app/components/ui/progress"; // Removed: Progress component does not exist
import { UserCheck, ShieldCheck } from "lucide-react";

export default function ComplianceTrackingPage() {
  // Check if you have a progress component, if not, this part can be a simple text display
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-mono-caps">Compliance Tracking</h1>
        <p className="text-muted-foreground mt-2 font-mono">Monitor user agreement with the latest Terms & Conditions.</p>
      </div>

      <Card className="bg-card dark:bg-neutral-900 border border-border dark:border-neutral-800 rounded-xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <UserCheck className="w-8 h-8 text-primary"/>
          <div>
            <CardTitle className="text-mono-caps">Version 2.1 Agreement</CardTitle>
            <p className="text-sm text-muted-foreground font-mono mt-1">Percentage of active users who have accepted the latest T&C.</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center font-mono text-lg">
            <p>Adoption Rate:</p>
            <p className="font-bold text-2xl text-primary">98.7%</p>
          </div>
          {/* Progress bar removed due to missing Progress component */}
        </CardContent>
      </Card>
    </div>
  );
}