import { useState, useEffect, useRef } from "react";
import { Search, Bell, Sun, Moon, ChevronDown, X, User, Lock, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000";

const STATIC_NOTIFS = [
  { id: 1, text: "INC-128: Malware detected on 185.220.101.1", time: "2 min ago", unread: true },
  { id: 2, text: "INC-127: Brute force attack blocked", time: "5 min ago", unread: true },
  { id: 3, text: "Playbook executed: High Risk Containment", time: "12 min ago", unread: true },
  { id: 4, text: "Firewall rule added for 91.23.66.10", time: "18 min ago", unread: true },
];

export default function TopBar({ darkMode, setDarkMode }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [notifs, setNotifs] = useState(STATIC_NOTIFS);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Read real auth state from localStorage
  const [username, setUsername] = useState(localStorage.getItem("soar_username") || "Guest");
  const [role, setRole] = useState(localStorage.getItem("soar_role") || "Not logged in");
  const isLoggedIn = !!localStorage.getItem("soar_token");

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifs.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function markAllRead() {
    setNotifs(notifs.map((n) => ({ ...n, unread: false })));
  }

  function handleLogout() {
    setShowLogoutConfirm(true);
    setShowProfile(false);
  }

  function confirmLogout() {
    // Clear all auth data from localStorage
    localStorage.removeItem("soar_token");
    localStorage.removeItem("soar_role");
    localStorage.removeItem("soar_username");
    setShowLogoutConfirm(false);
    setUsername("Guest");
    setRole("Not logged in");
    navigate("/login");
  }

  const avatarLetter = username ? username[0].toUpperCase() : "G";

  const profileItems = [
    { label: "My profile",       icon: User,     action: () => { setShowProfile(false); navigate("/users"); } },
    { label: "Change password",  icon: Lock,     action: () => { setShowProfile(false); setShowPasswordModal(true); } },
    { label: "Settings",         icon: Settings, action: () => { setShowProfile(false); navigate("/settings"); } },
    { label: "Log out",          icon: LogOut,   danger: true, action: handleLogout },
  ];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1px solid var(--border)", position: "relative", zIndex: 100 }}>

        {/* Search bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", width: 360 }}>
          <Search size={15} color="var(--text-muted)" />
          <input value={searchVal} onChange={(e) => setSearchVal(e.target.value)} placeholder="Search alerts, IPs, cases, playbooks..."
            style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 13, width: "100%" }} />
          {searchVal && (
            <button onClick={() => setSearchVal("")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
              <X size={13} color="var(--text-muted)" />
            </button>
          )}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>

          {/* Bell */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
              style={{ background: "none", border: "none", padding: 4, cursor: "pointer", position: "relative" }}>
              <Bell size={18} color="var(--text-secondary)" />
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: -2, right: -2, background: "var(--color-critical)", color: "white", fontSize: 10, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotif && (
              <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 320, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Notifications</span>
                  <button onClick={markAllRead} style={{ background: "none", border: "none", fontSize: 11, color: "var(--accent-purple)", cursor: "pointer" }}>Mark all read</button>
                </div>
                {notifs.map((n) => (
                  <div key={n.id} onClick={() => setNotifs(notifs.map((x) => x.id === n.id ? { ...x, unread: false } : x))}
                    style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", background: n.unread ? "var(--bg-card-hover)" : "transparent", cursor: "pointer" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      {n.unread && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent-purple)", flexShrink: 0, marginTop: 4 }} />}
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

          {/* Dark/Light toggle */}
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
            {darkMode ? <Sun size={18} color="var(--text-secondary)" /> : <Moon size={18} color="var(--text-secondary)" />}
          </button>

          {/* Profile */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <button onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "white" }}>
                {avatarLetter}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{username}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{role.replace(/_/g, " ")}</div>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {showProfile && (
              <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 200, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{username}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{role.replace(/_/g, " ")}</div>
                </div>
                {profileItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.label} onClick={item.action}
                      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "transparent", border: "none", borderBottom: idx < profileItems.length - 1 ? "1px solid var(--border)" : "none", textAlign: "left", fontSize: 13, color: item.danger ? "var(--color-critical)" : "var(--text-secondary)", cursor: "pointer" }}>
                      <Icon size={14} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout confirm modal */}
      {showLogoutConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }} onClick={() => setShowLogoutConfirm(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, width: 320 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Log out</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>Are you sure you want to log out?</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ background: "transparent", border: "1px solid var(--border-light)", color: "var(--text-secondary)", borderRadius: 7, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={confirmLogout} style={{ background: "var(--color-critical)", border: "none", color: "white", borderRadius: 7, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Log out</button>
            </div>
          </div>
        </div>
      )}

      {/* Change password modal */}
      {showPasswordModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }} onClick={() => setShowPasswordModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, width: 340 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Change password</div>
            {["Current password", "New password", "Confirm new password"].map((label) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>{label}</div>
                <input type="password" style={{ width: "100%", background: "var(--bg-page)", border: "1px solid var(--border-light)", borderRadius: 7, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <button onClick={() => setShowPasswordModal(false)} style={{ background: "transparent", border: "1px solid var(--border-light)", color: "var(--text-secondary)", borderRadius: 7, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => { setShowPasswordModal(false); alert("Password changed!"); }} style={{ background: "var(--accent-purple)", border: "none", color: "white", borderRadius: 7, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Update password</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}