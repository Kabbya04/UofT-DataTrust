import { MyCommunitiesWF } from "@/app/components/my-communities-wf"
import { SharedNavigationWF } from "@/app/components/shared-navigation-wf"

export default function MyCommunitiesPage() {
  return (
    <SharedNavigationWF>
      <MyCommunitiesWF />
    </SharedNavigationWF>
  )
}