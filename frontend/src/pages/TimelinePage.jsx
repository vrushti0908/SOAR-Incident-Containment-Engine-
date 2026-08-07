import { useEffect, useState } from "react";
import CardShell from "../components/CardShell";

const API = "http://127.0.0.1:8000";

function dotColor(type) {
  switch (type) {
    case "alert":
      return "var(--color-critical)";
    case "close":
      return "var(--color-low)";
    case "playbook":
      return "var(--accent-purple)";
    case "enrich":
      return "var(--color-high)";
    case "action":
      return "var(--color-high)";
    default:
      return "var(--text-muted)";
  }
}

export default function TimelinePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, []);

  async function loadTimeline() {
    try {
      const response = await fetch(`${API}/timeline`);

      if (!response.ok) {
        throw new Error("Failed to fetch timeline");
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error("Timeline Error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <CardShell title="Global Incident Timeline">
        <p>Loading timeline...</p>
      </CardShell>
    );
  }

  return (
    <CardShell title="Global Incident Timeline">
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {events.length === 0 ? (
          <p>No timeline events found.</p>
        ) : (
          events.map((e, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: dotColor(e.type),
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                />

                {idx < events.length - 1 && (
                  <span
                    style={{
                      width: 1,
                      flex: 1,
                      background: "var(--border-light)",
                      minHeight: 28,
                    }}
                  />
                )}
              </div>

              <div style={{ paddingBottom: 20 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--accent-purple)",
                    marginBottom: 2,
                  }}
                >
                  {e.id}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {e.title}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  {e.description}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  {e.time}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </CardShell>
  );
}