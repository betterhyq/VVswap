import { Download, Trash2, RefreshCw } from "lucide-react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Tool {
  name: string;
  description: string;
  status: "installed" | "uninstalled";
  icon?: React.ReactNode;
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
    <Card className="transition-all hover:shadow-md flex flex-col">
      <CardHeader className="flex-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <CardTitle className="text-lg leading-tight break-words">{tool.name}</CardTitle>
            <Badge
              variant={tool.status === "installed" ? "default" : "outline"}
              className="shrink-0"
            >
              {tool.status === "installed" ? "已安装" : "未安装"}
            </Badge>
          </div>
          <CardDescription className="text-sm leading-relaxed break-words">
            {tool.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardFooter className="flex gap-2 mt-auto">
        {tool.status === "installed" ? (
          <>
            <Button variant="outline" size="sm" className="flex-1 min-w-0">
              <RefreshCw className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">更新</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 min-w-0">
              <Trash2 className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">卸载</span>
            </Button>
          </>
        ) : (
          <Button className="flex-1 w-full">
            <Download className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">安装</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function ToolsPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">工具管理</h1>
        <p className="text-muted-foreground mt-2">
          管理和安装各种开发环境版本管理工具
        </p>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <ToolCard key={index} tool={tool} />
        ))}
      </div>
    </div>
  );
}

export default ToolsPanel;

