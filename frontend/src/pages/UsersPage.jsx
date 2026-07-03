import CardShell from "../components/CardShell";

const users = [
  { name: "Bob", email: "bob@infotact.in", role: "Senior Analyst", status: "Active", lastActive: "Now" },
  { name: "Vrushti", email: "vrushti@infotact.in", role: "Backend Lead", status: "Active", lastActive: "5 min ago" },
  { name: "Ushvi", email: "ushvi@infotact.in", role: "Threat Intel Engineer", status: "Active", lastActive: "Now" },
  { name: "Samruddhi", email: "samruddhi@infotact.in", role: "Automation Engineer", status: "Active", lastActive: "1 hour ago" },
  { name: "Riya", email: "riya@infotact.in", role: "Frontend & Security", status: "Active", lastActive: "20 min ago" },
];

function roleColor(role) {
  if (role.includes("Senior")) return "var(--accent-purple)";
  if (role.includes("Backend")) return "var(--color-high)";
  if (role.includes("Threat")) return "var(--color-low)";
  if (role.includes("Automation")) return "var(--color-medium)";
  return "#5fa8e0";
}

export default function UsersPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <CardShell title={`Team members (${users.length})`}>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Name</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Email</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Role</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Status</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Last active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "10px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "var(--accent-purple)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {u.name[0]}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td style={{ padding: "10px 0", color: "var(--text-secondary)" }}>{u.email}</td>
                <td style={{ padding: "10px 0", color: roleColor(u.role), fontWeight: 500 }}>{u.role}</td>
                <td style={{ padding: "10px 0" }}>
                  <span style={{ background: "var(--color-success-bg)", color: "var(--color-low)", padding: "3px 8px", borderRadius: 5, fontSize: 11 }}>
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: "10px 0", color: "var(--text-muted)" }}>{u.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardShell>
    </div>
  );
}