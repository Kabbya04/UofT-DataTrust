import { NavbarWf } from "@/app/components/dashboard/navbar-wf";
import { SidebarWf } from "@/app/components/dashboard/sidebar-wf";

export default function ProjectAdminWfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Using the existing, now-dynamic sidebar */}
      <SidebarWf />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Using the existing, now-dynamic navbar */}
        <NavbarWf />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}