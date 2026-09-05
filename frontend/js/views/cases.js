import { API } from '../api.js';

export function renderCases() {
  return `
    <div>
      <h2>Investigative Case Management</h2>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Audit and resolve flagged fraudulent incidents</p>

      <div class="card table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>User ID</th>
              <th>Priority</th>
              <th>Model Prediction</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="cases-tbody">
            <tr><td colspan="5" style="text-align: center;">Loading investigation docket...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export async function initCasesEvents() {
  const cases = await API.getFraudCases().catch(() => []);
  const tbody = document.getElementById('cases-tbody');
  if (!tbody) return;

  if (Array.isArray(cases) && cases.length > 0) {
    tbody.innerHTML = cases.map(c => `
      <tr>
        <td><code>${c.id || c.case_id}</code></td>
        <td>${c.user_id}</td>
        <td><span class="badge badge-${c.priority || 'high'}">${c.priority || 'high'}</span></td>
        <td><strong>${c.final_prediction}</strong></td>
        <td>
          <button class="btn btn-sm btn-outline-danger btn-close-case" data-id="${c.id || c.case_id}">Close Case</button>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('.btn-close-case').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        const resolution = confirm("Classify as Confirmed Fraud? Cancel for False Positive") ? 'fraud' : 'false_positive';
        await API.closeCase(id, resolution, "Analyst review completed via UI");
        alert('Case status updated.');
        e.target.closest('tr').remove();
      });
    });
  } else {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No open fraud cases found.</td></tr>`;
  }
}