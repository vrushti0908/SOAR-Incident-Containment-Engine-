import CardShell from "../components/CardShell";

const rules = [
  { ip: "185.220.101.1", reason: "Malware C2 communication", addedBy: "Auto playbook", time: "2 min ago", status: "Active" },
  { ip: "45.12.56.78", reason: "Brute force - repeated failed logins", addedBy: "Auto playbook", time: "5 min ago", status: "Active" },
  { ip: "91.23.66.10", reason: "Ransomware indicator", addedBy: "Auto playbook", time: "12 min ago", status: "Active" },
  { ip: "78.142.19.3", reason: "Manual block - suspicious scanning", addedBy: "Bob", time: "1 hour ago", status: "Active" },
  { ip: "12.45.67.89", reason: "False positive - whitelisted", addedBy: "Vrushti", time: "1 day ago", status: "Removed" },
];

export default function FirewallRulesPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <CardShell
        title={`Blocked IP addresses (${rules.filter((r) => r.status === "Active").length} active)`}
      >
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>IP address</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Reason</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Added by</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Time</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Status</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}></th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.ip} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "10px 0", color: "var(--accent-purple)" }}>{r.ip}</td>
                <td style={{ padding: "10px 0", color: "var(--text-secondary)" }}>{r.reason}</td>
                <td style={{ padding: "10px 0" }}>{r.addedBy}</td>
                <td style={{ padding: "10px 0", color: "var(--text-muted)" }}>{r.time}</td>
                <td style={{ padding: "10px 0" }}>
                  <span
                    style={{
                      background: r.status === "Active" ? "var(--color-danger-bg)" : "var(--color-success-bg)",
                      color: r.status === "Active" ? "var(--color-critical)" : "var(--color-low)",
                      padding: "3px 8px",
                      borderRadius: 5,
                      fontSize: 11,
                    }}
                  >
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: "10px 0", textAlign: "right" }}>
                  {r.status === "Active" && (
                    <button style={{ background: "none", border: "1px solid var(--border-light)", color: "var(--text-secondary)", borderRadius: 5, padding: "4px 10px", fontSize: 11 }}>
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardShell>
    </div>
  );
}