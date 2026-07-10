import CardShell from "../components/CardShell";

const schedules = [
  { name: "Daily threat feed sync", frequency: "Every day, 12:00 AM", lastRun: "Today, 12:00 AM", status: "Success" },
  { name: "Weekly report generation", frequency: "Every Monday, 6:00 AM", lastRun: "May 19, 6:00 AM", status: "Success" },
  { name: "Firewall rule cleanup", frequency: "Every 6 hours", lastRun: "2 hours ago", status: "Success" },
  { name: "Stale case auto-close", frequency: "Every day, 11:00 PM", lastRun: "Yesterday, 11:00 PM", status: "Failed" },
];

export default function SchedulesPage() {
  return (
    <CardShell title="Scheduled tasks">
      <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
            <th style={{ paddingBottom: 10, fontWeight: 500 }}>Task</th>
            <th style={{ paddingBottom: 10, fontWeight: 500 }}>Frequency</th>
            <th style={{ paddingBottom: 10, fontWeight: 500 }}>Last run</th>
            <th style={{ paddingBottom: 10, fontWeight: 500 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.name} style={{ borderTop: "1px solid var(--border)" }}>
              <td style={{ padding: "10px 0" }}>{s.name}</td>
              <td style={{ padding: "10px 0", color: "var(--text-secondary)" }}>{s.frequency}</td>
              <td style={{ padding: "10px 0", color: "var(--text-muted)" }}>{s.lastRun}</td>
              <td style={{ padding: "10px 0" }}>
                <span
                  style={{
                    background: s.status === "Success" ? "var(--color-success-bg)" : "var(--color-danger-bg)",
                    color: s.status === "Success" ? "var(--color-low)" : "var(--color-critical)",
                    padding: "3px 8px",
                    borderRadius: 5,
                    fontSize: 11,
                  }}
                >
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardShell>
  );
}