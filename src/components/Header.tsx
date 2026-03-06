export const Header = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "1200px",
        margin: "auto",
        gap: "12px",
      }}
    >
      <h1>OpenMRS Dependency Vulnerability Report</h1>
      <div className="dashboard_divider" />
      <p>
        A summary of known security vulnerabilities detected across OpenMRS
        modules by automated dependency scanning. Each module lists its
        vulnerable dependencies severity levels, and recommeded fix versions to
        help maintainers prioritize upgrades.
      </p>
    </div>
  );
};
