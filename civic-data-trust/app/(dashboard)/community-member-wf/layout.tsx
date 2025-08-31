import { NavbarWf } from "@/app/components/dashboard/navbar-wf";
import { SidebarWf } from "@/app/components/dashboard/sidebar-wf";
import { CommunityProvider } from "@/app/components/contexts/community-context";
import { UserProvider } from "@/app/components/contexts/user-context";

export default function CommunityMemberWfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full min-h-screen overflow-hidden">
      <NavbarWf />

      <div className="flex h-screen bg-background">
        <SidebarWf />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
          <UserProvider>
            <CommunityProvider>
              {children}
            </CommunityProvider>
          </UserProvider>
        </main>
      </div>
    </div>
  );
}