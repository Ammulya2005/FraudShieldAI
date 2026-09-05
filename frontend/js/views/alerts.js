import { API } from '../api.js';

export function renderAlerts() {
  return `
    <div>
      <h2>Active Security Alerts</h2>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Prioritized anomaly queue for analyst triage</p>
      
      <div class="card table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Transaction ID</th>
              <th>Alert Type</th>
              <th>Risk Score</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="alerts-tbody">
            <tr><td colspan="6" style="text-align: center;">Loading alerts...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export async function initAlertsEvents() {
  const alerts = await API.getAlerts().catch(() => []);
  const tbody = document.getElementById('alerts-tbody');
  if (!tbody) return;

  if (Array.isArray(alerts) && alerts.length > 0) {
    tbody.innerHTML = alerts.map(a => `
      <tr>
        <td><span class="badge badge-${a.severity}">${a.severity}</span></td>
        <td><code>${a.transaction_id}</code></td>
        <td>${a.alert_type}</td>
        <td><strong>${(a.risk_score * 100).toFixed(1)}%</strong></td>
        <td>${a.message}</td>
        <td>
          <button class="btn btn-sm btn-success btn-resolve" data-id="${a.id || a._id}">Resolve</button>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('.btn-resolve').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        const note = prompt("Enter resolution notes:");
        if (note) {
          await API.resolveAlert(id, note);
          e.target.closest('tr').remove();
        }
      });
    });
  } else {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No unresolved alerts in queue.</td></tr>`;
  }
}