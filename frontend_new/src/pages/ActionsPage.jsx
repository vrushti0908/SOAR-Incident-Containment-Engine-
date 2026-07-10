import CardShell from "../components/CardShell";

const actions = [
  { name: "Isolate Host", category: "Containment", usedCount: 18 },
  { name: "Block IP on Firewall", category: "Containment", usedCount: 34 },
  { name: "Quarantine File", category: "Containment", usedCount: 9 },
  { name: "Notify SOC Analyst", category: "Notification", usedCount: 56 },
  { name: "Create Case", category: "Case Management", usedCount: 22 },
];

export default function ActionsPage() {
  return (
    <CardShell title="Available actions">
      <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
            <th style={{ paddingBottom: 10, fontWeight: 500 }}>Action name</th>
            <th style={{ paddingBottom: 10, fontWeight: 500 }}>Category</th>
            <th style={{ paddingBottom: 10, fontWeight: 500 }}>Used in playbooks</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((a) => (
            <tr key={a.name} style={{ borderTop: "1px solid var(--border)" }}>
              <td style={{ padding: "10px 0" }}>{a.name}</td>
              <td style={{ padding: "10px 0", color: "var(--text-secondary)" }}>{a.category}</td>
              <td style={{ padding: "10px 0", color: "var(--accent-purple)" }}>{a.usedCount} times</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardShell>
  );
}