function PythonPanel() {
  return (
    <div className="content-panel active">
      <div className="section-title">Python 版本管理</div>

      <div className="version-header">
        <div
          className="current-version"
          style={{ backgroundColor: "#ffebee", color: "#c62828" }}
        >
          请先安装 pyenv 工具
        </div>
        <button className="btn btn-info">刷新列表</button>
      </div>

      <div style={{ textAlign: "center", padding: "30px 0", color: "#666" }}>
        <p>安装 pyenv 后即可管理 Python 版本</p>
        <button className="btn btn-primary" style={{ marginTop: "15px" }}>
          安装 pyenv
        </button>
      </div>
    </div>
  );
}

export default PythonPanel;

