import { CommunityDetailsWF } from "../../../../components/community-details-wf"
import { SharedNavigationWF } from "../../../../components/shared-navigation-wf"

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