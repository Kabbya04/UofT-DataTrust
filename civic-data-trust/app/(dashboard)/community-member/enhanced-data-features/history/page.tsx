import { ActionCard } from "@/app/components/dashboard/ActionCard";
import { History, GitMerge, FileClock } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-mono-caps">Data Lineage & History</h1>
        <p className="text-muted-foreground mt-2 font-mono">Trace the complete lifecycle of data across the platform.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          href="/data-center/data-history"
          icon={History}
          title="Dataset Versioning"
          description="View the change history and previous versions of a specific dataset."
        />
        <ActionCard
          href="#"
          icon={GitMerge}
          title="Data Lineage Graph"
          description="Visually trace how datasets are combined, transformed, and used."
        />
        <ActionCard
          href="/request-center/request-history"
          icon={FileClock}
          title="Access Request History"
          description="Review the complete log of who accessed what data, and when."
        />
      </div>
    </div>
  );
}