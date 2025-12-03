function SettingsPanel() {
  return (
    <div className="content-panel active">
      <div className="section-title">设置</div>

      <div className="settings-group">
        <label className="settings-label">默认 Node.js 版本</label>
        <select className="settings-select">
          <option>v18.17.0 (当前)</option>
          <option>v16.20.2</option>
          <option>v14.21.3</option>
        </select>
      </div>

      <div className="settings-group">
        <label className="settings-label">自动更新</label>
        <input type="checkbox" className="settings-checkbox" defaultChecked />
        <span>启用工具自动更新检查</span>
      </div>

      <div className="settings-group">
        <label className="settings-label">下载镜像源</label>
        <select className="settings-select">
          <option>默认源</option>
          <option>淘宝镜像 (cnpmjs.org)</option>
          <option>华为镜像 (mirrors.huaweicloud.com)</option>
          <option>阿里云镜像 (mirrors.aliyun.com)</option>
        </select>
      </div>

      <div className="settings-group">
        <label className="settings-label">日志文件位置</label>
        <input
          type="text"
          className="settings-input"
          defaultValue="/Users/yourname/.vswap/logs"
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <button className="btn btn-secondary" style={{ marginRight: "10px" }}>
          取消
        </button>
        <button className="btn btn-primary">保存设置</button>
      </div>
    </div>
  );
}

export default SettingsPanel;

