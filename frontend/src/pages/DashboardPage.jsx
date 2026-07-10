import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import CardShell from "../components/CardShell";

const API = "http://127.0.0.1:8000";

const RISK_COLORS = {
  Critical: "#f04444",
  High: "#f5a623",
  Medium: "#f0c419",
  Low: "#3ecf8e",
};

const COUNTRY_NAMES = {
  US: "United States", CN: "China", RU: "Russia", DE: "Germany",
  FR: "France", GB: "United Kingdom", NL: "Netherlands", IN: "India",
  BR: "Brazil", UA: "Ukraine", KR: "South Korea", JP: "Japan",
};

function riskColor(score) {
  if (score >= 90) return "var(--color-critical)";
  if (score >= 70) return "var(--color-high)";
  if (score >= 40) return "var(--color-medium)";
  return "var(--color-low)";
}

function statusBadgeStyle(status) {
  if (status === "Resolved") return { background: "var(--color-success-bg)", color: "var(--color-low)" };
  if (status === "Open") return { background: "var(--color-info-bg)", color: "#5fa8e0" };
  return { background: "var(--color-warning-bg)", color: "var(--color-high)" };
}

function KpiCard({ label, value, accent }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px", flex: 1, minWidth: 0 }}>
      <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 10 }}>{label}</div>
      <span style={{ fontSize: 26, fontWeight: 600, color: accent || "var(--text-primary)" }}>{value}</span>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [approvals, setApprovals] = useState([]);

  async function loadData() {
    try {
      const [s, a] = await Promise.all([
        fetch(`${API}/dashboard/stats`).then(r => r.json()),
        fetch(`${API}/alerts`).then(r => r.json()),
      ]);
      setStats(s);
      setAlerts(Array.isArray(a) ? a : []);

      // approvals needs auth token
      const token = localStorage.getItem("soar_token");
      if (token) {
        const ap = await fetch(`${API}/approvals`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.ok ? r.json() : []);
        setApprovals(Array.isArray(ap) ? ap.filter(x => x.status === "PENDING") : []);
      }
    } catch (e) {
      console.error("Dashboard load error:", e);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 6000);
    return () => clearInterval(interval);
  }, []);

  // Build alerts-over-time data from real alerts
  const alertsOverTime = (() => {
    const buckets = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(5, 10);
      buckets[key] = 0;
    }
    alerts.forEach(a => {
      const key = (a.timestamp || "").slice(5, 10);
      if (key in buckets) buckets[key]++;
    });
    return Object.entries(buckets).map(([day, value]) => ({ day, value }));
  })();

  // Risk distribution from real stats
  const riskDistribution = stats ? [
    { name: "Critical", value: stats.critical_count || 0, color: RISK_COLORS.Critical },
    { name: "High",     value: stats.high_count || 0,     color: RISK_COLORS.High },
    { name: "Medium",   value: stats.medium_count || 0,   color: RISK_COLORS.Medium },
    { name: "Low",      value: stats.low_count || 0,      color: RISK_COLORS.Low },
  ] : [];

  // Top countries from real stats
  const topCountries = stats
    ? Object.entries(stats.alerts_by_country || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([code, count]) => ({ name: COUNTRY_NAMES[code] || code, count }))
    : [];

  const recentAlerts = [...alerts].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 8);

  async function handleApproval(id, action) {
    const token = localStorage.getItem("soar_token");
    if (!token) { alert("Please log in to perform this action"); return; }
    try {
      const res = await fetch(`${API}/approvals/${id}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) { alert(data.detail || "Action failed"); return; }
      loadData();
    } catch (e) { alert("Could not reach server"); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* KPI row */}
      <div style={{ display: "flex", gap: 14 }}>
        <KpiCard label="Total alerts"     value={stats?.total_alerts ?? "—"} />
        <KpiCard label="High risk alerts" value={stats?.high_risk_alerts ?? "—"} accent="var(--color-critical)" />
        <KpiCard label="Open cases"       value={stats?.open_cases ?? "—"}  accent="var(--color-high)" />
        <KpiCard label="Closed cases"     value={stats?.closed_cases ?? "—"} accent="var(--color-low)" />
        <KpiCard label="MTTR (avg)"       value={stats ? `${stats.mttr}s` : "—"} accent="var(--accent-purple)" />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 16 }}>
        <CardShell title="Alerts over time">
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={alertsOverTime}>
              <XAxis dataKey="day" stroke="#6b6b80" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b6b80" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#1a1a26", border: "1px solid #2a2a38", borderRadius: 6, fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="#8b7cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardShell>

        <CardShell title="Top attacking countries">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topCountries.length === 0 && (
              <div style={{ color: "var(--text-muted)", fontSize: 12, textAlign: "center", padding: "20px 0" }}>
                No alerts yet
              </div>
            )}
            {topCountries.map((c) => {
              const max = Math.max(...topCountries.map(x => x.count));
              return (
                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, width: 100, color: "var(--text-secondary)" }}>{c.name}</span>
                  <div style={{ flex: 1, height: 6, background: "var(--border)", borderRadius: 3 }}>
                    <div style={{ width: `${(c.count / max) * 100}%`, height: "100%", background: "var(--accent-purple)", borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 12, width: 20, textAlign: "right" }}>{c.count}</span>
                </div>
              );
            })}
          </div>
        </CardShell>

        <CardShell title="Risk distribution">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative", width: 110, height: 110 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistribution.filter(d => d.value > 0)} dataKey="value" innerRadius={36} outerRadius={52} startAngle={90} endAngle={-270}>
                    {riskDistribution.map(d => <Cell key={d.name} fill={d.color} stroke="none" />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{stats?.total_alerts ?? 0}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Total</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {riskDistribution.map(d => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} />
                  <span style={{ color: "var(--text-secondary)" }}>{d.name}</span>
                  <span style={{ marginLeft: "auto" }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardShell>
      </div>

      {/* Recent incidents + MITRE timeline */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <CardShell title="Recent incidents">
          <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ paddingBottom: 8, fontWeight: 500 }}>ID</th>
                <th style={{ paddingBottom: 8, fontWeight: 500 }}>Type</th>
                <th style={{ paddingBottom: 8, fontWeight: 500 }}>Source IP</th>
                <th style={{ paddingBottom: 8, fontWeight: 500 }}>Risk</th>
                <th style={{ paddingBottom: 8, fontWeight: 500 }}>MITRE</th>
                <th style={{ paddingBottom: 8, fontWeight: 500 }}>Action</th>
                <th style={{ paddingBottom: 8, fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAlerts.length === 0 && (
                <tr><td colSpan={7} style={{ padding: "20px 0", color: "var(--text-muted)", textAlign: "center" }}>No alerts yet — send one to POST /alerts</td></tr>
              )}
              {recentAlerts.map(a => (
                <tr key={a.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "8px 0", color: "var(--accent-purple)" }}>#{a.id}</td>
                  <td style={{ padding: "8px 0" }}>{a.alert_type}</td>
                  <td style={{ padding: "8px 0", color: "var(--text-secondary)" }}>{a.source_ip}</td>
                  <td style={{ padding: "8px 0" }}>
                    <span style={{ color: riskColor(a.risk_score), fontWeight: 600 }}>{a.risk_score}</span>
                  </td>
                  <td style={{ padding: "8px 0" }}>
                    {a.mitre_technique_id ? (
                      <a href={`https://attack.mitre.org/techniques/${a.mitre_technique_id}/`} target="_blank" rel="noreferrer"
                        style={{ color: "var(--accent-purple)", fontFamily: "monospace", fontSize: 11, textDecoration: "none" }}>
                        {a.mitre_technique_id} ↗
                      </a>
                    ) : "—"}
                  </td>
                  <td style={{ padding: "8px 0", fontSize: 11, color: "var(--text-secondary)" }}>{a.action}</td>
                  <td style={{ padding: "8px 0" }}>
                    <span style={{ ...statusBadgeStyle(a.status), padding: "3px 8px", borderRadius: 5, fontSize: 11 }}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardShell>

        <CardShell title="Incident timeline" action={<span style={{ fontSize: 11, color: "var(--text-muted)" }}>latest alert</span>}>
          {recentAlerts.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: 12, padding: "20px 0", textAlign: "center" }}>No alerts yet</div>
          ) : (() => {
            const latest = recentAlerts[0];
            const steps = [
              { label: "Alert received", done: true },
              { label: `Threat enrichment (VT + AbuseIPDB)`, done: true },
              { label: `MITRE tagged: ${latest.mitre_technique_id || "—"} ${latest.mitre_tactic || ""}`, done: !!latest.mitre_technique_id },
              { label: `Playbook executed: ${latest.action}`, done: true },
              { label: latest.status === "Resolved" ? "Incident resolved" : "Awaiting resolution", done: latest.status === "Resolved" },
            ];
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {steps.map((t, idx) => (
                  <div key={t.label} style={{ display: "flex", gap: 10 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ width: 16, height: 16, borderRadius: "50%", background: t.done ? "var(--color-low)" : "var(--border)", flexShrink: 0 }} />
                      {idx < steps.length - 1 && <span style={{ width: 1, flex: 1, background: "var(--border-light)", marginTop: 2 }} />}
                    </div>
                    <div style={{ paddingBottom: 4 }}>
                      <div style={{ fontSize: 12, color: t.done ? "var(--text-primary)" : "var(--text-muted)" }}>{t.label}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{latest.timestamp?.slice(11, 19) || ""}</div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </CardShell>
      </div>

      {/* Pending approvals + Threat intel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <CardShell title="Pending approvals">
          {approvals.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: 12, padding: "10px 0" }}>
              {localStorage.getItem("soar_token") ? "No pending approvals right now." : "Log in to view pending approvals."}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {approvals.map(a => (
                <div key={a.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 12.5 }}>{a.action_type} → {a.target}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Alert #{a.alert_id}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "var(--color-high)" }}>High risk</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleApproval(a.id, "approve")}
                        style={{ background: "var(--color-high)", color: "#1a1300", border: "none", borderRadius: 5, fontSize: 11, padding: "4px 10px", cursor: "pointer" }}>
                        Approve
                      </button>
                      <button onClick={() => handleApproval(a.id, "reject")}
                        style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border-light)", borderRadius: 5, fontSize: 11, padding: "4px 10px", cursor: "pointer" }}>
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardShell>

        <CardShell title="Threat intelligence sources">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { name: "AbuseIPDB", stat: "IP reputation scoring", active: true },
              { name: "VirusTotal", stat: "Multi-vendor threat analysis", active: true },
              { name: "IP-API", stat: "Geolocation enrichment", active: true },
              { name: "MITRE ATT&CK", stat: "Technique & tactic mapping", active: true },
            ].map(s => (
              <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.active ? "var(--color-low)" : "var(--border)" }} />
                  {s.name}
                </div>
                <span style={{ color: "var(--text-muted)" }}>{s.stat}</span>
              </div>
            ))}
          </div>
        </CardShell>
      </div>

    </div>
  );
}