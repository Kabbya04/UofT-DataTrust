import { CommunityDetailsWF } from "@/app/components/community-details-wf"

interface CommunityDetailsPageProps {
  params: {
    id: string
  }
}

export default function CommunityDetailsPage({ params }: CommunityDetailsPageProps) {
  return <CommunityDetailsWF communityId={params.id} />
}