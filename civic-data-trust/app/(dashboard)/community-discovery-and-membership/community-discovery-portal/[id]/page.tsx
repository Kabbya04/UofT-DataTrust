// app/(dashboard)/community-discovery-and-membership/community-discovery-portal/[id]/page.tsx

import { CommunityDetailsViewer } from "../../../../components/community-details-viewer";

// The custom interface has been removed.
// We now type the props directly in the function signature.
export default function CommunityDetailsPage({ params }: { params: { id: string } }) {
  return <CommunityDetailsViewer communityId={params.id} />;
}