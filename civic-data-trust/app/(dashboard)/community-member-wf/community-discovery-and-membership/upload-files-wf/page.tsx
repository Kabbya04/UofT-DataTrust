import { UploadFilesWF } from "@/app/components/upload-files-wf"
import { SharedNavigationWF } from "@/app/components/shared-navigation-wf"

export default function UploadFilesPage() {
  return (
    <SharedNavigationWF>
      <UploadFilesWF />
    </SharedNavigationWF>
  )
}