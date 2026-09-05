import { API } from '../api.js';

export function renderTransactions() {
  return `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2>Transaction Stream Monitor</h2>
        <button id="btn-manual-tx" class="btn btn-primary">+ Simulate Transaction</button>
      </div>

      <div class="card table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Transaction ID</th>
              <th>User ID</th>
              <th>Amount</th>
              <th>Location</th>
              <th>Device</th>
              <th>Anomaly Score</th>
            </tr>
          </thead>
          <tbody id="tx-full-tbody">
            <tr><td colspan="7" style="text-align: center;">Ingesting transaction ledger...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export async function initTransactionsEvents() {
  async function loadData() {
    const data = await API.getTransactions().catch(() => []);
    const tbody = document.getElementById('tx-full-tbody');
    if (!tbody) return;

    if (Array.isArray(data) && data.length > 0) {
      tbody.innerHTML = data.map(tx => `
        <tr>
          <td>${new Date(tx.timestamp || Date.now()).toLocaleTimeString()}</td>
          <td><code>${tx.transaction_id}</code></td>
          <td>${tx.user_id}</td>
          <td>$${Number(tx.transaction_amount).toFixed(2)}</td>
          <td>${tx.location || 'N/A'}</td>
          <td>${tx.device_type || 'Unknown'}</td>
          <td><span class="badge ${tx.risk_score > 0.7 ? 'badge-critical' : 'badge-low'}">${(tx.risk_score * 100).toFixed(0)}</span></td>
        </tr>
      `).join('');
    }
  }

  loadData();
  document.getElementById('btn-manual-tx')?.addEventListener('click', async () => {
    const dummy = {
      transaction_id: "TX-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      user_id: 1001,
      transaction_amount: (Math.random() * 5000).toFixed(2),
      transaction_type: "DEBIT",
      timestamp: new Date().toISOString(),
      account_balance: 12000.0,
      device_type: "Mobile_iOS",
      location: "San Jose, CA",
      merchant_category: "Electronics",
      ip_address_flag: 1,
      previous_fraudulent_activity: 0,
      daily_transaction_count: 3,
      avg_transaction_amount_7d: 120.5,
      failed_transaction_count_7d: 0,
      card_type: "VISA",
      card_age: 180,
      transaction_distance: 45.2,
      authentication_method: "PIN",
      risk_score: 0.88,
      is_weekend: 0,
      ip_address: "192.168.1.100",
      gps_location: "37.3382,-121.8863"
    };
    await API.createTransaction(dummy);
    alert('Simulated transaction dispatched into ML pipeline.');
    loadData();
  });
}