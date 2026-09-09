import { API } from '../api.js';
import {
  renderRiskDistributionChart,
  renderFraudTrendsChart
} from '../charts.js';

let fraudTrendChart = null;
let riskDistributionChart = null;

export function renderDashboard() {
  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
        <div>
          <h2>Real-Time Surveillance Overview</h2>
          <p style="color:var(--text-muted); font-size:0.875rem;">
            Continuous scoring engine powered by XGBoost & Isolation Forest
          </p>
        </div>
      </div>

      <div class="dashboard-grid">

        <div class="card card-metric">
          <h3>Total Ingested (24h)</h3>
          <div class="metric-val" id="metric-total-tx">--</div>
        </div>

        <div class="card card-metric">
          <h3>High Risk Velocity</h3>
          <div class="metric-val" style="color:var(--risk-high);" id="metric-high-risk">
            --
          </div>
        </div>

        <div class="card card-metric">
          <h3>Active Fraud Alerts</h3>
          <div class="metric-val" style="color:var(--risk-critical);" id="metric-active-alerts">
            --
          </div>
        </div>

        <div class="card card-metric">
          <h3>Avg Inference Latency</h3>
          <div class="metric-val" style="color:var(--risk-low);" id="metric-latency">
            --
          </div>
        </div>

      </div>

      <div class="grid-2col">

        <div class="card">
          <h3>Fraud Velocity Trend</h3>
          <canvas
            id="fraudTrendCanvas"
            style="max-height:260px; margin-top:1rem;">
          </canvas>
        </div>

        <div class="card">
          <h3>Risk Distribution</h3>
          <canvas
            id="riskDistributionCanvas"
            style="max-height:260px; margin-top:1rem;">
          </canvas>
        </div>

      </div>

      <div class="card">
        <h3>Live Incoming Stream Anomalies</h3>

        <div class="table-container">
          <table class="data-table live-stream-table">

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
              <tr>
                <td colspan="6" style="text-align:center;">
                  Loading stream packets...
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>

    </div>
  `;
}


export async function initDashboardEvents() {

  let fraudHistory = [];
  let riskData = [0, 0, 0, 0];

  async function refreshDashboard() {

    try {

      // -----------------------------------------
      // 1. Get dashboard summary
      // -----------------------------------------

      const summaryResponse = await API.getDashboardSummary();

      const summary = summaryResponse?.data || summaryResponse || {};

      // -----------------------------------------
      // 2. Get live Kafka metrics
      // -----------------------------------------

      const streamResponse = await API.getStreamMetrics();

      const streamMetrics =
        streamResponse?.metrics ||
        streamResponse ||
        {};

      // -----------------------------------------
      // 3. Update numerical cards
      // -----------------------------------------

      const totalTransactions =
        Number(summary.total_transactions ?? streamMetrics.total_ingested ?? 0);

      const highRisk =
        Number(summary.high_risk_transactions ?? 0);

      const activeAlerts =
        Number(summary.open_alerts ?? 0);

      const latency =
        Number(streamMetrics.latency_ms ?? 0);

      const totalElement =
        document.getElementById('metric-total-tx');

      const highRiskElement =
        document.getElementById('metric-high-risk');

      const alertsElement =
        document.getElementById('metric-active-alerts');

      const latencyElement =
        document.getElementById('metric-latency');

      if (totalElement) {
        totalElement.innerText =
          totalTransactions.toLocaleString();
      }

      if (highRiskElement) {
        highRiskElement.innerText =
          highRisk.toLocaleString();
      }

      if (alertsElement) {
        alertsElement.innerText =
          activeAlerts.toLocaleString();
      }

      if (latencyElement) {
        latencyElement.innerText =
          `${latency.toFixed(1)} ms`;
      }


      // -----------------------------------------
      // 4. Get recent live transactions
      // -----------------------------------------

      const liveTx = await API.getLiveTransactions(10);

      const transactions =
        Array.isArray(liveTx)
          ? liveTx
          : (liveTx?.stream_records || []);

      const tbody =
        document.getElementById('live-tx-tbody');

      if (tbody && transactions.length > 0) {

        tbody.innerHTML = transactions.map(tx => {

          const riskScore =
            Number(tx.risk_score || 0);

          const badgeClass =
            riskScore > 0.8
              ? 'badge-critical'
              : riskScore > 0.5
                ? 'badge-high'
                : 'badge-low';

          const status =
            tx.final_prediction === 'fraud' ||
            riskScore > 0.7
              ? '<span style="color:var(--risk-critical)">Suspicious</span>'
              : '<span style="color:var(--risk-low)">Cleared</span>';
return `
  <tr>

    <td data-label="Tx ID">
      <code>${tx.transaction_id || tx.id || '-'}</code>
    </td>

    <td data-label="User ID">
      ${tx.user_id ?? '-'}
    </td>

    <td data-label="Amount">
      $${Number(tx.transaction_amount || 0).toFixed(2)}
    </td>

    <td data-label="Merchant">
      ${tx.merchant_category || 'General'}
    </td>

    <td data-label="Risk Score">
      <span class="badge ${badgeClass}">
        ${(riskScore * 100).toFixed(1)}%
      </span>
    </td>

    <td data-label="Status">
      ${status}
    </td>

  </tr>
`;
        }).join('');

      }


      // -----------------------------------------
      // 5. Calculate risk distribution
      // -----------------------------------------

      let low = 0;
      let medium = 0;
      let high = 0;
      let critical = 0;

      transactions.forEach(tx => {

        const score =
          Number(tx.risk_score || 0);

        if (score <= 0.25) {
          low++;
        } else if (score <= 0.50) {
          medium++;
        } else if (score <= 0.80) {
          high++;
        } else {
          critical++;
        }

      });

      riskData = [low, medium, high, critical];

      // Avoid an empty doughnut chart
      if (riskData.every(value => value === 0)) {
        riskData = [1, 0, 0, 0];
      }


      // -----------------------------------------
      // 6. Update fraud trend
      // -----------------------------------------

      const now = new Date();

      const timeLabel =
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

      fraudHistory.push({
        time: timeLabel,
        fraud: Number(streamMetrics.fraud_detected || 0)
      });

      // Keep only latest 10 points
      if (fraudHistory.length > 10) {
        fraudHistory.shift();
      }


      // -----------------------------------------
      // 7. Update charts
      // -----------------------------------------

      if (fraudTrendChart) {

        fraudTrendChart.data.labels =
          fraudHistory.map(point => point.time);

        fraudTrendChart.data.datasets[0].data =
          fraudHistory.map(point => point.fraud);

        fraudTrendChart.update('none');

      }


      if (riskDistributionChart) {

        riskDistributionChart.data.datasets[0].data =
          riskData;

        riskDistributionChart.update('none');

      }


    } catch (error) {

      console.error(
        'Dashboard refresh error:',
        error
      );

    }

  }


  // -----------------------------------------
  // Create initial charts
  // -----------------------------------------

  fraudTrendChart =
    renderFraudTrendsChart(
      'fraudTrendCanvas',
      [],
      []
    );

  riskDistributionChart =
    renderRiskDistributionChart(
      'riskDistributionCanvas',
      [1, 0, 0, 0]
    );
    /* -----------------------------------------
     Update charts when theme changes
     ----------------------------------------- */

  window.addEventListener(
    'fraudshield-theme-changed',
    () => {

      /*
       * Destroy existing charts.
       */

      if (fraudTrendChart) {

        fraudTrendChart.destroy();

        fraudTrendChart = null;

      }


      if (riskDistributionChart) {

        riskDistributionChart.destroy();

        riskDistributionChart = null;

      }


      /*
       * Recreate charts using the
       * currently active theme.
       */

      fraudTrendChart =
        renderFraudTrendsChart(
          'fraudTrendCanvas',
          fraudHistory.map(
            point => point.time
          ),
          fraudHistory.map(
            point => point.fraud
          )
        );


      riskDistributionChart =
        renderRiskDistributionChart(
          'riskDistributionCanvas',
          riskData
        );

    }
  );


  // First update immediately
  await refreshDashboard();


  // Refresh every 3 seconds
  const poller =
    setInterval(refreshDashboard, 3000);

  window.currentViewPoller =
    poller;
}