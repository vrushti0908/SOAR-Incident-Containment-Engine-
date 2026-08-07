import { useState, useEffect } from "react";
import CardShell from "../components/CardShell";

const API = "http://127.0.0.1:8000";

function riskColor(score) {
  if (score >= 90) return "var(--color-critical)";
  if (score >= 70) return "var(--color-high)";
  if (score >= 40) return "var(--color-medium)";
  return "var(--color-low)";
}

function statusStyle(status) {
  if (status === "Resolved") return { background: "var(--color-success-bg)", color: "var(--color-low)" };
  if (status === "Open") return { background: "var(--color-info-bg)", color: "#5fa8e0" };
  return { background: "var(--color-warning-bg)", color: "var(--color-high)" };
}

const FILTERS = ["All", "Open", "Resolved"];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/alerts`)
      .then((r) => r.json())
      .then((data) => { setAlerts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeFilter === "All"
    ? alerts
    : alerts.filter((a) => a.status === activeFilter);

  const sorted = [...filtered].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {FILTERS.map((f) => (
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
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <CardShell title={`Alerts (${sorted.length})`}>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
              {["ID", "Type", "Source IP", "Country", "Risk", "MITRE", "Action", "MTTR", "Status"].map((h) => (
                <th key={h} style={{ paddingBottom: 10, fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={9} style={{ padding: "20px 0", textAlign: "center", color: "var(--text-muted)" }}>
                  Loading...
                </td>
              </tr>
            )}
            {!loading && sorted.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: "20px 0", textAlign: "center", color: "var(--text-muted)" }}>
                  No alerts found
                </td>
              </tr>
            )}
            {sorted.map((a) => (
              <tr key={a.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "10px 0", color: "var(--accent-purple)" }}>#{a.id}</td>
                <td style={{ padding: "10px 0" }}>{a.alert_type}</td>
                <td style={{ padding: "10px 0", color: "var(--text-secondary)", fontFamily: "monospace" }}>{a.source_ip}</td>
                <td style={{ padding: "10px 0", color: "var(--text-secondary)" }}>{a.country || "—"}</td>
                <td style={{ padding: "10px 0" }}>
                  <span style={{ color: riskColor(a.risk_score), fontWeight: 600 }}>{a.risk_score}</span>
                </td>
                <td style={{ padding: "10px 0" }}>
                  {a.mitre_technique_id ? (
                    <a
                      href={`https://attack.mitre.org/techniques/${a.mitre_technique_id}/`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--accent-purple)", fontFamily: "monospace", fontSize: 11, textDecoration: "none" }}
                    >
                      {a.mitre_technique_id} ↗
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td style={{ padding: "10px 0", fontSize: 11, color: "var(--text-secondary)" }}>{a.action}</td>
                <td style={{ padding: "10px 0", fontFamily: "monospace", fontSize: 11 }}>
                  {a.mttr_seconds ? `${a.mttr_seconds}s` : "—"}
                </td>
                <td style={{ padding: "10px 0" }}>
                  <span style={{ ...statusStyle(a.status), padding: "3px 8px", borderRadius: 5, fontSize: 11 }}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardShell>
    </div>
  );
}