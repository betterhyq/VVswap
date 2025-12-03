interface StatusCard {
  name: string;
  value: string;
  description: string;
}

const systemStatus: StatusCard[] = [
  {
    name: "操作系统",
    value: "macOS 13.4",
    description: "Darwin Kernel Version 22.5.0",
  },
  {
    name: "架构",
    value: "x86_64",
    description: "64位处理器",
  },
  {
    name: "当前 Node.js",
    value: "v18.17.0",
    description: "通过 nvm 管理",
  },
  {
    name: "当前 Python",
    value: "2.7.18",
    description: "系统默认版本",
  },
];

const installedTools: StatusCard[] = [
  {
    name: "nvm",
    value: "0.39.3",
    description: "Node.js 版本管理",
  },
  {
    name: "npm",
    value: "9.6.7",
    description: "Node 包管理器",
  },
  {
    name: "yarn",
    value: "1.22.19",
    description: "替代 npm 的包管理器",
  },
];

function StatusCard({ card }: { card: StatusCard }) {
  return (
    <div className="status-card">
      <div className="status-name">{card.name}</div>
      <div className="status-value">{card.value}</div>
      <div className="status-desc">{card.description}</div>
    </div>
  );
}

function StatusPanel() {
  return (
    <div className="content-panel active">
      <div className="section-title">系统状态</div>

      <div className="status-grid">
        {systemStatus.map((status, index) => (
          <StatusCard key={index} card={status} />
        ))}
      </div>

      <div className="section-title" style={{ marginTop: "20px" }}>
        已安装工具
      </div>
      <div className="status-grid">
        {installedTools.map((tool, index) => (
          <StatusCard key={index} card={tool} />
        ))}
      </div>
    </div>
  );
}

export default StatusPanel;

