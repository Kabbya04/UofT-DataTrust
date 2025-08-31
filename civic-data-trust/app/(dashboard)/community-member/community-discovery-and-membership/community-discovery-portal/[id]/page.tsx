// app/(dashboard)/community-discovery-and-membership/community-discovery-portal/[id]/page.tsx

import { CommunityDetailsViewer } from "../../../../../components/community-details-viewer"

interface CommunityDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CommunityDetailsPage({ params }: CommunityDetailsPageProps) {
  const { id } = await params
  return <CommunityDetailsViewer communityId={id} />
}
