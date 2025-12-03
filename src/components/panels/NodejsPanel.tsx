import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Version {
  version: string;
  isCurrent: boolean;
}

function NodejsPanel() {
  const [installedVersions, setInstalledVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setLoading(true);
        const versions = await invoke<Version[]>("get_nvm_versions");
        setInstalledVersions(versions);
      } catch (error) {
        console.error("获取 nvm 版本失败:", error);
        setInstalledVersions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, []);

  return (
    <div className="w-full">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["installed", "available"]}
      >
        <AccordionItem value="installed">
          <AccordionTrigger>已安装</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">
                加载中...
              </div>
            ) : installedVersions.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                未找到已安装的 Node.js 版本
              </div>
            ) : (
              <Table>
                <TableBody>
                  {installedVersions.map((version) => (
                    <TableRow key={version.version}>
                      <TableCell className="font-medium">{version.version}</TableCell>
                      <TableCell className="text-right">
                        <Button>{version.isCurrent ? "当前版本" : "切换"}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default NodejsPanel;

