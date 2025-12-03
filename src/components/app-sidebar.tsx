import { NavLink, useLocation } from "react-router-dom"
import { ToolCase, Code2 } from "lucide-react"
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
    title: "Node.js",
    path: "/nodejs",
    icon: Code2,
  }
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            VVswap
          </h2>
          <p className="text-xs text-muted-foreground">
            可视化多语言版本管理
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* 常用工具 */}
        <SidebarGroup>
          <SidebarGroupLabel>常用工具</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
                <SidebarMenuItem key='tools'>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === "/tools"}
                  >
                    <NavLink to="/tools">
                      <ToolCase className="h-4 w-4" />
                      <span>工具管理</span>
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
                      <item.icon className="h-4 w-4" />
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