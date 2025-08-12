import { ActionCard } from "@/app/components/dashboard/ActionCard";
import { EyeOff, Fingerprint, Blend, SlidersHorizontal } from "lucide-react";

export default function DataExposeControlPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-mono-caps">Data Expose Control</h1>
        <p className="text-muted-foreground mt-2 font-mono">Configure plugins to protect sensitive information automatically.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          href="#"
          icon={EyeOff}
          title="Data Masking"
          description="Set rules to automatically redact sensitive fields like names or addresses."
        />
        <ActionCard
          href="#"
          icon={Fingerprint}
          title="Anonymization"
          description="Configure k-anonymity and l-diversity parameters for datasets."
        />
        <ActionCard
          href="#"
          icon={Blend}
          title="Differential Privacy"
          description="Adjust the noise levels for queries to provide privacy guarantees."
        />
      </div>
    </div>
  );
}