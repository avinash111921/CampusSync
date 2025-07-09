import {
  Home,
  Users,
  BookOpen,
  BookPlus,
  LogOut,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminContext } from "../context/AdminContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Students", icon: Users, href: "/students" },
  { name: "Courses", icon: BookOpen, href: "/courses" },
  { name: "Enroll Student", icon: BookPlus, href: "/student/enrollCourse" },
  { name: "CGPA Management", icon: BookPlus, href: "/cgpa" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAdmin } = useAdminContext();
  const handleLogout = () => {
    logoutAdmin();   
    navigate("/login");
  };

  return (
    <Sidebar className="h-screen  border-r bg-background">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ name, icon: Icon, href }) => (
                <SidebarMenuItem key={name}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md w-full transition-colors ${
                        location.pathname === href
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md w-full text-destructive hover:bg-muted"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
