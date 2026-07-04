import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import CardShell from "../components/CardShell";

const alertsOverTime = [
  { day: "May 16", value: 40 },
  { day: "May 17", value: 55 },
  { day: "May 18", value: 35 },
  { day: "May 19", value: 60 },
  { day: "May 20", value: 70 },
  { day: "May 21", value: 45 },
  { day: "May 22", value: 50 },
  { day: "May 23", value: 65 },
];

const riskDistribution = [
  { name: "Critical", value: 23, color: "#f04444" },
  { name: "High", value: 45, color: "#f5a623" },
  { name: "Medium", value: 36, color: "#f0c419" },
  { name: "Low", value: 24, color: "#3ecf8e" },
];

const topCountries = [
  { name: "Germany", count: 28 },
  { name: "Russia", count: 21 },
  { name: "United States", count: 17 },
  { name: "China", count: 13 },
  { name: "Netherlands", count: 9 },
];

const recentIncidents = [
  { id: "INC-128", type: "Malware", source: "185.220.101.1", risk: 100, status: "Investigating", updated: "2 min ago" },
  { id: "INC-127", type: "Brute Force", source: "45.12.56.78", risk: 80, status: "Open", updated: "5 min ago" },
  { id: "INC-126", type: "Ransomware", source: "91.23.66.10", risk: 95, status: "Investigating", updated: "12 min ago" },
  { id: "INC-125", type: "Phishing", source: "203.0.113.5", risk: 60, status: "Open", updated: "18 min ago" },
  { id: "INC-124", type: "Malicious IP", source: "192.168.1.45", risk: 75, status: "Open", updated: "25 min ago" },
];

const timeline = [
  { label: "Alert received", time: "10:15:30" },
  { label: "Threat enrichment (VirusTotal, AbuseIPDB)", time: "10:15:31" },
  { label: "Playbook triggered: high risk", time: "10:15:32" },
  { label: "Host isolated", time: "10:15:33" },
  { label: "Firewall rule added", time: "10:15:34" },
  { label: "Incident closed", time: "10:15:35" },
];

const pendingApprovals = [
  { title: "Host isolation - INC-129", risk: "High risk" },
  { title: "Firewall block - 203.0.113.77", risk: "High risk" },
  { title: "Playbook execution - INC-130", risk: "Medium risk" },
];

function riskColor(score) {
  if (score >= 90) return "var(--color-critical)";
  if (score >= 70) return "var(--color-high)";
  if (score >= 40) return "var(--color-medium)";
  return "var(--color-low)";
}

function statusBadgeStyle(status) {
  if (status === "Investigating") {
    return { background: "var(--color-warning-bg)", color: "var(--color-high)" };
  }
  return { background: "var(--color-info-bg)", color: "#5fa8e0" };
}

function KpiCard({ label, value, trend, trendUp, accent }) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "16px 18px",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 26, fontWeight: 600, color: accent || "var(--text-primary)" }}>
          {value}
        </span>
        {trend && (
          <span style={{ fontSize: 12, color: trendUp ? "var(--color-low)" : "var(--color-critical)" }}>
            {trendUp ? "\u2191" : "\u2193"} {trend}
          </span>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 14 }}>
        <KpiCard label="Total alerts" value="128" trend="12%" trendUp />
        <KpiCard label="High risk alerts" value="23" trend="15%" trendUp accent="var(--color-critical)" />
        <KpiCard label="Open cases" value="12" trend="4%" trendUp={false} accent="var(--color-high)" />
        <KpiCard label="Closed cases" value="104" trend="18%" trendUp accent="var(--color-low)" />
        <KpiCard label="MTTR (avg)" value="4.2s" trend="35%" trendUp={false} accent="var(--accent-purple)" />
      </div>

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
            {topCountries.map((c) => {
              const max = Math.max(...topCountries.map((x) => x.count));
              return (
                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, width: 95, color: "var(--text-secondary)" }}>{c.name}</span>
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
                  <Pie data={riskDistribution} dataKey="value" innerRadius={36} outerRadius={52} startAngle={90} endAngle={-270}>
                    {riskDistribution.map((d) => (
                      <Cell key={d.name} fill={d.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>128</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Total</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {riskDistribution.map((d) => (
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

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <CardShell
          title="Recent incidents"
          action={<button style={{ background: "none", border: "none", color: "var(--accent-purple)", fontSize: 12 }}>View all</button>}
        >
          <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ paddingBottom: 8, fontWeight: 500 }}>ID</th>
                <th style={{ paddingBottom: 8, fontWeight: 500 }}>Type</th>
                <th style={{ paddingBottom: 8, fontWeight: 500 }}>Source</th>
                <th style={{ paddingBottom: 8, fontWeight: 500 }}>Risk</th>
                <th style={{ paddingBottom: 8, fontWeight: 500 }}>Status</th>
                <th style={{ paddingBottom: 8, fontWeight: 500 }}>Updated</th>
              </tr>
            </thead>
            <tbody>
              {recentIncidents.map((i) => (
                <tr key={i.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "8px 0", color: "var(--accent-purple)" }}>{i.id}</td>
                  <td style={{ padding: "8px 0" }}>{i.type}</td>
                  <td style={{ padding: "8px 0", color: "var(--text-secondary)" }}>{i.source}</td>
                  <td style={{ padding: "8px 0" }}>
                    <span style={{ color: riskColor(i.risk), fontWeight: 600 }}>{i.risk}</span>
                  </td>
                  <td style={{ padding: "8px 0" }}>
                    <span style={{ ...statusBadgeStyle(i.status), padding: "3px 8px", borderRadius: 5, fontSize: 11 }}>
                      {i.status}
                    </span>
                  </td>
                  <td style={{ padding: "8px 0", color: "var(--text-muted)" }}>{i.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardShell>

        <CardShell title="Incident timeline">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {timeline.map((t, idx) => (
              <div key={t.label} style={{ display: "flex", gap: 10 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", background: "var(--color-low)", flexShrink: 0 }} />
                  {idx < timeline.length - 1 && (
                    <span style={{ width: 1, flex: 1, background: "var(--border-light)", marginTop: 2 }} />
                  )}
                </div>
                <div style={{ paddingBottom: 4 }}>
                  <div style={{ fontSize: 12.5 }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardShell>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <CardShell
          title="Active playbook"
          action={
            <span style={{ background: "var(--color-success-bg)", color: "var(--color-low)", fontSize: 11, padding: "3px 8px", borderRadius: 5 }}>
              Running
            </span>
          }
        >
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12 }}>
            High risk - auto containment
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {["Collect IOC", "Threat intel", "Check reputation", "Isolate host", "Block IP", "Notify analyst"].map((s, idx) => (
              <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: idx < 3 ? "var(--color-low)" : "var(--border)", marginBottom: 6 }} />
                <span style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center" }}>{s}</span>
              </div>
            ))}
          </div>
        </CardShell>

        <CardShell title="Threat intelligence (latest)">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { name: "VirusTotal", stat: "265M+ signatures" },
              { name: "AbuseIPDB", stat: "12M+ reports" },
              { name: "AlienVault OTX", stat: "18M+ pulses" },
              { name: "Cisco Talos", stat: "1.2M+ intelligence" },
            ].map((s) => (
              <div key={s.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                <span>{s.name}</span>
                <span style={{ color: "var(--text-muted)" }}>{s.stat}</span>
              </div>
            ))}
          </div>
        </CardShell>

        <CardShell title="Pending approvals">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pendingApprovals.map((a) => (
              <div key={a.title} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 12.5 }}>{a.title}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--color-high)" }}>{a.risk}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ background: "var(--color-high)", color: "#1a1300", border: "none", borderRadius: 5, fontSize: 11, padding: "4px 10px" }}>
                      Approve
                    </button>
                    <button style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border-light)", borderRadius: 5, fontSize: 11, padding: "4px 10px" }}>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardShell>
      </div>
    </div>
  );
}