import { useState } from "react";
import { Search, Bell, Sun, Moon, ChevronDown, X } from "lucide-react";

const notifications = [
  { id: 1, text: "INC-128: Malware detected on 185.220.101.1", time: "2 min ago", unread: true },
  { id: 2, text: "INC-127: Brute force attack blocked", time: "5 min ago", unread: true },
  { id: 3, text: "Playbook executed: High Risk Containment", time: "12 min ago", unread: true },
  { id: 4, text: "Firewall rule added for 91.23.66.10", time: "18 min ago", unread: true },
];

export default function TopBar({ darkMode, setDarkMode }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [notifs, setNotifs] = useState(notifications);

  const unreadCount = notifs.filter((n) => n.unread).length;

  function markAllRead() {
    setNotifs(notifs.map((n) => ({ ...n, unread: false })));
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 24px",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        zIndex: 100,
      }}
    >
      {/* Search bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "7px 12px",
          width: 360,
        }}
      >
        <Search size={15} color="var(--text-muted)" />
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search alerts, IPs, cases, playbooks..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: 13,
            width: "100%",
          }}
        />
        {searchVal && (
          <button
            onClick={() => setSearchVal("")}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            <X size={13} color="var(--text-muted)" />
          </button>
        )}
      </div>

      {/* Right side icons */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>

        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            style={{ background: "none", border: "none", padding: 4, cursor: "pointer", position: "relative" }}
          >
            <Bell size={18} color="var(--text-secondary)" />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  background: "var(--color-critical)",
                  color: "white",
                  fontSize: 10,
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                width: 320,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600 }}>Notifications</span>
                <button
                  onClick={markAllRead}
                  style={{ background: "none", border: "none", fontSize: 11, color: "var(--accent-purple)", cursor: "pointer" }}
                >
                  Mark all read
                </button>
              </div>
              {notifs.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: "10px 16px",
                    borderBottom: "1px solid var(--border)",
                    background: n.unread ? "var(--bg-card-hover)" : "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => setNotifs(notifs.map((x) => x.id === n.id ? { ...x, unread: false } : x))}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    {n.unread && (
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "var(--accent-purple)",
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                      />
                    )}
                    <div>
                      <div style={{ fontSize: 12 }}>{n.text}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{n.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dark/Light mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}
        >
          {darkMode
            ? <Sun size={18} color="var(--text-secondary)" />
            : <Moon size={18} color="var(--text-secondary)" />
          }
        </button>

        {/* Profile dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "var(--accent-purple)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
                color: "white",
              }}
            >
              B
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>Bob</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Senior analyst</div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showProfile && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                width: 180,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                overflow: "hidden",
              }}
            >
              {[
                { label: "My profile" },
                { label: "Change password" },
                { label: "Settings" },
                { label: "Log out", danger: true },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setShowProfile(false)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    fontSize: 13,
                    color: item.danger ? "var(--color-critical)" : "var(--text-secondary)",
                    cursor: "pointer",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}