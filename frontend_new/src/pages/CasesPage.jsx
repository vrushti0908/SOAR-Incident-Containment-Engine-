import CardShell from "../components/CardShell";

const cases = [
  { id: "CASE-45", title: "Brute force attack on login API", assignee: "Bob", priority: "High", status: "In Progress", opened: "Today" },
  { id: "CASE-44", title: "Ransomware detected on host srv-12", assignee: "Riya", priority: "Critical", status: "In Progress", opened: "Today" },
  { id: "CASE-43", title: "Suspicious phishing email reported", assignee: "Ushvi", priority: "Medium", status: "Open", opened: "Yesterday" },
  { id: "CASE-42", title: "Malicious IP repeated scanning", assignee: "Vrushti", priority: "Low", status: "Resolved", opened: "2 days ago" },
  { id: "CASE-41", title: "Unauthorized firewall rule change", assignee: "Bob", priority: "High", status: "Resolved", opened: "3 days ago" },
];

function priorityColor(p) {
  if (p === "Critical") return "var(--color-critical)";
  if (p === "High") return "var(--color-high)";
  if (p === "Medium") return "var(--color-medium)";
  return "var(--color-low)";
}

function statusStyle(status) {
  if (status === "Resolved") return { background: "var(--color-success-bg)", color: "var(--color-low)" };
  if (status === "In Progress") return { background: "var(--color-warning-bg)", color: "var(--color-high)" };
  return { background: "var(--color-info-bg)", color: "#5fa8e0" };
}

export default function CasesPage() {
  const open = cases.filter((c) => c.status !== "Resolved").length;
  const resolved = cases.filter((c) => c.status === "Resolved").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>Open cases</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: "var(--color-high)" }}>{open}</div>
        </div>
        <div style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>Resolved cases</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: "var(--color-low)" }}>{resolved}</div>
        </div>
        <div style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>Total cases</div>
          <div style={{ fontSize: 26, fontWeight: 600 }}>{cases.length}</div>
        </div>
      </div>

      <CardShell title="All cases">
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>ID</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Title</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Assignee</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Priority</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Status</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Opened</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "10px 0", color: "var(--accent-purple)" }}>{c.id}</td>
                <td style={{ padding: "10px 0" }}>{c.title}</td>
                <td style={{ padding: "10px 0", color: "var(--text-secondary)" }}>{c.assignee}</td>
                <td style={{ padding: "10px 0", color: priorityColor(c.priority), fontWeight: 600 }}>{c.priority}</td>
                <td style={{ padding: "10px 0" }}>
                  <span style={{ ...statusStyle(c.status), padding: "3px 8px", borderRadius: 5, fontSize: 11 }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: "10px 0", color: "var(--text-muted)" }}>{c.opened}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardShell>
    </div>
  );
}