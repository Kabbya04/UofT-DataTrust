import { JoinCommunityRequestWF } from "@/app/components/join-community-request-wf"
import { SharedNavigationWF } from "@/app/components/shared-navigation-wf"

export default function JoinCommunityPage() {
  return (
    <SharedNavigationWF>
      <JoinCommunityRequestWF />
    </SharedNavigationWF>
  )
}