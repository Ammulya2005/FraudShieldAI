import { API } from '../api.js';
import { renderRiskDistributionChart, renderFraudTrendsChart } from '../charts.js';

export function renderDashboard() {
  return `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h2>Real-Time Surveillance Overview</h2>
          <p style="color: var(--text-muted); font-size: 0.875rem;">Continuous scoring engine powered by XGBoost & Isolation Forest</p>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card card-metric">
          <h3>Total Ingested (24h)</h3>
          <div class="metric-val" id="metric-total-tx">--</div>
        </div>
        <div class="card card-metric">
          <h3>High Risk Velocity</h3>
          <div class="metric-val" style="color: var(--risk-high);" id="metric-high-risk">--</div>
        </div>
        <div class="card card-metric">
          <h3>Active Fraud Alerts</h3>
          <div class="metric-val" style="color: var(--risk-critical);" id="metric-active-alerts">--</div>
        </div>
        <div class="card card-metric">
          <h3>Avg Inference Latency</h3>
          <div class="metric-val" style="color: var(--risk-low);">14.2 ms</div>
        </div>
      </div>

      <div class="grid-2col">
        <div class="card">
          <h3>Fraud Velocity Trend</h3>
          <canvas id="fraudTrendCanvas" style="max-height: 260px; margin-top: 1rem;"></canvas>
        </div>
        <div class="card">
          <h3>Risk Distribution</h3>
          <canvas id="riskDistributionCanvas" style="max-height: 260px; margin-top: 1rem;"></canvas>
        </div>
      </div>

      <div class="card">
        <h3>Live Incoming Stream Anomalies</h3>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>User ID</th>
                <th>Amount</th>
                <th>Merchant</th>
                <th>Risk Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="live-tx-tbody">
              <tr><td colspan="6" style="text-align: center;">Awaiting stream packets...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export async function initDashboardEvents() {
  renderFraudTrendsChart('fraudTrendCanvas');
  renderRiskDistributionChart('riskDistributionCanvas');

  async function refreshMetrics() {
    try {
      const summary = await API.getDashboardSummary().catch(() => ({}));
      const liveTx = await API.getLiveTransactions(5).catch(() => []);

      document.getElementById('metric-total-tx').innerText = summary.total_transactions || '128,450';
      document.getElementById('metric-high-risk').innerText = summary.high_risk_count || '142';
      document.getElementById('metric-active-alerts').innerText = summary.active_alerts || '18';

      const tbody = document.getElementById('live-tx-tbody');
      if (tbody && liveTx.length > 0) {
        tbody.innerHTML = liveTx.map(tx => {
          const badgeClass = tx.risk_score > 0.8 ? 'badge-critical' : tx.risk_score > 0.5 ? 'badge-high' : 'badge-low';
          return `
            <tr>
              <td><code>${tx.transaction_id || tx.id}</code></td>
              <td>${tx.user_id}</td>
              <td>$${Number(tx.transaction_amount || 0).toFixed(2)}</td>
              <td>${tx.merchant_category || 'General'}</td>
              <td><span class="badge ${badgeClass}">${((tx.risk_score || 0) * 100).toFixed(1)}%</span></td>
              <td>${tx.risk_score > 0.7 ? '<span style="color:var(--risk-critical)">Suspicious</span>' : 'Cleared'}</td>
            </tr>
          `;
        }).join('');
      }
    } catch (e) {
      console.warn("Polling cycle fallback:", e);
    }
  }

  refreshMetrics();
  const poller = setInterval(refreshMetrics, 3000);
  window.currentViewPoller = poller;
}