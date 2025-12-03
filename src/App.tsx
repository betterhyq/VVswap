import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import StatusBar from "./components/StatusBar";
import ToolsPanel from "./components/panels/ToolsPanel";
import NodejsPanel from "./components/panels/NodejsPanel";
import PythonPanel from "./components/panels/PythonPanel";
import StatusPanel from "./components/panels/StatusPanel";
import SettingsPanel from "./components/panels/SettingsPanel";
import { Panel } from "./types";

function App() {
  const [activePanel, setActivePanel] = useState<Panel>("tools");

  const handlePanelChange = (panel: Panel) => {
    setActivePanel(panel);
  };

  const renderPanel = () => {
    switch (activePanel) {
      case "tools":
        return <ToolsPanel />;
      case "nodejs":
        return <NodejsPanel />;
      case "python":
        return <PythonPanel />;
      case "status":
        return <StatusPanel />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <ToolsPanel />;
    }
  };

  return (
    <div className="app-container">

      <div className="main-container">
        <Sidebar activePanel={activePanel} onPanelChange={handlePanelChange} />

        <div className="content-area">{renderPanel()}</div>
      </div>

      <StatusBar />
    </div>
  );
}

export default App;
