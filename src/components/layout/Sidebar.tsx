
import { HomeIcon, PackageIcon, BarChart3Icon, UsersIcon, Settings2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", icon: HomeIcon, href: "/" },
  { title: "Products", icon: PackageIcon, href: "/products" },
  { title: "Analytics", icon: BarChart3Icon, href: "/analytics" },
  { title: "Team", icon: UsersIcon, href: "/team" },
  { title: "Settings", icon: Settings2Icon, href: "/settings" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-4 py-6">
          <h1 className="text-xl font-bold text-purple-500">ProductHub</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href} className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                      "hover:bg-purple-50 hover:text-purple-500"
                    )}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
