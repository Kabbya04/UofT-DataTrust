import type { Metadata } from "next"
import AuditLogsPage from "../../../components/dashboard/audit-logs-page"

export const metadata: Metadata = {
  title: "Audit Logs",
  description: "View system audit logs and activity history",
}

export default function Page() {
  return <AuditLogsPage />
}
