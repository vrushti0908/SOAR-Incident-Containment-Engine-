import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Login failed"); setLoading(false); return; }

      localStorage.setItem("soar_token",    data.access_token);
      localStorage.setItem("soar_role",     data.role);
      localStorage.setItem("soar_username", username);
      navigate("/");
    } catch (e) {
      setError("Could not reach the server — is FastAPI running?");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 36, width: 360 }}>

        {/* Logo / title */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
            ◈ SOAR Engine
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Incident Containment Console</div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>Username</div>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="analyst1"
              style={{ width: "100%", background: "var(--bg-page)", border: "1px solid var(--border-light)", borderRadius: 8, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>Password</div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              style={{ width: "100%", background: "var(--bg-page)", border: "1px solid var(--border-light)", borderRadius: 8, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>

          {error && <div style={{ color: "var(--color-critical)", fontSize: 12, marginBottom: 14, textAlign: "center" }}>{error}</div>}

          <button type="submit" disabled={loading}
            style={{ width: "100%", background: "var(--accent-purple)", border: "none", color: "white", borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Role reference */}
        <div style={{ marginTop: 24, padding: "12px 14px", background: "var(--bg-page)", borderRadius: 8, fontSize: 11, color: "var(--text-muted)" }}>
          <div style={{ fontWeight: 600, marginBottom: 6, color: "var(--text-secondary)" }}>Demo credentials</div>
          {[
            { user: "analyst1",  pass: "analyst123",  role: "SOC Analyst" },
            { user: "engineer1", pass: "engineer123", role: "Security Engineer" },
            { user: "senior1",   pass: "senior123",   role: "Senior Analyst" },
          ].map(c => (
            <div key={c.user} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontFamily: "monospace" }}>{c.user} / {c.pass}</span>
              <span style={{ color: "var(--accent-purple)" }}>{c.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}