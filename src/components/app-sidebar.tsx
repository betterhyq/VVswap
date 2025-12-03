import { Calendar, Home, Inbox, Search, Settings, ToolCase } from "lucide-react"
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
    url: "#",
    icon: Home,
  },
  {
    title: "Python",
    url: "#",
    icon: Inbox,
  }
]

export function AppSidebar() {
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
                  <SidebarMenuButton asChild>
                    <a href='#'>
                      <ToolCase />
                      <span>常用工具</span>
                    </a>
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
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
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
  )
}