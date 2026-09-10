import { API } from '../api.js';
import { renderPagination } from '../pagination.js';

let currentPage = 1;
let pageSize = 10;
let isShowingAll = false;

export function renderAdmin() {
  return `
    <div>
      <h2>Administration & System Telemetry</h2>

      <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
        RBAC permission controls and infrastructure monitors
      </p>

      <div class="card table-container users-table-container">
        <h3 style="padding: 1rem 1.25rem;">
          User Authorization Ledger
        </h3>

        <table class="data-table users-table">
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
            <tr>
              <td colspan="5" style="text-align: center;">
                Loading user matrix...
              </td>
            </tr>
          </tbody>
        </table>

        <div id="users-pagination"></div>
      </div>
    </div>
  `;
}

async function loadUsers() {
  const tbody = document.getElementById('users-tbody');

  if (!tbody) return;

  try {
    const response = isShowingAll
      ? await API.getUsers(1, 5000)
      : await API.getUsers(currentPage, pageSize);

    const users = response.items || [];

    if (!users.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center;">
            No users found.
          </td>
        </tr>
      `;

      renderPagination({
        containerId: 'users-pagination',
        page: 1,
        pageSize,
        total: 0,
        pages: 1,
        isShowingAll
      });

      return;
    }

    tbody.innerHTML = users.map(u => `
      <tr>
        <td data-label="USER ID">
          <code>${u.id || u._id || ''}</code>
        </td>

        <td data-label="USERNAME">
          ${u.username || ''}
        </td>

        <td data-label="EMAIL">
          ${u.email || ''}
        </td>

        <td data-label="ROLE">
          <span class="badge badge-info">
            ${
              Array.isArray(u.roles) && u.roles.length
                ? u.roles.join(', ')
                : (u.role || 'Unknown role')
            }
          </span>
        </td>

        <td data-label="STATUS">
          <span style="color: var(--risk-low);">
            Active
          </span>
        </td>
      </tr>
    `).join('');

    renderPagination({
      containerId: 'users-pagination',
      page: isShowingAll ? 1 : currentPage,
      pageSize,
      total: response.total ?? users.length,
      pages: response.pages ?? 1,
      isShowingAll,

      onPageChange: (page) => {
        currentPage = page;
        loadUsers();
      },

      onPageSizeChange: (newPageSize) => {
        pageSize = newPageSize;
        currentPage = 1;
        isShowingAll = false;
        loadUsers();
      },

      onShowAll: (showAll) => {
        isShowingAll = showAll;
        currentPage = 1;
        loadUsers();
      }
    });

  } catch (error) {
    console.error('Failed to load users:', error);

    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center;">
          Failed to load users.
        </td>
      </tr>
    `;
  }
}

export async function initAdminEvents() {
  currentPage = 1;
  pageSize = 10;
  isShowingAll = false;

  await loadUsers();
}