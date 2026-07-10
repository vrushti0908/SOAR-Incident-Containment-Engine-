import CardShell from "../components/CardShell";

const playbooks = [
  {
    name: "High Risk - Auto Containment",
    description: "Triggers when risk score is above 75. Isolates host and blocks source IP automatically.",
    steps: ["Collect IOC", "Threat intel", "Check reputation", "Isolate host", "Block IP", "Notify analyst"],
    status: "Active",
  },
  {
    name: "Brute Force Response",
    description: "Triggers on repeated failed login attempts from a single IP within 5 minutes.",
    steps: ["Detect pattern", "Check threat intel score", "Block IP on firewall", "Notify analyst"],
    status: "Active",
  },
  {
    name: "Malware Containment",
    description: "Triggers when malware signature is matched on an endpoint via EDR.",
    steps: ["Detect signature", "Isolate endpoint", "Quarantine file", "Alert SOC team"],
    status: "Active",
  },
  {
    name: "Phishing Response",
    description: "Triggers when a phishing email is reported by a user.",
    steps: ["Analyze email", "Check sender reputation", "Quarantine email", "Notify users"],
    status: "Draft",
  },
];

export default function PlaybooksPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {playbooks.map((pb) => (
        <CardShell
          key={pb.name}
          title={pb.name}
          action={
            <span
              style={{
                background: pb.status === "Active" ? "var(--color-success-bg)" : "var(--color-warning-bg)",
                color: pb.status === "Active" ? "var(--color-low)" : "var(--color-high)",
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 5,
              }}
            >
              {pb.status}
            </span>
          }
        >
          <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginBottom: 16 }}>
            {pb.description}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {pb.steps.map((s, idx) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    background: "var(--bg-page)",
                    border: "1px solid var(--border-light)",
                    borderRadius: 6,
                    padding: "5px 12px",
                    fontSize: 11.5,
                  }}
                >
                  {s}
                </span>
                {idx < pb.steps.length - 1 && (
                  <span style={{ color: "var(--text-muted)" }}>{"\u2192"}</span>
                )}
              </div>
            ))}
          </div>
        </CardShell>
      ))}
    </div>
  );
}