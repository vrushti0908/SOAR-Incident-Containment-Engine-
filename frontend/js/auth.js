// Login state + the Pending Approval panel. Uses localStorage since this is
// a real page served by your own FastAPI app, not a chat artifact.

function getAuth() {
    const token = localStorage.getItem("soar_token");
    const role = localStorage.getItem("soar_role");
    const username = localStorage.getItem("soar_username");
    return token ? { token, role, username } : null;
}

function setAuth(token, role, username) {
    localStorage.setItem("soar_token", token);
    localStorage.setItem("soar_role", role);
    localStorage.setItem("soar_username", username);
}

function clearAuth() {
    localStorage.removeItem("soar_token");
    localStorage.removeItem("soar_role");
    localStorage.removeItem("soar_username");
}

function renderAuthUI() {
    const auth = getAuth();
    const usernameEl = document.getElementById("username");
    const roleEl = document.getElementById("role");
    const topRight = document.querySelector(".top-right");

    const existingForm = document.getElementById("loginForm");
    if (existingForm) existingForm.remove();
    const existingLogout = document.getElementById("logoutBtn");
    if (existingLogout) existingLogout.remove();

    if (auth) {
        if (usernameEl) usernameEl.innerText = auth.username;
        if (roleEl) roleEl.innerText = auth.role;

        const btn = document.createElement("button");
        btn.id = "logoutBtn";
        btn.className = "icon-btn";
        btn.title = "Logout";
        btn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
        btn.onclick = () => { clearAuth(); renderAuthUI(); if (typeof refreshAll === "function") refreshAll(); };
        topRight.appendChild(btn);

    } else {
        if (usernameEl) usernameEl.innerText = "Not logged in";
        if (roleEl) roleEl.innerText = "Guest";

        const form = document.createElement("div");
        form.id = "loginForm";
        form.style.cssText = "display:flex; gap:6px; align-items:center; margin-right:10px;";
        form.innerHTML = `
            <input id="loginUser" placeholder="username" style="width:90px; padding:6px 8px; border-radius:6px; border:1px solid var(--border); background:var(--card2); color:var(--text); font-size:0.8rem;">
            <input id="loginPass" type="password" placeholder="password" style="width:90px; padding:6px 8px; border-radius:6px; border:1px solid var(--border); background:var(--card2); color:var(--text); font-size:0.8rem;">
            <button id="loginBtn" class="icon-btn" title="Login"><i class="fa-solid fa-right-to-bracket"></i></button>
        `;
        topRight.insertBefore(form, topRight.firstChild);
        document.getElementById("loginBtn").onclick = doLogin;
    }
}

async function doLogin() {
    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value;

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            alert(err.detail || "Login failed");
            return;
        }
        const data = await res.json();
        setAuth(data.access_token, data.role, username);
        renderAuthUI();
        if (typeof refreshAll === "function") refreshAll();
    } catch (e) {
        alert("Could not reach server");
    }
}

async function renderApprovals() {
    const container = document.getElementById("approvalContainer");
    if (!container) return;
    const auth = getAuth();

    if (!auth) {
        container.innerHTML = `<p style="color:var(--text3); font-size:0.85rem; text-align:center; padding:1rem;">Log in (top right) to view pending approvals.</p>`;
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/approvals`, {
            headers: { Authorization: `Bearer ${auth.token}` }
        });
        if (res.status === 401) {
            clearAuth();
            renderAuthUI();
            container.innerHTML = `<p style="color:var(--text3); font-size:0.85rem; text-align:center; padding:1rem;">Session expired -- log in again.</p>`;
            return;
        }
        const all = await res.json();
        const pending = all.filter(a => a.status === "PENDING");

        if (!pending.length) {
            container.innerHTML = `<p style="color:var(--text3); font-size:0.85rem; text-align:center; padding:1rem;">No pending approvals right now.</p>`;
            return;
        }

        const canAct = auth.role === "senior_analyst";

        container.innerHTML = pending.map(a => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; margin-bottom:8px; background:var(--card2); border-radius:8px; border:1px solid var(--border);">
                <div>
                    <strong style="font-size:0.85rem; color:var(--text);">${a.action_type} → ${a.target}</strong>
                    <div style="font-size:0.72rem; color:var(--text3);">Alert #${a.alert_id}</div>
                </div>
                <div style="display:flex; gap:6px;">
                    <button onclick="actOnApproval(${a.id}, 'approve')" ${canAct ? "" : "disabled title='Requires senior_analyst role'"} style="background:#22C55E; border:none; color:#fff; padding:5px 10px; border-radius:6px; font-size:0.75rem; cursor:pointer; opacity:${canAct ? 1 : 0.4};">Approve</button>
                    <button onclick="actOnApproval(${a.id}, 'reject')" ${canAct ? "" : "disabled title='Requires senior_analyst role'"} style="background:#EF4444; border:none; color:#fff; padding:5px 10px; border-radius:6px; font-size:0.75rem; cursor:pointer; opacity:${canAct ? 1 : 0.4};">Reject</button>
                </div>
            </div>
        `).join("");
    } catch (e) {
        container.innerHTML = `<p style="color:var(--text3);">Could not load approvals.</p>`;
    }
}

async function actOnApproval(id, action) {
    const auth = getAuth();
    try {
        const res = await fetch(`${API_BASE}/approvals/${id}/${action}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${auth.token}` }
        });
        const data = await res.json();
        if (!res.ok) { alert(data.detail || "Action failed"); return; }
        if (typeof refreshAll === "function") refreshAll();
    } catch (e) {
        alert("Could not reach server");
    }
}

document.addEventListener("DOMContentLoaded", renderAuthUI);