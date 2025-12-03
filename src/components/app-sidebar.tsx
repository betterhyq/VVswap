import { NavLink, useLocation } from "react-router-dom"
import { Home, Inbox, ToolCase } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Node",
    path: "/nodejs",
    icon: Home,
  },
  {
    title: "Python",
    path: "/python",
    icon: Inbox,
  }
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader>
        <h5 className="text-ms font-semibold tracking-tight">
          The JD VVswap
        </h5>
      </SidebarHeader>
      <SidebarContent>
        {/* 常用工具 */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
                <SidebarMenuItem key='tools'>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === "/tools"}
                  >
                    <NavLink to="/tools">
                      <ToolCase />
                      <span>常用工具</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* 语言版本管理 */}
        <SidebarGroup>
          <SidebarGroupLabel>语言版本管理</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.path}
                  >
                    <NavLink to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}