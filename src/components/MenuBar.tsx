function MenuBar() {
  return (
    <div className="menu-bar">
      <div className="menu-item">文件</div>
      <div className="menu-item">编辑</div>
      <div className="menu-item">查看</div>
      <div className="menu-item">帮助</div>
      <div className="window-controls">
        <div className="window-control">-</div>
        <div className="window-control">□</div>
        <div className="window-control close-btn">×</div>
      </div>
    </div>
  );
}

export default MenuBar;

