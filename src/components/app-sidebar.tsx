import { NavLink, useLocation } from "react-router-dom";
import { Home, List, BarChart2, Search, Settings, LifeBuoy } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: Home },
  { href: "/app/sessions", label: "All Sessions", icon: List },
  { href: "/app/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/app/search", label: "Search", icon: Search },
];
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarHeader>
        <NavLink to="/app/dashboard" className="flex items-center gap-2 px-2 py-1">
          <div className="h-7 w-7 rounded-md bg-gradient-emerald" />
          <span className="text-lg font-semibold font-sora text-gradient lowercase">tracestack</span>
        </NavLink>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={location.pathname.startsWith(item.href)}>
                <NavLink to={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/app/support"><LifeBuoy className="h-5 w-5" /><span>Support</span></NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/app/settings"><Settings className="h-5 w-5" /><span>Settings</span></NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}