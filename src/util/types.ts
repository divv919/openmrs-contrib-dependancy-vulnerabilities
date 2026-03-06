/** Normalized types used across the dashboard */

export interface NormalizedVulnerability {
  id: string;
  severity: string;
  score: number | null;
  description?: string;
  affectedVersions?: string;
  fixVersion?: string;
  cwe?: string;
  url?: string;
  exploit: boolean;
}

export interface NormalizedPackage {
  id: string;
  name: string;
  version: string;
  vulnerabilities: NormalizedVulnerability[];
  hasExploit: boolean;
}

export interface NormalizedReport {
  id: string;
  projectName: string;
  highestSeverity: string;
  packages: NormalizedPackage[];
}

/** OWASP dependency-check native format (dependency-check-report*.json) */
export interface OwaspCvssV2 {
  score?: number;
  severity?: string;
}

export interface OwaspCvssV3 {
  baseScore?: number;
  baseSeverity?: string;
}

export interface OwaspVulnerability {
  source?: string;
  name?: string;
  severity?: string;
  description?: string;
  cwes?: string[];
  cvssv3?: OwaspCvssV3;
  cvssv2?: OwaspCvssV2;
  references?: { source?: string; url?: string; name?: string }[];
  vulnerableSoftware?: {
    software?: {
      id?: string;
      versionEndExcluding?: string;
      versionEndIncluding?: string;
      versionStartIncluding?: string;
      vulnerabilityIdMatched?: string;
    };
  }[];
}

export interface OwaspDependency {
  fileName?: string;
  filePath?: string;
  packages?: { id?: string; confidence?: string }[];
  vulnerabilities?: OwaspVulnerability[];
}

export interface OwaspReport {
  reportSchema?: string;
  projectInfo?: { name?: string };
  dependencies?: OwaspDependency[];
}
