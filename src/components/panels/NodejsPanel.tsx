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
  isCurrent?: boolean;
}

const installedVersions: Version[] = [
  { version: "v18.17.0", isCurrent: true },
  { version: "v16.20.2" },
  { version: "v14.21.3" },
];

function NodejsPanel() {
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
            <Table>
              <TableBody>
                {installedVersions.map((invoice) => (
                  <TableRow key={invoice.version}>
                    <TableCell className="font-medium">{invoice.version}</TableCell>
                    <TableCell className="text-right">
                      <Button>{invoice.isCurrent ? "当前版本" : "切换"}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default NodejsPanel;

