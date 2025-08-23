import { NavbarWf } from "@/app/components/dashboard/navbar-wf";
import { SidebarWf } from "@/app/components/dashboard/sidebar-wf";

export default function ResearcherWfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <SidebarWf />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavbarWf />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}