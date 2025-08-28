// app/(dashboard)/community-member-wf/community-details/[id]/page.tsx

import CommunityDetailsView from "./community-details-view";

export default function CommunityDetailsPage({ params }: { params: { id: string } }) {
  return <CommunityDetailsView id={params.id} />;
}