import { API } from '../api.js';

export function renderAdmin() {
  return `
    <div>
      <h2>Administration & System Telemetry</h2>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem;">RBAC permission controls and infrastructure monitors</p>

      <div class="card table-container">
        <h3 style="padding: 1rem 1.25rem;">User Authorization Ledger</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="users-tbody">
            <tr><td colspan="5" style="text-align: center;">Loading user matrix...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export async function initAdminEvents() {
  const users = await API.getUsers().catch(() => []);
  const tbody = document.getElementById('users-tbody');
  if (tbody && Array.isArray(users) && users.length > 0) {
    tbody.innerHTML = users.map(u => `
      <tr>
        <td><code>${u.id || u._id}</code></td>
        <td>${u.username}</td>
        <td>${u.email}</td>
        <td><span class="badge badge-info">${u.role || 'Analyst'}</span></td>
        <td><span style="color: var(--risk-low);">Active</span></td>
      </tr>
    `).join('');
  }
}