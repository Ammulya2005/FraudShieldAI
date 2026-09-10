import { API } from '../api.js';


/* ============================================================
   RENDER REQUESTS PAGE
   ============================================================ */

export function renderRequests() {

  return `

    <div class="requests-page">

      <!-- HEADER -->
      <div class="requests-header">

        <div>

          <span class="requests-kicker">
            ADMINISTRATION
          </span>

          <h1>
            Demo Requests
          </h1>

          <p>
            Review users who have requested access to
            the FraudShield AI platform.
          </p>

        </div>

        <div class="requests-live-status">

          <span class="requests-status-dot"></span>

          Request System Active

        </div>

      </div>


      <!-- SUMMARY CARDS -->
      <div class="requests-summary">

        <div class="request-stat-card">

          <span class="request-stat-icon">
            📋
          </span>

          <div>

            <span class="request-stat-label">
              Total Requests
            </span>

            <strong id="total-requests">
              0
            </strong>

          </div>

        </div>


        <div class="request-stat-card">

          <span class="request-stat-icon pending">
            ⏳
          </span>

          <div>

            <span class="request-stat-label">
              Pending
            </span>

            <strong id="pending-requests">
              0
            </strong>

          </div>

        </div>


        <div class="request-stat-card">

          <span class="request-stat-icon approved">
            ✓
          </span>

          <div>

            <span class="request-stat-label">
              Approved
            </span>

            <strong id="approved-requests">
              0
            </strong>

          </div>

        </div>


        <div class="request-stat-card">

          <span class="request-stat-icon rejected">
            ✕
          </span>

          <div>

            <span class="request-stat-label">
              Rejected
            </span>

            <strong id="rejected-requests">
              0
            </strong>

          </div>

        </div>

      </div>


      <!-- REQUEST PANEL -->
      <div class="requests-panel">

        <div class="requests-panel-header">

          <div>

            <h2>
              Incoming Requests
            </h2>

            <p>
              Review and manage demo access requests.
            </p>

          </div>


          <button
            type="button"
            id="refresh-requests"
            class="btn btn-sm btn-primary"
          >
            ↻ Refresh
          </button>

        </div>


        <!-- LOADING -->
        <div
          id="requests-loading"
          class="requests-loading"
        >
          Loading requests...
        </div>


        <!-- EMPTY -->
        <div
          id="requests-empty"
          class="requests-empty hidden"
        >

          <div class="requests-empty-icon">
            📭
          </div>

          <h3>
            No demo requests yet
          </h3>

          <p>
            New users who request a demo will appear here.
          </p>

        </div>


        <!-- TABLE -->
        <div
          id="requests-table-wrapper"
          class="requests-table-wrapper hidden"
        >

          <table class="requests-table">

            <thead>

              <tr>

                <th>
                  User
                </th>

                <th>
                  Email
                </th>

                <th>
                  Requested
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody id="requests-table-body">
            </tbody>

          </table>

        </div>

      </div>

    </div>

  `;
}


/* ============================================================
   INITIALIZE REQUEST EVENTS
   ============================================================ */

export async function initRequestsEvents() {

  injectRequestsStyles();


  const refreshButton =
    document.getElementById(
      'refresh-requests'
    );


  /* ----------------------------------------------------------
     LOAD REQUESTS
     ---------------------------------------------------------- */

  async function loadRequests() {

    const loading =
      document.getElementById(
        'requests-loading'
      );


    const empty =
      document.getElementById(
        'requests-empty'
      );


    const table =
      document.getElementById(
        'requests-table-wrapper'
      );


    const tbody =
      document.getElementById(
        'requests-table-body'
      );


    if (!loading || !tbody) {
      return;
    }


    loading.classList.remove(
      'hidden'
    );


    empty?.classList.add(
      'hidden'
    );


    table?.classList.add(
      'hidden'
    );


    try {

      const response =
        await fetch(
          '/api/v1/demo-requests'
        );


      if (!response.ok) {

        throw new Error(
          'Unable to load demo requests.'
        );

      }


      const data =
        await response.json();


      const requests =
        data.requests || [];


      /* Update summary */

      updateSummary(
        requests
      );


      tbody.innerHTML = '';


      /* No requests */

      if (!requests.length) {

        empty?.classList.remove(
          'hidden'
        );

        return;

      }


      /* Sort newest first */

      requests
        .sort(
          (a, b) =>
            new Date(
              b.requested_at
            ) -
            new Date(
              a.requested_at
            )
        )
        .forEach(
          request => {

            tbody.appendChild(
              createRequestRow(
                request,
                loadRequests
              )
            );

          }
        );


      table?.classList.remove(
        'hidden'
      );


    } catch (error) {

      console.error(
        'Could not load requests:',
        error
      );


      tbody.innerHTML = `

        <tr>

          <td
            colspan="5"
            class="requests-error"
          >
            ${escapeHtml(
              error.message
            )}
          </td>

        </tr>

      `;


      table?.classList.remove(
        'hidden'
      );


    } finally {

      loading.classList.add(
        'hidden'
      );

    }

  }


  /* ----------------------------------------------------------
     REFRESH BUTTON
     ---------------------------------------------------------- */

  refreshButton?.addEventListener(
    'click',
    loadRequests
  );


  /* Initial load */

  await loadRequests();

}


/* ============================================================
   CREATE REQUEST TABLE ROW
   ============================================================ */

function createRequestRow(
  request,
  reload
) {

  const row =
    document.createElement(
      'tr'
    );


  const requestedDate =
    request.requested_at
      ? new Date(
          request.requested_at
        ).toLocaleString()
      : '—';


  const status =
    request.status ||
    'Pending';


  row.innerHTML = `

    <!-- USER -->
    <td data-label="User">

      <div class="request-user">

        <div class="request-avatar">

          ${escapeHtml(
            getInitials(
              request.name
            )
          )}

        </div>


        <div>

          <strong>

            ${escapeHtml(
              request.name
            )}

          </strong>

          <span>

            Request #${escapeHtml(
              request.id
            )}

          </span>

        </div>

      </div>

    </td>


    <!-- EMAIL -->
    <td data-label="Email">

      <span class="request-email">

        ${escapeHtml(
          request.email
        )}

      </span>

    </td>


    <!-- REQUESTED DATE -->
    <td data-label="Requested">

      <span class="request-date">

        ${escapeHtml(
          requestedDate
        )}

      </span>

    </td>


    <!-- STATUS -->
    <td data-label="Status">

      <span
        class="request-status ${escapeHtml(
          status.toLowerCase()
        )}"
      >

        ${escapeHtml(
          status
        )}

      </span>

    </td>


    <!-- ACTION -->
    <td data-label="Action">

      <div class="request-actions">

        ${
          status === 'Pending'

            ? `

              <button
                type="button"
                class="request-action approve"
                data-id="${escapeHtml(
                  request.id
                )}"
                data-status="Approved"
              >
                ✓ Approve
              </button>


              <button
                type="button"
                class="request-action reject"
                data-id="${escapeHtml(
                  request.id
                )}"
                data-status="Rejected"
              >
                ✕ Reject
              </button>

            `

            : `

              <span class="request-completed">

                ${
                  status === 'Approved'

                    ? '✓ Access Approved'

                    : '✕ Request Rejected'

                }

              </span>

            `
        }

      </div>

    </td>

  `;


  /* ----------------------------------------------------------
     APPROVE / REJECT BUTTON EVENTS
     ---------------------------------------------------------- */

  row
    .querySelectorAll(
      '.request-action'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',
          async () => {

            const id =
              Number(
                button.dataset.id
              );


            const newStatus =
              button.dataset.status;


            const confirmed =
              window.confirm(
                `Are you sure you want to ${newStatus.toLowerCase()} this request?`
              );


            if (!confirmed) {
              return;
            }


            button.disabled =
              true;


            try {

              const response =
                await fetch(
                  `/api/v1/demo-requests/${id}?status=${encodeURIComponent(
                    newStatus
                  )}`,
                  {
                    method: 'PATCH'
                  }
                );


              const data =
                await response.json();


              if (!response.ok) {

                throw new Error(
                  data.detail ||
                  'Unable to update request.'
                );

              }


              /* Reload table */

              await reload();


            } catch (error) {

              console.error(
                'Request update error:',
                error
              );


              alert(
                error.message
              );


              button.disabled =
                false;

            }

          }
        );

      }
    );


  return row;

}


/* ============================================================
   UPDATE SUMMARY COUNTERS
   ============================================================ */

function updateSummary(
  requests
) {

  const total =
    requests.length;


  const pending =
    requests.filter(
      request =>
        request.status === 'Pending'
    ).length;


  const approved =
    requests.filter(
      request =>
        request.status === 'Approved'
    ).length;


  const rejected =
    requests.filter(
      request =>
        request.status === 'Rejected'
    ).length;


  const totalElement =
    document.getElementById(
      'total-requests'
    );


  const pendingElement =
    document.getElementById(
      'pending-requests'
    );


  const approvedElement =
    document.getElementById(
      'approved-requests'
    );


  const rejectedElement =
    document.getElementById(
      'rejected-requests'
    );


  if (totalElement) {
    totalElement.textContent =
      total;
  }


  if (pendingElement) {
    pendingElement.textContent =
      pending;
  }


  if (approvedElement) {
    approvedElement.textContent =
      approved;
  }


  if (rejectedElement) {
    rejectedElement.textContent =
      rejected;
  }

}


/* ============================================================
   GET USER INITIALS
   ============================================================ */

function getInitials(
  name = ''
) {

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(
      part =>
        part
          .charAt(0)
          .toUpperCase()
    )
    .join('') || '?';

}


/* ============================================================
   ESCAPE HTML
   ============================================================ */

function escapeHtml(
  value
) {

  return String(
    value ?? ''
  )

    .replace(
      /&/g,
      '&amp;'
    )

    .replace(
      /</g,
      '&lt;'
    )

    .replace(
      />/g,
      '&gt;'
    )

    .replace(
      /"/g,
      '&quot;'
    )

    .replace(
      /'/g,
      '&#039;'
    );

}


/* ============================================================
   REQUEST PAGE STYLES
   ============================================================ */

function injectRequestsStyles() {

  if (
    document.getElementById(
      'requests-page-styles'
    )
  ) {

    return;

  }


  const style =
    document.createElement(
      'style'
    );


  style.id =
    'requests-page-styles';


  style.textContent = `

    /* ========================================================
       DESKTOP
       ======================================================== */

    .requests-page {

      padding: 30px;

      max-width: 1500px;

      margin: 0 auto;

    }


    .requests-page .hidden {

      display: none !important;

    }


    .requests-header {

      display: flex;

      align-items: center;

      justify-content: space-between;

      gap: 20px;

      margin-bottom: 25px;

    }


    .requests-kicker {

      font-size: 10px;

      font-weight: 800;

      letter-spacing: 0.14em;

      color: var(
        --primary,
        #347ff1
      );

    }


    .requests-header h1 {

      margin: 6px 0;

      font-size: 30px;

      letter-spacing: -0.04em;

    }


    .requests-header p {

      margin: 0;

      color: var(
        --muted,
        #64748b
      );

      font-size: 12px;

    }


    .requests-live-status {

      display: flex;

      align-items: center;

      gap: 8px;

      padding: 9px 13px;

      border: 1px solid var(
        --border,
        #e2e8f0
      );

      border-radius: 999px;

      font-size: 10px;

      font-weight: 700;

      white-space: nowrap;

    }


    .requests-status-dot {

      width: 8px;

      height: 8px;

      border-radius: 50%;

      background: #22c55e;

      box-shadow:
        0 0 0 4px
        rgba(
          34,
          197,
          94,
          .12
        );

    }


    /* ========================================================
       SUMMARY
       ======================================================== */

    .requests-summary {

      display: grid;

      grid-template-columns:
        repeat(
          4,
          1fr
        );

      gap: 15px;

      margin-bottom: 25px;

    }


    .request-stat-card {

      display: flex;

      align-items: center;

      gap: 14px;

      padding: 18px;

      border: 1px solid var(
        --border,
        #e2e8f0
      );

      border-radius: 14px;

      background: var(
        --card,
        #ffffff
      );

      box-shadow:
        0 8px 25px
        rgba(
          15,
          23,
          42,
          .05
        );

    }


    .request-stat-icon {

      display: flex;

      align-items: center;

      justify-content: center;

      width: 42px;

      height: 42px;

      border-radius: 12px;

      background: rgba(
        59,
        130,
        246,
        .10
      );

      font-size: 20px;

    }


    .request-stat-icon.pending {

      background: rgba(
        245,
        158,
        11,
        .12
      );

    }


    .request-stat-icon.approved {

      background: rgba(
        34,
        197,
        94,
        .12
      );

    }


    .request-stat-icon.rejected {

      background: rgba(
        239,
        68,
        68,
        .12
      );

    }


    .request-stat-label {

      display: block;

      margin-bottom: 3px;

      color: var(
        --muted,
        #64748b
      );

      font-size: 10px;

      font-weight: 700;

      text-transform: uppercase;

      letter-spacing: .05em;

    }


    .request-stat-card strong {

      display: block;

      font-size: 22px;

    }


    /* ========================================================
       MAIN PANEL
       ======================================================== */

    .requests-panel {

      border: 1px solid var(
        --border,
        #e2e8f0
      );

      border-radius: 16px;

      background: var(
        --card,
        #ffffff
      );

      overflow: hidden;

      box-shadow:
        0 12px 35px
        rgba(
          15,
          23,
          42,
          .05
        );

    }


    .requests-panel-header {

      display: flex;

      align-items: center;

      justify-content: space-between;

      gap: 15px;

      padding: 20px;

      border-bottom: 1px solid var(
        --border,
        #e2e8f0
      );

    }


    .requests-panel-header h2 {

      margin: 0;

      font-size: 18px;

    }


    .requests-panel-header p {

      margin: 5px 0 0;

      color: var(
        --muted,
        #64748b
      );

      font-size: 11px;

    }


    /* ========================================================
       LOADING
       ======================================================== */

    .requests-loading {

      padding: 35px;

      text-align: center;

      color: var(
        --muted,
        #64748b
      );

      font-size: 12px;

    }


    /* ========================================================
       EMPTY STATE
       ======================================================== */

    .requests-empty {

      padding: 50px 20px;

      text-align: center;

    }


    .requests-empty-icon {

      font-size: 36px;

      margin-bottom: 10px;

    }


    .requests-empty h3 {

      margin: 0 0 6px;

    }


    .requests-empty p {

      margin: 0;

      color: var(
        --muted,
        #64748b
      );

      font-size: 12px;

    }


    /* ========================================================
       TABLE
       ======================================================== */

    .requests-table-wrapper {

      width: 100%;

      overflow-x: auto;

    }


    .requests-table {

      width: 100%;

      min-width: 700px;

      border-collapse: collapse;

    }


    .requests-table th {

      padding: 13px 16px;

      background: #f8fafc;

      color: #64748b;

      font-size: 9px;

      font-weight: 800;

      text-align: left;

      text-transform: uppercase;

      letter-spacing: .06em;

      border-bottom: 1px solid #e2e8f0;

    }


    .requests-table td {

      padding: 14px 16px;

      border-bottom: 1px solid #e2e8f0;

      font-size: 11px;

      vertical-align: middle;

    }


    .requests-table tbody tr:hover td {

      background: #f8fafc;

    }


    /* ========================================================
       USER
       ======================================================== */

    .request-user {

      display: flex;

      align-items: center;

      gap: 10px;

    }


    .request-avatar {

      display: flex;

      align-items: center;

      justify-content: center;

      width: 34px;

      height: 34px;

      flex: 0 0 34px;

      border-radius: 50%;

      background: rgba(
        59,
        130,
        246,
        .10
      );

      color: #347ff1;

      font-size: 10px;

      font-weight: 800;

    }


    .request-user strong {

      display: block;

      font-size: 11px;

    }


    .request-user span {

      display: block;

      margin-top: 2px;

      color: #94a3b8;

      font-size: 9px;

    }


    .request-email {

      overflow-wrap: anywhere;

      word-break: break-word;

    }


    .request-date {

      color: #64748b;

      white-space: nowrap;

    }


    /* ========================================================
       STATUS
       ======================================================== */

    .request-status {

      display: inline-flex;

      align-items: center;

      padding: 5px 9px;

      border-radius: 999px;

      font-size: 9px;

      font-weight: 800;

    }


    .request-status.pending {

      background: rgba(
        245,
        158,
        11,
        .12
      );

      color: #d97706;

    }


    .request-status.approved {

      background: rgba(
        34,
        197,
        94,
        .12
      );

      color: #16a34a;

    }


    .request-status.rejected {

      background: rgba(
        239,
        68,
        68,
        .12
      );

      color: #dc2626;

    }


    /* ========================================================
       ACTIONS
       ======================================================== */

    .request-actions {

      display: flex;

      flex-wrap: wrap;

      gap: 7px;

    }


    .request-action {

      border: 0;

      border-radius: 7px;

      padding: 7px 10px;

      font-size: 9px;

      font-weight: 800;

      cursor: pointer;

    }


    .request-action:disabled {

      opacity: .5;

      cursor: not-allowed;

    }


    .request-action.approve {

      background: rgba(
        34,
        197,
        94,
        .12
      );

      color: #16a34a;

    }


    .request-action.reject {

      background: rgba(
        239,
        68,
        68,
        .12
      );

      color: #dc2626;

    }


    .request-completed {

      color: #64748b;

      font-size: 9px;

      font-weight: 700;

    }


    .requests-error {

      padding: 30px !important;

      text-align: center;

      color: #dc2626;

    }


    /* ========================================================
       MOBILE REQUEST CARDS
       ======================================================== */

    @media (max-width: 768px) {

      .requests-page {

        padding: 18px;

      }


      .requests-header {

        align-items: flex-start;

        flex-direction: column;

        gap: 12px;

      }


      .requests-header h1 {

        font-size: 24px;

      }


      .requests-live-status {

        align-self: flex-start;

      }


      .requests-summary {

        grid-template-columns: 1fr;

      }


      .requests-panel-header {

        align-items: flex-start;

        flex-direction: column;

        gap: 15px;

      }


      .requests-panel-header button {

        width: auto;

      }


      .requests-table-wrapper {

        width: 100%;

        overflow-x: hidden;

      }


      .requests-table {

        width: 100% !important;

        min-width: 0 !important;

        display: block !important;

        border-collapse: separate !important;

        border-spacing: 0 !important;

      }


      .requests-table thead {

        display: none !important;

      }


      .requests-table tbody {

        display: block !important;

        width: 100% !important;

      }


      .requests-table tbody tr {

        display: block !important;

        width: 100% !important;

        max-width: 100% !important;

        margin-bottom: 14px !important;

        padding: 8px 0 !important;

        border: 1px solid #e2e8f0 !important;

        border-radius: 12px !important;

        background: var(
          --card,
          #ffffff
        ) !important;

        box-sizing: border-box;

        overflow: hidden;

      }


      .requests-table tbody td {

        display: flex !important;

        align-items: flex-start !important;

        width: 100% !important;

        max-width: 100% !important;

        min-width: 0 !important;

        padding: 11px 14px !important;

        border: 0 !important;

        border-bottom: 1px solid #e2e8f0 !important;

        box-sizing: border-box;

        white-space: normal !important;

        overflow-wrap: anywhere !important;

        word-break: break-word !important;

        font-size: 11px !important;

        line-height: 1.4;

      }


      .requests-table tbody td:last-child {

        border-bottom: 0 !important;

      }


      /* MOBILE LABEL */

      .requests-table tbody td::before {

        content: attr(data-label);

        flex: 0 0 85px;

        width: 85px;

        min-width: 85px;

        margin-right: 12px;

        color: #64748b;

        font-size: 9px;

        font-weight: 800;

        text-transform: uppercase;

        letter-spacing: .06em;

        line-height: 1.5;

      }


      /* USER */

      .requests-table .request-user {

        min-width: 0;

        max-width: calc(
          100% - 97px
        );

        flex: 1;

      }


      .requests-table .request-user > div:last-child {

        min-width: 0;

        max-width: 100%;

      }


      .requests-table .request-user strong,

      .requests-table .request-user span {

        overflow-wrap: anywhere;

        word-break: break-word;

      }


      /* EMAIL */

      .requests-table .request-email {

        min-width: 0;

        max-width: calc(
          100% - 97px
        );

        overflow-wrap: anywhere;

        word-break: break-word;

      }


      /* DATE */

      .requests-table .request-date {

        min-width: 0;

        max-width: calc(
          100% - 97px
        );

        overflow-wrap: anywhere;

        word-break: break-word;

      }


      /* STATUS */

      .requests-table .request-status {

        flex-shrink: 0;

      }


      /* ACTION BUTTONS */

      .requests-table .request-actions {

        display: flex;

        flex-wrap: wrap;

        gap: 7px;

        min-width: 0;

        max-width: calc(
          100% - 97px
        );

      }


      .requests-table .request-action {

        white-space: nowrap !important;

      }


      .requests-table .request-completed {

        white-space: normal !important;

        overflow-wrap: anywhere;

      }

    }


    /* ========================================================
       SMALL PHONES
       ======================================================== */

    @media (max-width: 430px) {

      .requests-page {

        padding: 14px;

      }


      .requests-table tbody tr {

        margin-bottom: 12px !important;

        border-radius: 10px !important;

      }


      .requests-table tbody td {

        padding: 9px 11px !important;

        font-size: 10px !important;

      }


      .requests-table tbody td::before {

        flex-basis: 75px;

        width: 75px;

        min-width: 75px;

        margin-right: 9px;

        font-size: 8px;

      }


      .requests-table .request-user,

      .requests-table .request-email,

      .requests-table .request-date,

      .requests-table .request-actions {

        max-width: calc(
          100% - 84px
        );

      }


      .requests-table .request-avatar {

        width: 30px;

        height: 30px;

        flex-basis: 30px;

      }


      .requests-table .request-action {

        padding: 6px 8px;

        font-size: 8px;

      }

    }


    /* ========================================================
       VERY SMALL PHONES
       ======================================================== */

    @media (max-width: 360px) {

      .requests-page {

        padding: 10px;

      }


      .requests-table tbody td {

        padding: 8px 9px !important;

      }


      .requests-table tbody td::before {

        flex-basis: 68px;

        width: 68px;

        min-width: 68px;

        margin-right: 7px;

        font-size: 7px;

      }


      .requests-table .request-user,

      .requests-table .request-email,

      .requests-table .request-date,

      .requests-table .request-actions {

        max-width: calc(
          100% - 75px
        );

      }

    }


    /* ========================================================
       DARK MODE
       ======================================================== */

    html.dark .requests-page,
    body.dark .requests-page,
    html[data-theme="dark"] .requests-page,
    body[data-theme="dark"] .requests-page {

      color: #e8eef8;

    }


    html.dark .request-stat-card,
    body.dark .request-stat-card,
    html[data-theme="dark"] .request-stat-card,
    body[data-theme="dark"] .request-stat-card {

      background: #111a2b;

      border-color: #263550;

    }


    html.dark .request-stat-card strong,
    body.dark .request-stat-card strong,
    html[data-theme="dark"] .request-stat-card strong,
    body[data-theme="dark"] .request-stat-card strong {

      color: #f1f5f9;

    }


    html.dark .request-stat-label,
    body.dark .request-stat-label,
    html[data-theme="dark"] .request-stat-label,
    body[data-theme="dark"] .request-stat-label {

      color: #94a3b8;

    }


    html.dark .requests-live-status,
    body.dark .requests-live-status,
    html[data-theme="dark"] .requests-live-status,
    body[data-theme="dark"] .requests-live-status {

      background: #111a2b;

      border-color: #263550;

      color: #dbe7f7;

    }


    html.dark .requests-panel,
    body.dark .requests-panel,
    html[data-theme="dark"] .requests-panel,
    body[data-theme="dark"] .requests-panel {

      background: #111a2b;

      border-color: #263550;

    }


    html.dark .requests-panel-header,
    body.dark .requests-panel-header,
    html[data-theme="dark"] .requests-panel-header,
    body[data-theme="dark"] .requests-panel-header {

      background: #111a2b;

      border-bottom-color: #263550;

    }


    html.dark .requests-panel-header h2,
    body.dark .requests-panel-header h2,
    html[data-theme="dark"] .requests-panel-header h2,
    body[data-theme="dark"] .requests-panel-header h2 {

      color: #f1f5f9;

    }


    html.dark .requests-panel-header p,
    body.dark .requests-panel-header p,
    html[data-theme="dark"] .requests-panel-header p,
    body[data-theme="dark"] .requests-panel-header p {

      color: #94a3b8;

    }


    html.dark .requests-table,
    body.dark .requests-table,
    html[data-theme="dark"] .requests-table,
    body[data-theme="dark"] .requests-table {

      background: #111a2b;

      color: #e8eef8;

    }


    html.dark .requests-table th,
    body.dark .requests-table th,
    html[data-theme="dark"] .requests-table th,
    body[data-theme="dark"] .requests-table th {

      background: #0d1525;

      color: #94a3b8;

      border-bottom-color: #263550;

    }


    html.dark .requests-table td,
    body.dark .requests-table td,
    html[data-theme="dark"] .requests-table td,
    body[data-theme="dark"] .requests-table td {

      background: #111a2b;

      color: #e8eef8;

      border-bottom-color: #263550;

    }


    html.dark .requests-table tbody tr:hover td,
    body.dark .requests-table tbody tr:hover td,
    html[data-theme="dark"] .requests-table tbody tr:hover td,
    body[data-theme="dark"] .requests-table tbody tr:hover td {

      background: #162238;

    }


    html.dark .request-user strong,
    body.dark .request-user strong,
    html[data-theme="dark"] .request-user strong,
    body[data-theme="dark"] .request-user strong {

      color: #f1f5f9;

    }


    html.dark .request-user span,
    body.dark .request-user span,
    html[data-theme="dark"] .request-user span,
    body[data-theme="dark"] .request-user span {

      color: #71809a;

    }


    html.dark .request-email,
    body.dark .request-email,
    html[data-theme="dark"] .request-email,
    body[data-theme="dark"] .request-email {

      color: #dbe7f7;

    }


    html.dark .request-date,
    body.dark .request-date,
    html[data-theme="dark"] .request-date,
    body[data-theme="dark"] .request-date {

      color: #94a3b8;

    }


    html.dark .request-completed,
    body.dark .request-completed,
    html[data-theme="dark"] .request-completed,
    body[data-theme="dark"] .request-completed {

      color: #94a3b8;

    }


    html.dark .request-avatar,
    body.dark .request-avatar,
    html[data-theme="dark"] .request-avatar,
    body[data-theme="dark"] .request-avatar {

      background: rgba(
        59,
        130,
        246,
        .15
      );

      color: #60a5fa;

    }


    html.dark .request-status.pending,
    body.dark .request-status.pending,
    html[data-theme="dark"] .request-status.pending,
    body[data-theme="dark"] .request-status.pending {

      background: rgba(
        245,
        158,
        11,
        .16
      );

      color: #fbbf24;

    }


    html.dark .request-status.approved,
    body.dark .request-status.approved,
    html[data-theme="dark"] .request-status.approved,
    body[data-theme="dark"] .request-status.approved {

      background: rgba(
        34,
        197,
        94,
        .14
      );

      color: #4ade80;

    }


    html.dark .request-status.rejected,
    body.dark .request-status.rejected,
    html[data-theme="dark"] .request-status.rejected,
    body[data-theme="dark"] .request-status.rejected {

      background: rgba(
        239,
        68,
        68,
        .14
      );

      color: #f87171;

    }


    html.dark .request-action.approve,
    body.dark .request-action.approve,
    html[data-theme="dark"] .request-action.approve,
    body[data-theme="dark"] .request-action.approve {

      background: rgba(
        34,
        197,
        94,
        .13
      );

      color: #4ade80;

    }


    html.dark .request-action.reject,
    body.dark .request-action.reject,
    html[data-theme="dark"] .request-action.reject,
    body[data-theme="dark"] .request-action.reject {

      background: rgba(
        239,
        68,
        68,
        .13
      );

      color: #f87171;

    }


    html.dark .requests-empty,
    body.dark .requests-empty,
    html[data-theme="dark"] .requests-empty,
    body[data-theme="dark"] .requests-empty {

      background: #111a2b;

    }


    html.dark .requests-empty h3,
    body.dark .requests-empty h3,
    html[data-theme="dark"] .requests-empty h3,
    body[data-theme="dark"] .requests-empty h3 {

      color: #e8eef8;

    }


    html.dark .requests-empty p,
    body.dark .requests-empty p,
    html[data-theme="dark"] .requests-empty p,
    body[data-theme="dark"] .requests-empty p {

      color: #94a3b8;

    }


    html.dark .requests-loading,
    body.dark .requests-loading,
    html[data-theme="dark"] .requests-loading,
    body[data-theme="dark"] .requests-loading {

      color: #94a3b8;

    }


    html.dark .requests-error,
    body.dark .requests-error,
    html[data-theme="dark"] .requests-error,
    body[data-theme="dark"] .requests-error {

      color: #f87171;

    }

  `;


  document.head.appendChild(
    style
  );

}