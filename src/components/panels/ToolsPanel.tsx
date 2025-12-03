import { Package, Download, Trash2, RefreshCw } from "lucide-react"
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
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{tool.name}</CardTitle>
              <CardDescription className="mt-1">
                {tool.description}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={tool.status === "installed" ? "default" : "outline"}
            className="shrink-0"
          >
            {tool.status === "installed" ? "已安装" : "未安装"}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex gap-2">
        {tool.status === "installed" ? (
          <>
            <Button variant="outline" size="sm" className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              更新
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" />
              卸载
            </Button>
          </>
        ) : (
          <Button className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            安装
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <ToolCard key={index} tool={tool} />
        ))}
      </div>
    </div>
  );
}

export default ToolsPanel;

