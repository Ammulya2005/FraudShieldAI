import { API } from '../api.js';


// ============================================================
// STATE
// ============================================================

let currentPage = 1;

let pageSize = 10;

let totalRecords = 0;

let totalPages = 1;

let loading = false;


// ============================================================
// HTML
// ============================================================

export function renderTransactions() {

  return `

    <div class="transactions-page">

      <div
        style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:1rem;
          margin-bottom:1.5rem;
        "
      >

        <div>

          <h2>
            Transaction Stream Monitor
          </h2>

          <p
            style="
              color:var(--text-muted);
              font-size:.875rem;
            "
          >
            Monitor incoming transaction activity
            and anomaly scores.
          </p>

        </div>


        <button
          type="button"
          id="simulate-transaction"
          class="btn btn-primary"
        >
          + Simulate Transaction
        </button>

      </div>


      <div class="card">

        <div class="table-container">

          <table class="data-table">

            <thead>

              <tr>

                <th>
                  Timestamp
                </th>

                <th>
                  Transaction ID
                </th>

                <th>
                  User ID
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Location
                </th>

                <th>
                  Device
                </th>

                <th>
                  Anomaly Score
                </th>

              </tr>

            </thead>


            <tbody
              id="transactions-tbody"
            >

              <tr>

                <td
                  colspan="7"
                  style="text-align:center;"
                >
                  Loading transactions...
                </td>

              </tr>

            </tbody>

          </table>

        </div>


        <div
          class="transactions-pagination"
          style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:1rem;
            flex-wrap:wrap;
            margin-top:1rem;
            padding-top:1rem;
            border-top:1px solid var(--border-color);
          "
        >

          <div
            id="transactions-count"
            style="
              color:var(--text-muted);
              font-size:.85rem;
            "
          >
            Loading...
          </div>


          <div
            style="
              display:flex;
              align-items:center;
              gap:.5rem;
              flex-wrap:wrap;
            "
          >

            <label
              style="
                color:var(--text-muted);
                font-size:.85rem;
              "
            >
              Rows per page
            </label>


            <select
              id="transactions-page-size"
              class="form-control"
              style="
                width:auto;
                min-width:80px;
              "
            >

              <option value="10">
                10
              </option>

              <option value="25">
                25
              </option>

              <option value="50">
                50
              </option>

              <option value="100">
                100
              </option>

            </select>


            <div
              id="transactions-pagination-buttons"
              style="
                display:flex;
                align-items:center;
                gap:.35rem;
                flex-wrap:wrap;
              "
            ></div>

          </div>

        </div>

      </div>

    </div>

  `;

}


// ============================================================
// ESCAPE
// ============================================================

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


// ============================================================
// NORMALIZE API RESPONSE
// ============================================================

function normalizeResponse(
  response
) {

  if (
    Array.isArray(response)
  ) {

    return {

      transactions:
        response,

      total:
        response.length,

      page:
        currentPage,

      pageSize:
        pageSize,

      totalPages:
        Math.max(
          1,
          Math.ceil(
            response.length /
            pageSize
          )
        )

    };

  }


  const transactions =
    Array.isArray(
      response?.transactions
    )
      ? response.transactions

      : Array.isArray(
          response?.items
        )
        ? response.items

        : Array.isArray(
            response?.data
          )
          ? response.data

          : [];


  const total =
    Number(
      response?.total ??
      response?.count ??
      transactions.length
    );


  const page =
    Number(
      response?.page ??
      currentPage
    );


  const size =
    Number(
      response?.page_size ??
      response?.pageSize ??
      pageSize
    );


  const pages =
    Number(
      response?.total_pages ??
      response?.totalPages ??
      Math.max(
        1,
        Math.ceil(
          total / size
        )
      )
    );


  return {

    transactions,

    total,

    page,

    pageSize: size,

    totalPages:
      Math.max(
        1,
        pages
      )

  };

}


// ============================================================
// RENDER TABLE
// ============================================================

function renderTable(
  transactions
) {

  const tbody =
    document.getElementById(
      'transactions-tbody'
    );


  if (!tbody) {
    return;
  }


  if (
    !transactions.length
  ) {

    tbody.innerHTML = `

      <tr>

        <td
          colspan="7"
          style="
            text-align:center;
            padding:2rem;
            color:var(--text-muted);
          "
        >
          No transactions found.
        </td>

      </tr>

    `;

    return;

  }


  tbody.innerHTML =
    transactions
      .map(
        transaction => {

          const timestamp =
            transaction.timestamp ||
            transaction.created_at ||
            transaction.transaction_date ||
            '-';


          const transactionId =
            transaction.transaction_id ||
            transaction.id ||
            transaction._id ||
            '-';


          const userId =
            transaction.user_id ??
            '-';


          const amount =
            Number(
              transaction.transaction_amount ??
              transaction.amount ??
              0
            );


          const location =
            transaction.location ||
            '-';


          const device =
            transaction.device ||
            transaction.device_type ||
            '-';


          const score =
            Number(
              transaction.risk_score ??
              transaction.anomaly_score ??
              0
            );


          const badgeClass =
            score >= 0.8
              ? 'badge-critical'
              : score >= 0.5
                ? 'badge-high'
                : 'badge-low';


          return `

            <tr>

              <td data-label="Timestamp">
                ${escapeHtml(
                  timestamp
                )}
              </td>


              <td data-label="Transaction ID">

                <code>
                  ${escapeHtml(
                    transactionId
                  )}
                </code>

              </td>


              <td data-label="User ID">

                ${escapeHtml(
                  userId
                )}

              </td>


              <td data-label="Amount">

                $
                ${amount.toFixed(2)}

              </td>


              <td data-label="Location">

                ${escapeHtml(
                  location
                )}

              </td>


              <td data-label="Device">

                ${escapeHtml(
                  device
                )}

              </td>


              <td data-label="Anomaly Score">

                <span
                  class="badge ${badgeClass}"
                >
                  ${
                    (
                      score * 100
                    ).toFixed(1)
                  }%
                </span>

              </td>

            </tr>

          `;

        }
      )
      .join('');

}


// ============================================================
// PAGINATION
// ============================================================

function renderPagination() {

  const count =
    document.getElementById(
      'transactions-count'
    );


  const buttons =
    document.getElementById(
      'transactions-pagination-buttons'
    );


  if (
    !count ||
    !buttons
  ) {

    return;

  }


  const first =
    totalRecords === 0
      ? 0
      : (
          (
            currentPage -
            1
          ) *
          pageSize
        ) + 1;


  const last =
    Math.min(
      currentPage *
        pageSize,
      totalRecords
    );


  count.textContent =
    `Showing ${first.toLocaleString()}-${last.toLocaleString()} of ${totalRecords.toLocaleString()}`;


  let html = '';


  html += `

    <button
      type="button"
      class="btn btn-sm btn-outline-secondary"
      data-page="prev"
      ${currentPage <= 1 ? 'disabled' : ''}
    >
      ← Previous
    </button>

  `;


  const pages = [];


  if (
    totalPages <= 7
  ) {

    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {

      pages.push(page);

    }

  } else {

    pages.push(1);


    if (
      currentPage > 4
    ) {

      pages.push('...');

    }


    const start =
      Math.max(
        2,
        currentPage - 1
      );


    const end =
      Math.min(
        totalPages - 1,
        currentPage + 1
      );


    for (
      let page = start;
      page <= end;
      page++
    ) {

      pages.push(page);

    }


    if (
      currentPage <
      totalPages - 3
    ) {

      pages.push('...');

    }


    pages.push(
      totalPages
    );

  }


  pages.forEach(
    page => {

      if (
        page === '...'
      ) {

        html += `
          <span
            style="
              padding:0 .25rem;
              color:var(--text-muted);
            "
          >
            ...
          </span>
        `;

        return;

      }


      html += `

        <button
          type="button"
          class="btn btn-sm ${
            page === currentPage
              ? 'btn-primary'
              : 'btn-outline-secondary'
          }"
          data-page="${page}"
        >
          ${page}
        </button>

      `;

    }
  );


  html += `

    <button
      type="button"
      class="btn btn-sm btn-outline-secondary"
      data-page="next"
      ${
        currentPage >= totalPages
          ? 'disabled'
          : ''
      }
    >
      Next →
    </button>

  `;


  buttons.innerHTML =
    html;


  buttons
    .querySelectorAll(
      '[data-page]'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',
          async () => {

            const value =
              button.getAttribute(
                'data-page'
              );


            if (
              value === 'prev'
            ) {

              if (
                currentPage > 1
              ) {

                currentPage--;

              }

            } else if (
              value === 'next'
            ) {

              if (
                currentPage <
                totalPages
              ) {

                currentPage++;

              }

            } else {

              currentPage =
                Number(value);

            }


            await loadTransactions();

          }
        );

      }
    );

}


// ============================================================
// LOAD
// ============================================================

async function loadTransactions() {

  if (loading) {
    return;
  }


  loading = true;


  const tbody =
    document.getElementById(
      'transactions-tbody'
    );


  if (tbody) {

    tbody.innerHTML = `

      <tr>

        <td
          colspan="7"
          style="text-align:center;"
        >
          Loading transactions...
        </td>

      </tr>

    `;

  }


  try {

    const response =
      await API.getTransactions(
        currentPage,
        pageSize
      );


    const normalized =
      normalizeResponse(
        response
      );


    totalRecords =
      normalized.total;


    totalPages =
      normalized.totalPages;


    currentPage =
      Math.min(
        Math.max(
          1,
          normalized.page
        ),
        totalPages
      );


    renderTable(
      normalized.transactions
    );


    renderPagination();

  } catch (error) {

    console.error(
      'Transactions loading error:',
      error
    );


    if (tbody) {

      tbody.innerHTML = `

        <tr>

          <td
            colspan="7"
            style="
              text-align:center;
              color:var(--risk-critical);
              padding:2rem;
            "
          >
            Unable to load transactions.
          </td>

        </tr>

      `;

    }

  } finally {

    loading = false;

  }

}


// ============================================================
// INITIALIZE
// ============================================================

export async function initTransactionsEvents() {

  currentPage =
    1;

  pageSize =
    10;

  totalRecords =
    0;

  totalPages =
    1;


  const pageSizeSelect =
    document.getElementById(
      'transactions-page-size'
    );


  pageSizeSelect?.addEventListener(
    'change',
    async event => {

      pageSize =
        Number(
          event.target.value
        );


      currentPage =
        1;


      await loadTransactions();

    }
  );


  const simulateButton =
    document.getElementById(
      'simulate-transaction'
    );


  simulateButton?.addEventListener(
    'click',
    async () => {

      try {

        simulateButton.disabled =
          true;


        simulateButton.textContent =
          'Creating...';


        await API.createTransaction({

          user_id:
            Math.floor(
              Math.random() *
              9999
            ),

          transaction_amount:
            Number(
              (
                Math.random() *
                5000 +
                50
              ).toFixed(2)
            ),

          merchant_category:
            'Shopping',

          location:
            'Online',

          device:
            'Web',

          transaction_type:
            'purchase'

        });


        currentPage =
          1;


        await loadTransactions();

      } catch (error) {

        console.error(
          'Simulation error:',
          error
        );

        alert(
          error.message
        );

      } finally {

        simulateButton.disabled =
          false;

        simulateButton.textContent =
          '+ Simulate Transaction';

      }

    }
  );


  await loadTransactions();

}