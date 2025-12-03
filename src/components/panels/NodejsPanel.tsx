interface Version {
  version: string;
  isCurrent?: boolean;
}

const installedVersions: Version[] = [
  { version: "v18.17.0", isCurrent: true },
  { version: "v16.20.2" },
  { version: "v14.21.3" },
];

const availableVersions: Version[] = [
  { version: "v20.5.1 (最新稳定版)" },
  { version: "v19.9.0" },
  { version: "v17.9.1" },
];

function NodejsPanel() {
  return (
    <div className="content-panel active">
      <div className="section-title">Node.js 版本管理</div>

      <div className="version-header">
        <div className="current-version">当前版本: v18.17.0</div>
        <button className="btn btn-info">刷新列表</button>
      </div>

      <div className="version-list">
        <span className="version-label">已安装版本</span>
        {installedVersions.map((v, index) => (
          <div key={index} className="version-item">
            <span>
              {v.version} {v.isCurrent && "(当前)"}
            </span>
            <button
              className="btn btn-secondary"
              disabled={v.isCurrent}
            >
              {v.isCurrent ? "当前版本" : "切换"}
            </button>
          </div>
        ))}
      </div>

      <div className="version-list">
        <span className="version-label">可安装版本</span>
        <input
          type="text"
          className="version-search"
          placeholder="搜索版本号..."
        />
        {availableVersions.map((v, index) => (
          <div key={index} className="version-item">
            <span>{v.version}</span>
            <button className="btn btn-success">安装</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NodejsPanel;

