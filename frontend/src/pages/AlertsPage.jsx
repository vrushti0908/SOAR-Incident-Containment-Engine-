import { useState } from "react";
import CardShell from "../components/CardShell";

const allAlerts = [
  { id: "INC-128", type: "Malware", source: "185.220.101.1", risk: 100, status: "Investigating", time: "2 min ago" },
  { id: "INC-127", type: "Brute Force", source: "45.12.56.78", risk: 80, status: "Open", time: "5 min ago" },
  { id: "INC-126", type: "Ransomware", source: "91.23.66.10", risk: 95, status: "Investigating", time: "12 min ago" },
  { id: "INC-125", type: "Phishing", source: "203.0.113.5", risk: 60, status: "Open", time: "18 min ago" },
  { id: "INC-124", type: "Malicious IP", source: "192.168.1.45", risk: 75, status: "Open", time: "25 min ago" },
  { id: "INC-123", type: "Brute Force", source: "78.142.19.3", risk: 55, status: "Closed", time: "1 hour ago" },
  { id: "INC-122", type: "Malware", source: "45.67.21.9", risk: 90, status: "Closed", time: "2 hours ago" },
  { id: "INC-121", type: "Phishing", source: "112.33.44.5", risk: 40, status: "Closed", time: "3 hours ago" },
];

function riskColor(score) {
  if (score >= 90) return "var(--color-critical)";
  if (score >= 70) return "var(--color-high)";
  if (score >= 40) return "var(--color-medium)";
  return "var(--color-low)";
}

function statusStyle(status) {
  if (status === "Investigating") return { background: "var(--color-warning-bg)", color: "var(--color-high)" };
  if (status === "Closed") return { background: "var(--color-success-bg)", color: "var(--color-low)" };
  return { background: "var(--color-info-bg)", color: "#5fa8e0" };
}

const filters = ["All", "Open", "Investigating", "Closed"];

export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? allAlerts
    : allAlerts.filter((a) => a.status === activeFilter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              background: activeFilter === f ? "var(--accent-purple)" : "var(--bg-card)",
              color: activeFilter === f ? "white" : "var(--text-secondary)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "6px 16px",
              fontSize: 13,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <CardShell title={`Alerts (${filtered.length})`}>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>ID</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Type</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Source IP</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Risk score</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Status</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}>Time</th>
              <th style={{ paddingBottom: 10, fontWeight: 500 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "10px 0", color: "var(--accent-purple)" }}>{a.id}</td>
                <td style={{ padding: "10px 0" }}>{a.type}</td>
                <td style={{ padding: "10px 0", color: "var(--text-secondary)" }}>{a.source}</td>
                <td style={{ padding: "10px 0" }}>
                  <span style={{ color: riskColor(a.risk), fontWeight: 600 }}>{a.risk}</span>
                </td>
                <td style={{ padding: "10px 0" }}>
                  <span style={{ ...statusStyle(a.status), padding: "3px 8px", borderRadius: 5, fontSize: 11 }}>
                    {a.status}
                  </span>
                </td>
                <td style={{ padding: "10px 0", color: "var(--text-muted)" }}>{a.time}</td>
                <td style={{ padding: "10px 0", textAlign: "right" }}>
                  <button style={{ background: "none", border: "1px solid var(--border-light)", color: "var(--text-secondary)", borderRadius: 5, padding: "4px 10px", fontSize: 11 }}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardShell>
    </div>
  );
}