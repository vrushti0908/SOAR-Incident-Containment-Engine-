// Renders the two Chart.js canvases. Chart.js is already loaded via CDN in
// index.html -- it just had nothing calling it before.

let riskChartInstance = null;
let alertsChartInstance = null;

function renderRiskChart(stats) {
    const ctx = document.getElementById("riskChart");
    if (!ctx || typeof Chart === "undefined") return;

    const data = [
        stats.critical_count || 0,
        stats.high_count || 0,
        stats.medium_count || 0,
        stats.low_count || 0
    ];

    if (riskChartInstance) {
        riskChartInstance.data.datasets[0].data = data;
        riskChartInstance.update();
        return;
    }

    riskChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Critical", "High", "Medium", "Low"],
            datasets: [{
                data: data,
                backgroundColor: ["#EF4444", "#F97316", "#F59E0B", "#22C55E"],
                borderWidth: 0
            }]
        },
        options: {
            cutout: "70%",
            plugins: { legend: { display: false } }
        }
    });
}

function renderAlertsChart(alerts) {
    const ctx = document.getElementById("alertsChart");
    if (!ctx || typeof Chart === "undefined") return;

    // Bucket alerts into the last 7 calendar days
    const days = [];
    const buckets = {};
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        days.push(key);
        buckets[key] = 0;
    }
    (alerts || []).forEach(a => {
        const key = (a.timestamp || "").slice(0, 10);
        if (key in buckets) buckets[key]++;
    });

    const counts = days.map(d => buckets[d]);
    const labels = days.map(d => d.slice(5));

    if (alertsChartInstance) {
        alertsChartInstance.data.labels = labels;
        alertsChartInstance.data.datasets[0].data = counts;
        alertsChartInstance.update();
        return;
    }

    alertsChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Alerts",
                data: counts,
                borderColor: "#7C3AED",
                backgroundColor: "rgba(124,58,237,0.15)",
                tension: 0.35,
                fill: true,
                pointRadius: 3
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94A3B8" } },
                y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94A3B8" } }
            }
        }
    });
}