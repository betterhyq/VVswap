import { Panel } from "../types";

interface SidebarProps {
  activePanel: Panel;
  onPanelChange: (panel: Panel) => void;
}

const sidebarItems: { id: Panel; icon: string; label: string }[] = [
  { id: "tools", icon: "⚙️", label: "工具管理" },
  { id: "nodejs", icon: "🔄", label: "Node.js 版本" },
  { id: "python", icon: "🐍", label: "Python 版本" },
  { id: "status", icon: "📊", label: "系统状态" },
  { id: "settings", icon: "⚙️", label: "设置" },
];

function Sidebar({ activePanel, onPanelChange }: SidebarProps) {
  return (
    <div className="sidebar">
      {sidebarItems.map((item) => (
        <div
          key={item.id}
          className={`sidebar-item ${activePanel === item.id ? "active" : ""}`}
          onClick={() => onPanelChange(item.id)}
        >
          <span>{item.icon}</span> {item.label}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;

