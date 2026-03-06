const colorCodes: Record<string, { bg: string; text: string }> = {
  critical: { bg: "#ff858a", text: "#a6383e" },
  high: { bg: "#ffd7d9", text: "#c56065" },
  medium: { bg: "#f1c21b", text: "#815616" },
  moderate: { bg: "#fddc69", text: "#c38a34" },
  low: { bg: "#0043ce", text: "#fff" },
  info: { bg: "#4589ff", text: "#fff" },
  unknown: { bg: "#8d8d8d", text: "#fff" },
};

export const SeverityBadge = ({ severity }: { severity: string }) => {
  const key = severity.toLowerCase();
  const colors = colorCodes[key] || colorCodes.unknown;
  return (
    <span
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: "4px 12px",
        borderRadius: "12px",
        fontSize: "0.6rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        whiteSpace: "nowrap",
      }}
    >
      {severity.slice(0, 1).toUpperCase() + severity.slice(1).toLowerCase()}
    </span>
  );
};
