import { API } from '../api.js';

export function renderModels() {
  return `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2>Machine Learning Registry & Retraining</h2>
        <button id="btn-train-model" class="btn btn-primary">⚡ Retrain Isolation Forest</button>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <h3>Active Model</h3>
          <div class="metric-val" style="font-size: 1.25rem; margin-top: 0.5rem;">XGBoost-Ensemble-v2.1</div>
          <p style="color: var(--risk-low); font-size: 0.85rem; margin-top: 0.5rem;">● Deployed in Live Pipeline</p>
        </div>
        <div class="card">
          <h3>ROC-AUC Score</h3>
          <div class="metric-val">0.984</div>
        </div>
        <div class="card">
          <h3>F1-Score</h3>
          <div class="metric-val">0.941</div>
        </div>
      </div>

      <div class="card table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Model Name</th>
              <th>Version</th>
              <th>Trained Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="models-tbody">
            <tr><td colspan="4" style="text-align: center;">Loading model artifacts...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export async function initModelsEvents() {
  const models = await API.getModels().catch(() => []);
  const tbody = document.getElementById('models-tbody');
  if (tbody && Array.isArray(models) && models.length > 0) {
    tbody.innerHTML = models.map(m => `
      <tr>
        <td><strong>${m.name || 'Isolation Forest'}</strong></td>
        <td><code>${m.version || 'v1.0.0'}</code></td>
        <td>${new Date(m.created_at || Date.now()).toLocaleDateString()}</td>
        <td><span class="badge badge-low">Operational</span></td>
      </tr>
    `).join('');
  }

  document.getElementById('btn-train-model')?.addEventListener('click', async () => {
    alert("Triggering backend Kafka & Scikit-Learn training loop...");
    await API.triggerTraining({});
    alert("Retraining job dispatched successfully.");
  });
}