import type {
  NormalizedPackage,
  NormalizedReport,
  NormalizedVulnerability,
  OwaspDependency,
  OwaspReport,
} from "./types";

const SEVERITY_ORDER: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  moderate: 2,
  low: 1,
  info: 0,
  unknown: -1,
};

function severityRank(severity: string): number {
  return SEVERITY_ORDER[severity.toLowerCase()] ?? -1;
}

/** Extract package name from package ID (e.g., "pkg:javascript/jquery@1.7.1" → "jquery") */
function extractPackageName(packageId?: string): string | null {
  if (!packageId) return null;
  // Format: pkg:type/name@version
  const match = packageId.match(/\/([^@]+)@/);
  return match ? match[1] : null;
}

/** Extract version from package ID (e.g., "pkg:javascript/jquery@1.7.1" → "1.7.1") */
function extractPackageVersion(packageId?: string): string {
  if (!packageId) return "";
  // Format: pkg:type/name@version
  const match = packageId.match(/@(.+)$/);
  return match ? match[1] : "";
}

/** Return the highest severity string from a list */
export function highestSeverity(severities: string[]): string {
  if (severities.length === 0) return "Unknown";
  return severities.reduce((a, b) =>
    severityRank(a) >= severityRank(b) ? a : b,
  );
}

/** Build a readable affected-version range from vulnerableSoftware entries */
function buildVersionRange(sw: {
  versionStartIncluding?: string;
  versionEndExcluding?: string;
  versionEndIncluding?: string;
}): string {
  const parts: string[] = [];
  if (sw.versionStartIncluding) parts.push(`≥${sw.versionStartIncluding}`);
  if (sw.versionEndExcluding) parts.push(`<${sw.versionEndExcluding}`);
  if (sw.versionEndIncluding) parts.push(`≤${sw.versionEndIncluding}`);
  return parts.length ? parts.join(" & ") : "";
}

/** Normalize an OWASP dependency-check report into the dashboard model */
export function normalizeReport(
  data: unknown,
  fallbackName: string,
): NormalizedReport {
  const report = data as OwaspReport;
  const projectName =
    report.projectInfo?.name || fallbackName || "Unknown Project";
  const deps: OwaspDependency[] = report.dependencies ?? [];

  const packages: NormalizedPackage[] = [];
  let idx = 0;

  for (const dep of deps) {
    if (!dep.vulnerabilities || dep.vulnerabilities.length === 0) continue;

    let pkgHasExploit = false;

    // Extract package name from packages array, fall back to fileName
    const packageName =
      extractPackageName(dep.packages?.[0]?.id) || dep.fileName || "Unknown";

    // Extract version from package ID
    const packageVersion = extractPackageVersion(dep.packages?.[0]?.id);

    const normalizedVulns: NormalizedVulnerability[] = dep.vulnerabilities.map(
      (v) => {
        // Prefer cvssv3 over cvssv2
        const severity = v.cvssv3?.baseSeverity || v.severity || "Unknown";
        const score = v.cvssv3?.baseScore ?? v.cvssv2?.score ?? null;

        // CWE from cwes array, filter out generic entries
        const cwe =
          v.cwes
            ?.filter((c) => c !== "NVD-CWE-noinfo" && c !== "NVD-CWE-Other")
            .join(", ") || undefined;

        // Exploit flag: true if any reference name contains "EXPLOIT"
        const exploit =
          v.references?.some((r) => r.name?.includes("EXPLOIT")) ?? false;
        if (exploit) pkgHasExploit = true;

        // NVD link
        const nvdRef = v.references?.find((r) =>
          r.url?.includes("nvd.nist.gov"),
        );

        // Pick matched vulnerableSoftware entry, or first with versionEndExcluding
        const matchedSw =
          v.vulnerableSoftware?.find(
            (s) => s.software?.vulnerabilityIdMatched === "true",
          ) ??
          v.vulnerableSoftware?.find((s) => s.software?.versionEndExcluding);

        const affectedVersions = matchedSw?.software
          ? buildVersionRange(matchedSw.software)
          : undefined;

        const fixVersion =
          matchedSw?.software?.versionEndExcluding || undefined;

        return {
          id: v.name || "Unknown",
          severity,
          score,
          description: v.description,
          cwe,
          url: nvdRef?.url,
          exploit,
          affectedVersions,
          fixVersion,
        };
      },
    );

    packages.push({
      id: `${projectName}-pkg-${idx++}`,
      name: packageName,
      version: packageVersion,
      vulnerabilities: normalizedVulns,
      hasExploit: pkgHasExploit,
    });
  }

  const allSeverities = packages.flatMap((p) =>
    p.vulnerabilities.map((v) => v.severity),
  );

  return {
    id: projectName,
    projectName,
    highestSeverity: highestSeverity(allSeverities),
    packages,
  };
}
