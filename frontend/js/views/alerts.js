import { API } from '../api.js';
import { AuthState } from '../auth.js';
import { renderPagination } from '../pagination.js';
export function renderAlerts() {
  return `
    <div>
      <h2>Active Security Alerts</h2>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
        Prioritized anomaly queue for analyst triage
      </p>

      <div class="card table-container">
        <table class="data-table alerts-table">
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
            <tr>
              <td colspan="6" style="text-align: center;">
                Loading alerts...
              </td>
            </tr>
          </tbody>
        </table>

        <div id="alerts-pagination"></div>
      </div>
    </div>
  `;
}

export async function initAlertsEvents() {
  let currentPage = 1;
  let pageSize = 10;
  let isShowingAll = false;

  async function loadData() {
    const tbody = document.getElementById('alerts-tbody');
    if (!tbody) return;

    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center;">
          Loading alerts...
        </td>
      </tr>
    `;

    try {
      let response;

      if (isShowingAll) {
        response = await API.getAlerts(1, 5000);
      } else {
        response = await API.getAlerts(currentPage, pageSize);
      }

      const alerts = response.items || [];

      if (Array.isArray(alerts) && alerts.length > 0) {
        tbody.innerHTML = alerts.map(a => `
          <tr>
          <td data-label="Severity">
           <span class="badge badge-${a.severity || 'medium'}">
             ${a.severity || 'Unknown'}
           </span>
          </td>

          <td data-label="Transaction ID">
            <code>${a.transaction_id || 'N/A'}</code>
          </td>

          <td data-label="Alert Type">
           ${a.alert_type || 'N/A'}
          </td>

          <td data-label="Risk Score">
           <strong>
             ${(Number(a.risk_score || 0) * 100).toFixed(1)}%
           </strong>
        </td>

        <td data-label="Message">
          ${a.message || 'N/A'}
        </td>

        <td data-label="Action">
  ${
    AuthState.canAccess([
      'fraud_manager',
      'admin',
      'super_admin'
    ])
      ? `
        <button
          class="btn btn-sm btn-success btn-resolve"
          data-id="${a.alert_id || a.id || a._id}"
        >
          Resolve
        </button>
      `
      : `
        <span style="color: var(--text-muted);">
          View only
        </span>
      `
  }
</td>
          </tr>
        `).join('');

        document
          .querySelectorAll('.btn-resolve')
          .forEach(btn => {
            btn.addEventListener('click', async (e) => {
              const id = e.target.getAttribute('data-id');

             const confirmed = confirm(
                 'Are you sure you want to resolve this alert?'
                );

                if (!confirmed) return;

                try {
                  await API.resolveAlert(
                   id,
                  'Alert resolved by authorized user via FraudShieldAI'
               );

               alert('Alert resolved successfully.');

               await loadData();

              } catch (error) {
                console.error(
                  'Failed to resolve alert:',
                  error
                );

                alert(
                  'Failed to resolve alert.'
                );
              }
            });
          });

      } else {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center;">
              No unresolved alerts in queue.
            </td>
          </tr>
        `;
      }

      renderPagination({
        containerId: 'alerts-pagination',

        page: response.page || currentPage,

        pageSize: response.page_size || pageSize,

        total: response.total || alerts.length,

        pages: response.pages || 1,

        isShowingAll,

        onPageChange: (page) => {
          currentPage = page;
          isShowingAll = false;
          loadData();
        },

        onPageSizeChange: (newPageSize) => {
          pageSize = newPageSize;
          currentPage = 1;
          isShowingAll = false;
          loadData();
        },

        onShowAll: (showAll) => {
          isShowingAll = showAll;
          currentPage = 1;
          loadData();
        }
      });

    } catch (error) {
      console.error(
        'Failed to load alerts:',
        error
      );

      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center;">
            Failed to load alerts.
          </td>
        </tr>
      `;

      const pagination = document.getElementById(
        'alerts-pagination'
      );

      if (pagination) {
        pagination.innerHTML = '';
      }
    }
  }

  await loadData();
}