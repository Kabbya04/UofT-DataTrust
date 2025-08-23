import { CommunityDetailsWF } from "@/app/components/community-details-wf"
import { SharedNavigationWF } from "@/app/components/shared-navigation-wf"

interface CommunityDetailsPageProps {
  params: {
    id: string
  }
}

export default function CommunityDetailsPage({ params }: CommunityDetailsPageProps) {
  return (
    <SharedNavigationWF>
      <CommunityDetailsWF communityId={params.id} />
    </SharedNavigationWF>
  )
}