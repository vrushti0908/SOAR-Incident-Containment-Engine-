import CardShell from "../components/CardShell";
import { useState } from "react";

function ToggleRow({ label, desc, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid var(--border)" }}>
      <div>
        <div style={{ fontSize: 13 }}>{label}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{desc}</div>
      </div>
      <button
        onClick={() => setOn(!on)}
        style={{
          width: 38,
          height: 20,
          borderRadius: 10,
          background: on ? "var(--accent-purple)" : "var(--border-light)",
          border: "none",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: on ? 20 : 2,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "white",
            transition: "left 0.15s",
          }}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <CardShell title="Notifications">
        <ToggleRow label="Email alerts" desc="Receive email when a high-risk incident is created" defaultOn={true} />
        <ToggleRow label="Slack notifications" desc="Send notifications to the SOC Slack channel" defaultOn={true} />
        <ToggleRow label="SMS for critical incidents" desc="Send SMS only for CRITICAL risk level alerts" defaultOn={false} />
      </CardShell>

      <CardShell title="Automation">
        <ToggleRow label="Auto-run playbooks" desc="Automatically execute playbooks without manual approval" defaultOn={false} />
        <ToggleRow label="Auto-block high risk IPs" desc="Block IPs with risk score above 80 automatically" defaultOn={true} />
      </CardShell>

      <CardShell title="System">
        <ToggleRow label="Dark mode" desc="Use dark theme across the dashboard" defaultOn={true} />
        <ToggleRow label="Maintenance mode" desc="Pause all automated actions temporarily" defaultOn={false} />
      </CardShell>
    </div>
  );
}