import React, { Fragment } from "react";
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableExpandedRow,
  TableExpandHeader,
  TableExpandRow,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";
import { SeverityBadge } from "./ui/SeverityBadge";
import { VulnerabilityTable } from "./VulnerabilityTable";
import { highestSeverity } from "../util/normalizeReport";
import type { NormalizedPackage } from "../util/types";

interface Props {
  packages: NormalizedPackage[];
}

const headers = [
  { key: "name", header: "Dependency" },
  { key: "version", header: "Version" },
  { key: "severity", header: "Severity" },
  { key: "vulnCount", header: "CVEs" },
  { key: "exploit", header: "Exploit?" },
  { key: "fixVersion", header: "Fix Version" },
];

export const PackageTable = ({ packages }: Props) => {
  const rows = packages.map((pkg) => ({
    id: pkg.id,
    name: pkg.name || "-",
    version: pkg.version || "-",
    severity: highestSeverity(pkg.vulnerabilities.map((v) => v.severity)),
    vulnCount: pkg.vulnerabilities.length,
    exploit: pkg.hasExploit ? "Yes" : "No",
    fixVersion:
      pkg.vulnerabilities.find((v) => v.fixVersion)?.fixVersion || "-",
  }));

  const pkgMap = new Map(packages.map((p) => [p.id, p]));

  return (
    <DataTable rows={rows} headers={headers} isSortable size="md">
      {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              <TableExpandHeader />
              {headers.map((header) => (
                <TableHeader {...getHeaderProps({ header })} key={header.key}>
                  {header.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const pkg = pkgMap.get(row.id);
              return (
                <Fragment key={row.id}>
                  <TableExpandRow
                    {...getRowProps({ row })}
                    className={row.isExpanded ? "pkg-row--expanded" : "pkg-row"}
                  >
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.info.header === "severity" ? (
                          <SeverityBadge severity={cell.value} />
                        ) : (
                          cell.value
                        )}
                      </TableCell>
                    ))}
                  </TableExpandRow>
                  {row.isExpanded && pkg && (
                    <TableExpandedRow
                      colSpan={headers.length + 1}
                      className="pkg-expanded-row"
                    >
                      <VulnerabilityTable
                        vulnerabilities={pkg.vulnerabilities}
                      />
                    </TableExpandedRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      )}
    </DataTable>
  );
};
