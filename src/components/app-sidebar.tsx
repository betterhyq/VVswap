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
import { Panel } from "@/types"

interface AppSidebarProps {
  activePanel: Panel
  onPanelChange: (panel: Panel) => void
}

// Menu items.
const items = [
  {
    title: "Node",
    panel: "nodejs" as Panel,
    icon: Home,
  },
  {
    title: "Python",
    panel: "python" as Panel,
    icon: Inbox,
  }
]

export function AppSidebar({ activePanel, onPanelChange }: AppSidebarProps) {
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
                    onClick={() => onPanelChange("tools")}
                    isActive={activePanel === "tools"}
                  >
                    <ToolCase />
                    <span>常用工具</span>
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
                    onClick={() => onPanelChange(item.panel)}
                    isActive={activePanel === item.panel}
                  >
                    <item.icon />
                    <span>{item.title}</span>
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