import { CommunityProvider } from "@/app/components/contexts/community-context";
import { UserProvider } from "@/app/components/contexts/user-context";
import { NavbarWf } from "@/app/components/dashboard/navbar-wf";
import { SidebarWf } from "@/app/components/dashboard/sidebar-wf";
import { Provider } from "@radix-ui/react-tooltip";

export default function SuperAdminWfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden" style={{ backgroundColor: '#F1F1F1' }}>
      <NavbarWf />
      {/* This container will grow to fill the remaining space */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarWf />
        {/* The main content area is now the only part that scrolls */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8 rounded-tl-4xl rounded-tr-4xl bg-card border border-border mx-4 mt-1 scrollbar-hidden shadow-sm">
          <UserProvider>
            <CommunityProvider>
              <Provider>
                {children}
              </Provider>
            </CommunityProvider>
          </UserProvider>
        </main>
      </div>
    </div>
  );
}