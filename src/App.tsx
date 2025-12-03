import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import ToolsPanel from "./components/panels/ToolsPanel";
import NodejsPanel from "./components/panels/NodejsPanel";
import PythonPanel from "./components/panels/PythonPanel";
import Layout from "./layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/tools" replace />} />
        <Route path="tools" element={<ToolsPanel />} />
        <Route path="nodejs" element={<NodejsPanel />} />
        <Route path="python" element={<PythonPanel />} />
      </Route>
    </Routes>
  );
}

export default App;
