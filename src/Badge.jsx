const mono = "'JetBrains Mono','Fira Code','SF Mono',monospace";

const Badge = ({ children, color, bg }) => (
  <span style={{
    fontSize: 10.5, padding: "3px 9px", borderRadius: 5,
    background: bg || "rgba(128,128,128,0.08)",
    color: color || "#888",
    fontFamily: mono, fontWeight: 500,
  }}>{children}</span>
);

export default Badge;
