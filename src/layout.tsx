import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Panel } from "@/types"

interface LayoutProps {
  children: React.ReactNode
  activePanel: Panel
  onPanelChange: (panel: Panel) => void
}

export default function Layout({ children, activePanel, onPanelChange }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar activePanel={activePanel} onPanelChange={onPanelChange} />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}