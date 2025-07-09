import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export default function HeaderBar() {
  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-white shadow-sm">
      <SidebarTrigger>
        <Menu className="w-6 h-6 text-muted-foreground" />
      </SidebarTrigger>
      <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
    </header>
  );
}
