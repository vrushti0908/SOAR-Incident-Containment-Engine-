import { useState } from "react";
import { Search, ShieldAlert, Globe, Bug } from "lucide-react";
import CardShell from "../components/CardShell";

function riskLevelColor(level) {
  if (level === "CRITICAL") return "var(--color-critical)";
  if (level === "HIGH") return "var(--color-high)";
  if (level === "MEDIUM") return "var(--color-medium)";
  return "var(--color-low)";
}

const recentLookups = [
  { ip: "118.25.6.39", score: 87, level: "CRITICAL", country: "China", time: "2 min ago" },
  { ip: "45.12.56.78", score: 62, level: "HIGH", country: "Russia", time: "10 min ago" },
  { ip: "203.0.113.5", score: 28, level: "MEDIUM", country: "Germany", time: "25 min ago" },
  { ip: "8.8.8.8", score: 2, level: "LOW", country: "United States", time: "1 hour ago" },
];

export default function ThreatIntelPage() {
  const [ipInput, setIpInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleCheck() {
    if (!ipInput.trim()) return;
    setLoading(true);

    // NOTE: Yeh abhi mock data hai. Jab Member 1 ka FastAPI endpoint
    // ready ho jayega (jaise POST /api/check-ip), iski jagah fetch() call aayega:
    //
    // const res = await fetch("http://localhost:8000/api/check-ip", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ ip: ipInput }),
    // });
    // const data = await res.json();
    // setResult(data);

    setTimeout(() => {
      setResult({
        ip: ipInput,
        final_risk_score: 87,
        risk_level: "CRITICAL",
        abuse_score: 100,
        total_reports: 453,
        vt_malicious: 12,
        vt_suspicious: 3,
        city: "Shenzhen",
        country: "China",
        org: "AS45090 Tencent Cloud",
        timezone: "Asia/Shanghai",
      });
      setLoading(false);
    }, 800);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <CardShell title="Check IP threat intelligence">
        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--bg-page)",
              border: "1px solid var(--border-light)",
              borderRadius: 8,
              padding: "9px 12px",
            }}
          >
            <Search size={15} color="var(--text-muted)" />
            <input
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              placeholder="Enter an IP address, e.g. 118.25.6.39"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: 13,
                width: "100%",
              }}
            />
          </div>
          <button
            onClick={handleCheck}
            disabled={loading}
            style={{
              background: "var(--accent-purple)",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "0 20px",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {loading ? "Checking..." : "Check IP"}
          </button>
        </div>
      </CardShell>

      {result && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
          <CardShell title="Final risk assessment">
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 700,
                  color: riskLevelColor(result.risk_level),
                }}
              >
                {result.final_risk_score}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>out of 100</div>
              <span
                style={{
                  background: riskLevelColor(result.risk_level) + "22",
                  color: riskLevelColor(result.risk_level),
                  padding: "4px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {result.risk_level}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", textAlign: "center", marginTop: 10 }}>
              IP: <span style={{ color: "var(--text-primary)" }}>{result.ip}</span>
            </div>
          </CardShell>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <CardShell title="AbuseIPDB">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <ShieldAlert size={16} color="var(--accent-purple)" />
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Community reports</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{result.abuse_score}/100</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                {result.total_reports} total reports
              </div>
            </CardShell>

            <CardShell title="VirusTotal">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Bug size={16} color="var(--color-critical)" />
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Engine detections</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{result.vt_malicious}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                {result.vt_suspicious} flagged suspicious
              </div>
            </CardShell>

            <CardShell title="Geolocation">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Globe size={16} color="var(--color-low)" />
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Location</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{result.city}, {result.country}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{result.org}</div>
            </CardShell>
          </div>
        </div>
      )}

      <CardShell title="Recent lookups">
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
              <th style={{ paddingBottom: 8, fontWeight: 500 }}>IP address</th>
              <th style={{ paddingBottom: 8, fontWeight: 500 }}>Risk score</th>
              <th style={{ paddingBottom: 8, fontWeight: 500 }}>Risk level</th>
              <th style={{ paddingBottom: 8, fontWeight: 500 }}>Country</th>
              <th style={{ paddingBottom: 8, fontWeight: 500 }}>Checked</th>
            </tr>
          </thead>
          <tbody>
            {recentLookups.map((l) => (
              <tr key={l.ip} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "8px 0", color: "var(--accent-purple)" }}>{l.ip}</td>
                <td style={{ padding: "8px 0", fontWeight: 600, color: riskLevelColor(l.level) }}>{l.score}</td>
                <td style={{ padding: "8px 0" }}>
                  <span
                    style={{
                      color: riskLevelColor(l.level),
                      background: riskLevelColor(l.level) + "22",
                      padding: "3px 8px",
                      borderRadius: 5,
                      fontSize: 11,
                    }}
                  >
                    {l.level}
                  </span>
                </td>
                <td style={{ padding: "8px 0", color: "var(--text-secondary)" }}>{l.country}</td>
                <td style={{ padding: "8px 0", color: "var(--text-muted)" }}>{l.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardShell>
    </div>
  );
}