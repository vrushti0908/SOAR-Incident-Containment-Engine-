import CardShell from "../components/CardShell";
import { FileText, Download } from "lucide-react";

const reports = [
  { name: "Weekly Threat Summary", type: "Threat Intelligence", generated: "May 23, 2026", size: "1.2 MB" },
  { name: "Monthly Incident Report", type: "Incidents", generated: "May 1, 2026", size: "3.4 MB" },
  { name: "Playbook Execution Audit", type: "Automation", generated: "Apr 28, 2026", size: "850 KB" },
  { name: "Firewall Rules Change Log", type: "Firewall", generated: "Apr 25, 2026", size: "420 KB" },
  { name: "RBAC Access Review", type: "Security", generated: "Apr 20, 2026", size: "210 KB" },
];

export default function ReportsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>Reports generated</div>
          <div style={{ fontSize: 26, fontWeight: 600 }}>{reports.length}</div>
        </div>
        <div style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>This month</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: "var(--accent-purple)" }}>3</div>
        </div>
        <div style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>Categories</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: "var(--color-low)" }}>5</div>
        </div>
      </div>

      <CardShell title="Available reports">
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {reports.map((r, idx) => (
            <div
              key={r.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 0",
                borderTop: idx > 0 ? "1px solid var(--border)" : "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "var(--bg-page)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FileText size={16} color="var(--accent-purple)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  {r.type} &middot; Generated {r.generated} &middot; {r.size}
                </div>
              </div>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "none",
                  border: "1px solid var(--border-light)",
                  color: "var(--text-secondary)",
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontSize: 12,
                }}
              >
                <Download size={13} />
                Download
              </button>
            </div>
          ))}
        </div>
      </CardShell>
    </div>
  );
}