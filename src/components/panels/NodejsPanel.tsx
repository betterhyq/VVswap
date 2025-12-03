import { useEffect, useState } from "react";
import { Code2, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHead,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getNvmVersions, switchNodeVersion } from "@/bridge"
import type { NodeVersion } from "@/bridge/types"

function NodejsPanel() {
  const [installedVersions, setInstalledVersions] = useState<NodeVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState<string | null>(null);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const versions = await getNvmVersions();
      setInstalledVersions(versions);
    } catch (error) {
      console.error("获取 nvm 版本失败:", error);
      setInstalledVersions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const handleSwitchVersion = async (version: string) => {
    if (switching) return; // 防止重复点击
    
    try {
      setSwitching(version);
      await switchNodeVersion(version);
      // 切换成功后刷新版本列表
      await fetchVersions();
    } catch (error) {
      console.error("切换版本失败:", error);
      alert(`切换版本失败: ${error}`);
    } finally {
      setSwitching(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Code2 className="h-8 w-8 text-primary" />
          Node.js 版本管理
        </h1>
        <p className="text-muted-foreground mt-2">
          管理和切换已安装的 Node.js 版本
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>已安装版本</CardTitle>
              <CardDescription>
                当前系统已安装的 Node.js 版本列表
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchVersions}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-9 w-20" />
                </div>
              ))}
            </div>
          ) : installedVersions.length === 0 ? (
            <div className="text-center py-12">
              <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg font-medium">
                未找到已安装的 Node.js 版本
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                请先使用 nvm 安装 Node.js 版本
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>版本号</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installedVersions.map((version) => (
                  <TableRow key={version.version}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{version.version}</span>
                        {version.isCurrent && (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            当前版本
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleSwitchVersion(version.version)}
                        disabled={version.isCurrent || switching === version.version}
                        size="sm"
                        variant={version.isCurrent ? "secondary" : "default"}
                      >
                        {switching === version.version ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            切换中...
                          </>
                        ) : version.isCurrent ? (
                          "当前版本"
                        ) : (
                          "切换"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default NodejsPanel;

