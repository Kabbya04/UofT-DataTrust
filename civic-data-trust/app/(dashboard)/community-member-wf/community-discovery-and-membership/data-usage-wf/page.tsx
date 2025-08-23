import { DataUsageWF } from "@/app/components/data-usage-wf"
import { SharedNavigationWF } from "@/app/components/shared-navigation-wf"

export default function DataUsagePage() {
  return (
    <SharedNavigationWF>
      <DataUsageWF />
    </SharedNavigationWF>
  )
}