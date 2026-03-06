import depCheckIdgen from "../../data/dependency-check-reports/dependency-check-report.json";
import depCheckCore from "../../data/dependency-check-reports/dependency-check-report (2).json";
import depCheckBilling from "../../data/dependency-check-reports/dependency-check-report (3).json";
import { normalizeReport } from "./normalizeReport";
import type { NormalizedReport } from "./types";

export const normalizedReports: NormalizedReport[] = [
  normalizeReport(depCheckCore, "openmrs-core"),
  normalizeReport(depCheckBilling, "openmrs-module-billing"),
  normalizeReport(depCheckIdgen, "openmrs-module-idgen"),
];
