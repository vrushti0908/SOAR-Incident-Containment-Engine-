import {
  LayoutDashboard, Bell, ListChecks, FolderKanban, Clock,
  ShieldAlert, Flame, FileBarChart, Plug, Zap, Calendar,
  Users, KeyRound, Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Bell, label: "Alerts", path: "/alerts" },
  { icon: FolderKanban, label: "Cases", path: "/cases" },
  { icon: Clock, label: "Timeline", path: "/timeline" },
  { icon: ListChecks, label: "Playbooks", path: "/playbooks" },
  { icon: ShieldAlert, label: "Threat intel", path: "/threat-intel" },
  { icon: Flame, label: "Firewall rules", path: "/firewall-rules" },
  { icon: FileBarChart, label: "Reports", path: "/reports" },
];

const automationItems = [
  { icon: Plug, label: "Integrations", path: "/integrations" },
  { icon: Zap, label: "Actions", path: "/actions" },
  { icon: Calendar, label: "Schedules", path: "/schedules" },
];

const adminItems = [
  { icon: Users, label: "Users", path: "/users" },
  { icon: KeyRound, label: "Roles", path: "/roles" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

function NavGroup({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {items.map(({ icon: Icon, label, path }) => (
        <NavLink
          key={label}
          to={path}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px",
            borderRadius: 8,
            textDecoration: "none",
            background: isActive ? "var(--accent-purple-dim)" : "transparent",
            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
            fontSize: 13,
          })}
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </div>
  );
}

export default function Sidebar() {
  return (
    <div
      style={{
        width: 220,
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border)",
        padding: "18px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 20px" }}>
        <ShieldAlert size={22} color="var(--accent-purple)" />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>SOAR</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Incident engine</div>
        </div>
      </div>

      <NavGroup items={navItems} />

      <div style={{ fontSize: 11, color: "var(--text-muted)", padding: "16px 8px 6px", letterSpacing: 0.5 }}>
        AUTOMATION
      </div>
      <NavGroup items={automationItems} />

      <div style={{ fontSize: 11, color: "var(--text-muted)", padding: "16px 8px 6px", letterSpacing: 0.5 }}>
        ADMIN
      </div>
      <NavGroup items={adminItems} />

      <div style={{ marginTop: "auto", padding: "14px 8px 0", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-low)" }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>System status</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>All systems operational</div>
          </div>
        </div>
      </div>
    </div>
  );
}