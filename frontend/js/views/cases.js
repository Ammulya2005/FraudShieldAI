import { API } from '../api.js';
import { renderPagination } from '../pagination.js';

export function renderCases() {
  return `
    <div>
      <h2>Investigative Case Management</h2>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
        Audit and resolve flagged fraudulent incidents
      </p>

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
            <tr>
              <td colspan="5" style="text-align: center;">
                Loading investigation docket...
              </td>
            </tr>
          </tbody>
        </table>

        <div id="cases-pagination"></div>
      </div>
    </div>
  `;
}

export async function initCasesEvents() {
  let currentPage = 1;
  let pageSize = 10;
  let isShowingAll = false;

  async function loadData() {
    const tbody = document.getElementById('cases-tbody');
    if (!tbody) return;

    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center;">
          Loading cases...
        </td>
      </tr>
    `;

    try {
      let response;

      if (isShowingAll) {
        response = await API.getFraudCases(1, 5000);
      } else {
        response = await API.getFraudCases(currentPage, pageSize);
      }

      const cases = response.items || [];

      if (Array.isArray(cases) && cases.length > 0) {
        tbody.innerHTML = cases.map(c => `
          <tr>
            <td>
              <code>${c.id || c.case_id || 'N/A'}</code>
            </td>

            <td>
              ${c.user_id ?? 'N/A'}
            </td>

            <td>
              <span class="badge badge-${c.priority || 'high'}">
                ${c.priority || 'high'}
              </span>
            </td>

            <td>
              <strong>${c.final_prediction || 'N/A'}</strong>
            </td>

            <td>
              <button
                class="btn btn-sm btn-outline-danger btn-close-case"
                data-id="${c.id || c.case_id}"
              >
                Close Case
              </button>
            </td>
          </tr>
        `).join('');

        document
          .querySelectorAll('.btn-close-case')
          .forEach(btn => {
            btn.addEventListener('click', async (e) => {
              const id = e.target.getAttribute('data-id');

              const resolution = confirm(
                'Classify as Confirmed Fraud? Cancel for False Positive'
              )
                ? 'fraud'
                : 'false_positive';

              try {
                await API.closeCase(
                  id,
                  resolution,
                  'Analyst review completed via UI'
                );

                alert('Case status updated.');

                await loadData();

              } catch (error) {
                console.error(
                  'Failed to update case:',
                  error
                );

                alert('Failed to update case.');
              }
            });
          });

      } else {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center;">
              No open fraud cases found.
            </td>
          </tr>
        `;
      }

      renderPagination({
        containerId: 'cases-pagination',

        page: response.page || currentPage,

        pageSize: response.page_size || pageSize,

        total: response.total || cases.length,

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
        'Failed to load fraud cases:',
        error
      );

      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center;">
            Failed to load fraud cases.
          </td>
        </tr>
      `;

      const pagination = document.getElementById(
        'cases-pagination'
      );

      if (pagination) {
        pagination.innerHTML = '';
      }
    }
  }

  await loadData();
}