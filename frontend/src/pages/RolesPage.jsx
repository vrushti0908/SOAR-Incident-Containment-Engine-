import CardShell from "../components/CardShell";
import { Check, X } from "lucide-react";

const roles = [
  {
    name: "Senior Analyst",
    permissions: { viewAlerts: true, runPlaybooks: true, approveHighRisk: true, manageUsers: true, editFirewall: true },
  },
  {
    name: "Analyst",
    permissions: { viewAlerts: true, runPlaybooks: true, approveHighRisk: false, manageUsers: false, editFirewall: false },
  },
  {
    name: "Backend Lead",
    permissions: { viewAlerts: true, runPlaybooks: true, approveHighRisk: false, manageUsers: false, editFirewall: true },
  },
  {
    name: "Viewer",
    permissions: { viewAlerts: true, runPlaybooks: false, approveHighRisk: false, manageUsers: false, editFirewall: false },
  },
];

const permLabels = {
  viewAlerts: "View alerts",
  runPlaybooks: "Run playbooks",
  approveHighRisk: "Approve high-risk actions",
  manageUsers: "Manage users",
  editFirewall: "Edit firewall rules",
};

function PermIcon({ allowed }) {
  return allowed ? (
    <Check size={15} color="var(--color-low)" />
  ) : (
    <X size={15} color="var(--text-muted)" />
  );
}

export default function RolesPage() {
  return (
    <CardShell title="Roles & permissions (RBAC)">
      <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
            <th style={{ paddingBottom: 12, fontWeight: 500 }}>Role</th>
            {Object.values(permLabels).map((label) => (
              <th key={label} style={{ paddingBottom: 12, fontWeight: 500, textAlign: "center" }}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r.name} style={{ borderTop: "1px solid var(--border)" }}>
              <td style={{ padding: "12px 0", fontWeight: 500 }}>{r.name}</td>
              {Object.keys(permLabels).map((key) => (
                <td key={key} style={{ padding: "12px 0", textAlign: "center" }}>
                  <PermIcon allowed={r.permissions[key]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </CardShell>
  );
}