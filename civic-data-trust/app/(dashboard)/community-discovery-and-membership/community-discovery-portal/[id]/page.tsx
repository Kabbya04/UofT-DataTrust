import { CommunityDetailsViewer } from "../../../../components/community-details-viewer"


interface CommunityDetailsPageProps {
  params: {
    id: string
  }
}

export default function CommunityDetailsPage({ params }: CommunityDetailsPageProps) {
  return <CommunityDetailsViewer communityId={params.id} />
}
