
import { CommunityDetailsViewer } from "../../../../components/community-details-viewer"

// interface PageProps {
//   params: { id: string }
// }

// ✅ Keep params as a plain object
// ✅ Explicitly mark it async only if needed for data fetching
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CommunityDetailsPage({ params }: any) {
  return <CommunityDetailsViewer communityId={params.id} />
}











// import { CommunityDetailsViewer } from "../../../../components/community-details-viewer"


// interface CommunityDetailsPageProps {
//   params: {
//     id: string
//   }
// }

// export default function CommunityDetailsPage({ params }: CommunityDetailsPageProps) {
//   return <CommunityDetailsViewer communityId={params.id} />
// }
