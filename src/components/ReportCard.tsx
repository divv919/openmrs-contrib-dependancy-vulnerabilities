import { useState } from "react";
import { SeverityBadge } from "./ui/SeverityBadge";
import { PackageTable } from "./PackageTable";
import type { NormalizedReport } from "../util/types";
import { ChevronDown, ChevronUp } from "@carbon/icons-react";
interface Props {
  report: NormalizedReport;
}

export const ReportCard = ({ report }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="report-card">
      <div
        className="report-card__header"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
      >
        <div className="report-card__info">
          <span className="report-card__name">{report.projectName}</span>
          <SeverityBadge severity={report.highestSeverity} />
        </div>
        <div className="report-card__meta">
          <span>{expanded ? <ChevronUp /> : <ChevronDown />}</span>
        </div>
      </div>
      {expanded && (
        <div className="report-card__body">
          <PackageTable packages={report.packages} />
        </div>
      )}
    </div>
  );
};
