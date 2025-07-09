import HeaderBar from "@/components/Headerbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <HeaderBar />
          <main className="flex-1 overflow-y-auto bg-muted/40 p-6">
            <div className="max-w-7xl w-full mx-auto min-h-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
