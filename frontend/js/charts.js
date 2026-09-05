/**
 * Chart.js Factory for Anomaly Analytics
 */
export function renderRiskDistributionChart(canvasId, dataPoints) {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) return;

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical Anomaly'],
      datasets: [{
        data: dataPoints || [65, 20, 10, 5],
        backgroundColor: ['#10b981', '#f59e0b', '#f97316', '#ef4444'],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#9ca3af' } }
      }
    }
  });
}

export function renderFraudTrendsChart(canvasId, labels, data) {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) return;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels || ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [{
        label: 'Anomalous Transaction Volume',
        data: data || [2, 1, 5, 14, 8, 22],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#9ca3af' } }
      },
      scales: {
        x: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } },
        y: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } }
      }
    }
  });
}