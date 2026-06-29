document.addEventListener("DOMContentLoaded", async () => {
    refreshAll();
    setInterval(refreshAll, 6000);
    tickClock();
    setInterval(tickClock, 1000);
});

async function refreshAll() {
    const stats = await getData("/dashboard/stats");
    const alerts = await getData("/alerts");

    if (stats) {
        renderStats(stats);
        renderCountryList(stats.alerts_by_country);
        if (typeof renderRiskChart === "function") renderRiskChart(stats);
    }

    if (alerts) {
        renderIncidentTable(alerts);
        if (typeof renderAlertsChart === "function") renderAlertsChart(alerts);
    }

    // defined in auth.js -- only renders real data if logged in
    if (typeof renderApprovals === "function") renderApprovals();
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value ?? 0;
}

function renderStats(stats) {
    setText("totalAlerts", stats.total_alerts);
    setText("highRisk", stats.high_risk_alerts);
    setText("openCases", stats.open_cases);
    setText("closedCases", stats.closed_cases);
    setText("mttr", (stats.mttr ?? 0) + " s");

    setText("criticalCount", stats.critical_count);
    setText("highCount", stats.high_count);
    setText("mediumCount", stats.medium_count);
    setText("lowCount", stats.low_count);

    setText("intelQueries", stats.intel_queries);
    setText("blockedIPs", stats.blocked_ips);
    setText("isolatedHosts", stats.isolated_hosts);
    setText("pendingApprovals", stats.pending_approvals);
}

function renderCountryList(countryCounts) {
    const container = document.getElementById("worldMap");
    if (!container) return;

    const entries = Object.entries(countryCounts || {}).sort((a, b) => b[1] - a[1]).slice(0, 6);

    if (!entries.length) {
        container.innerHTML = `
            <div class="map-placeholder">
                <i class="fa-solid fa-globe"></i>
                <h3>World Threat Map</h3>
                <p>No alerts yet</p>
            </div>`;
        return;
    }

    container.innerHTML = `
        <div style="padding:1rem; display:flex; flex-direction:column; gap:0.6rem;">
            ${entries.map(([code, count]) => `
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; color:var(--text2);">
                    <span><i class="fa-solid fa-location-dot" style="color:var(--purple); margin-right:6px;"></i>${code}</span>
                    <strong style="color:var(--text);">${count}</strong>
                </div>
            `).join("")}
        </div>`;
}

function renderIncidentTable(alerts) {
    const table = document.getElementById("incidentTable");
    if (!table) return;

    if (!alerts.length) {
        table.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text3); padding:1rem;">No alerts yet</td></tr>`;
        return;
    }

    const sorted = [...alerts].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 50);

    table.innerHTML = sorted.map(alert => `
        <tr>
            <td>${alert.id}</td>
            <td>${alert.alert_type}</td>
            <td>${alert.source_ip}</td>
            <td>${alert.country ?? "Unknown"}</td>
            <td>${alert.risk_score}</td>
            <td>${alert.action}</td>
            <td>${alert.status}</td>
            <td>${alert.timestamp}</td>
        </tr>
    `).join("");
}

function tickClock() {
    const el = document.getElementById("systemTime");
    if (el) el.innerText = new Date().toLocaleTimeString();
}