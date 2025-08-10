import { Sidebar } from '../components/dashboard/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Apply the dashboard-theme class here
    <div className="dashboard-theme"> 
      <div className="flex h-screen w-full bg-background">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}