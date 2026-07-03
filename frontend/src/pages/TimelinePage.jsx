import CardShell from "../components/CardShell";

const events = [
  { id: "INC-128", title: "Alert received - Malware detected", time: "May 23, 10:15:30", type: "alert" },
  { id: "INC-128", title: "Threat enrichment completed (VirusTotal, AbuseIPDB)", time: "May 23, 10:15:31", type: "enrich" },
  { id: "INC-128", title: "Playbook triggered: High Risk Containment", time: "May 23, 10:15:32", type: "playbook" },
  { id: "INC-128", title: "Host isolated automatically", time: "May 23, 10:15:33", type: "action" },
  { id: "INC-128", title: "Firewall rule added to block source IP", time: "May 23, 10:15:34", type: "action" },
  { id: "INC-128", title: "Incident marked as closed", time: "May 23, 10:15:35", type: "close" },
  { id: "INC-127", title: "Alert received - Brute force detected", time: "May 23, 10:10:02", type: "alert" },
  { id: "INC-127", title: "Threat enrichment completed", time: "May 23, 10:10:03", type: "enrich" },
];

function dotColor(type) {
  if (type === "alert") return "var(--color-critical)";
  if (type === "close") return "var(--color-low)";
  if (type === "playbook") return "var(--accent-purple)";
  return "var(--color-high)";
}

export default function TimelinePage() {
  return (
    <CardShell title="Global incident timeline">
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {events.map((e, idx) => (
          <div key={idx} style={{ display: "flex", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: dotColor(e.type), flexShrink: 0, marginTop: 4 }} />
              {idx < events.length - 1 && (
                <span style={{ width: 1, flex: 1, background: "var(--border-light)", minHeight: 28 }} />
              )}
            </div>
            <div style={{ paddingBottom: 20 }}>
              <div style={{ fontSize: 11, color: "var(--accent-purple)", marginBottom: 2 }}>{e.id}</div>
              <div style={{ fontSize: 13 }}>{e.title}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{e.time}</div>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}