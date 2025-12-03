interface Tool {
  name: string;
  description: string;
  status: "installed" | "uninstalled";
}

const tools: Tool[] = [
  {
    name: "nvm (Node.js 版本管理)",
    description: "Node Version Manager - 用于管理多个 Node.js 版本的工具",
    status: "installed",
  },
  {
    name: "pyenv (Python 版本管理)",
    description: "Python Version Management - 用于管理多个 Python 版本的工具",
    status: "uninstalled",
  },
  {
    name: "jEnv (Java 版本管理)",
    description: "Java Environment Manager - 用于管理多个 Java 版本的工具",
    status: "uninstalled",
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div className="tool-card">
      <div className="tool-header">
        <div className="tool-name">{tool.name}</div>
        <div
          className={`tool-status ${
            tool.status === "installed" ? "status-installed" : "status-uninstalled"
          }`}
        >
          {tool.status === "installed" ? "已安装" : "未安装"}
        </div>
      </div>
      <div className="tool-desc">{tool.description}</div>
      <div className="tool-actions">
        {tool.status === "installed" ? (
          <>
            <button className="btn btn-success">更新</button>
            <button className="btn btn-secondary">卸载</button>
          </>
        ) : (
          <button className="btn btn-primary">安装</button>
        )}
      </div>
    </div>
  );
}

function ToolsPanel() {
  return (
    <div className="content-panel active">
      <div className="section-title">工具管理</div>
      {tools.map((tool, index) => (
        <ToolCard key={index} tool={tool} />
      ))}
    </div>
  );
}

export default ToolsPanel;

