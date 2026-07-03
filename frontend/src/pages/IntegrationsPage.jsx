import CardShell from "../components/CardShell";
import { ShieldAlert, Bug, Globe, Flame } from "lucide-react";

const integrations = [
  { name: "AbuseIPDB", icon: ShieldAlert, status: "Connected", desc: "Community IP reputation database" },
  { name: "VirusTotal", icon: Bug, status: "Connected", desc: "Multi-engine malware and URL scanning" },
  { name: "IP Geolocation (ip-api.com)", icon: Globe, status: "Connected", desc: "Physical location lookup for IPs" },
  { name: "AWS Security Groups", icon: Flame, status: "Not connected", desc: "Cloud firewall rule management" },
];

export default function IntegrationsPage() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {integrations.map((i) => (
        <CardShell key={i.name} title={i.name}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "var(--bg-page)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i.icon size={17} color="var(--accent-purple)" />
            </div>
            <span
              style={{
                background: i.status === "Connected" ? "var(--color-success-bg)" : "var(--color-warning-bg)",
                color: i.status === "Connected" ? "var(--color-low)" : "var(--color-high)",
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 5,
              }}
            >
              {i.status}
            </span>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{i.desc}</div>
        </CardShell>
      ))}
    </div>
  );
}