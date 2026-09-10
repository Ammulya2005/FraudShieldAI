import { API } from '../api.js';

import {
  renderRiskDistributionChart,
  renderFraudTrendsChart
} from '../charts.js';


// ============================================================
// FRAUDSHIELD AI
// DASHBOARD VIEW
// ============================================================
// Stable dashboard implementation.
//
// IMPORTANT:
// - Charts are created once.
// - Normal polling updates chart data only.
// - Chart containers have fixed responsive dimensions.
// - Live table keeps pagination.
// - Dashboard DOM is never rebuilt during polling.
// ============================================================


// ============================================================
// CHART STATE
// ============================================================

let fraudTrendChart = null;

let riskDistributionChart = null;


// ============================================================
// LIVE TRANSACTION STATE
// ============================================================

let liveTransactions = [];

let currentLivePage = 1;

const LIVE_PAGE_SIZE = 5;

let liveTotalPages = 1;

let liveTotalRecords = 0;


// ============================================================
// POLLING STATE
// ============================================================

let dashboardPoller = null;

let dashboardRefreshing = false;

let themeHandler = null;


// ============================================================
// CHART DATA
// ============================================================

let fraudHistory = [];

let riskData = [
  1,
  0,
  0,
  0
];


// ============================================================
// DASHBOARD HTML
// ============================================================

export function renderDashboard() {

  return `

    <div class="dashboard-page">

      <!-- ==================================================
           DASHBOARD HEADER
           ================================================== -->

      <div class="dashboard-header">

        <div>

          <h2>
            Real-Time Surveillance Overview
          </h2>

          <p>
            Continuous scoring engine powered by
            XGBoost &amp; Isolation Forest
          </p>

        </div>

      </div>


      <!-- ==================================================
           METRIC CARDS
           ================================================== -->

      <div class="dashboard-grid">


        <!-- TOTAL INGESTED -->

        <div class="card card-metric">

          <h3>
            Total Ingested (24h)
          </h3>

          <div
            class="metric-val"
            id="metric-total-tx"
          >
            --
          </div>

        </div>


        <!-- HIGH RISK -->

        <div class="card card-metric">

          <h3>
            High Risk Velocity
          </h3>

          <div
            class="metric-val metric-risk-high"
            id="metric-high-risk"
          >
            --
          </div>

        </div>


        <!-- ACTIVE ALERTS -->

        <div class="card card-metric">

          <h3>
            Active Fraud Alerts
          </h3>

          <div
            class="metric-val metric-risk-critical"
            id="metric-active-alerts"
          >
            --
          </div>

        </div>


        <!-- LATENCY -->

        <div class="card card-metric">

          <h3>
            Avg Inference Latency
          </h3>

          <div
            class="metric-val metric-risk-low"
            id="metric-latency"
          >
            --
          </div>

        </div>

      </div>


      <!-- ==================================================
           CHART SECTION
           ================================================== -->

      <div class="dashboard-chart-grid">


        <!-- =================================================
             FRAUD VELOCITY
             ================================================= -->

        <div class="card chart-card">

          <div class="chart-card-header">

            <div>

              <h3>
                Fraud Velocity Trend
              </h3>

              <p>
                Anomalous transaction volume over time
              </p>

            </div>

          </div>


          <!--
            IMPORTANT:
            The wrapper owns the height.

            The canvas fills the entire wrapper.
            This removes the large unused whitespace.
          -->

          <div
            class="chart-wrapper chart-wrapper-wide"
          >

            <canvas
              id="fraudTrendCanvas"
            ></canvas>

          </div>

        </div>


        <!-- =================================================
             RISK DISTRIBUTION
             ================================================= -->

        <div class="card chart-card">

          <div class="chart-card-header">

            <div>

              <h3>
                Risk Distribution
              </h3>

              <p>
                Current stream risk classification
              </p>

            </div>

          </div>


          <div
            class="chart-wrapper chart-wrapper-risk"
          >

            <canvas
              id="riskDistributionCanvas"
            ></canvas>

          </div>

        </div>

      </div>


      <!-- ==================================================
           LIVE STREAM ANOMALIES
           ================================================== -->

      <div class="card live-stream-card">


        <!-- HEADER -->

        <div class="live-stream-header">

          <div>

            <h3>
              Live Incoming Stream Anomalies
            </h3>

            <p>
              Latest transactions received by the
              real-time detection engine
            </p>

          </div>


          <span
            id="live-stream-updated"
            class="live-stream-updated"
          ></span>

        </div>


        <!-- =================================================
             TABLE
             ================================================= -->

        <div
          class="table-container live-stream-table-container"
        >

          <table
            class="data-table live-stream-table"
          >

            <thead>

              <tr>

                <th>
                  Tx ID
                </th>

                <th>
                  User ID
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Merchant
                </th>

                <th>
                  Risk Score
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody id="live-tx-tbody">

              <tr>

                <td
                  colspan="6"
                  class="table-message"
                >
                  Loading stream packets...
                </td>

              </tr>

            </tbody>

          </table>

        </div>


        <!-- =================================================
             PAGINATION
             ================================================= -->

        <div
          id="live-tx-pagination"
          class="live-tx-pagination"
        ></div>

      </div>

    </div>

  `;

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHtml(value) {

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
// UPDATE METRIC
// ============================================================

function updateMetric(
  id,
  value
) {

  const element =
    document.getElementById(id);

  if (!element) {
    return;
  }

  const nextValue =
    String(value);

  if (
    element.textContent !==
    nextValue
  ) {

    element.textContent =
      nextValue;

  }

}


// ============================================================
// NORMALIZE LIVE RESPONSE
// ============================================================

function normalizeLiveResponse(
  response
) {

  /*
   * Legacy backend response:
   *
   * [
   *   {...},
   *   {...}
   * ]
   */

  if (
    Array.isArray(response)
  ) {

    return {

      records:
        response,

      total:
        response.length,

      page:
        1,

      totalPages:
        1

    };

  }


  /*
   * Paginated response support.
   */

  const records =

    Array.isArray(
      response?.stream_records
    )

      ? response.stream_records

      : Array.isArray(
          response?.transactions
        )

        ? response.transactions

        : Array.isArray(
            response?.data
          )

          ? response.data

          : [];


  const total =

    Number(
      response?.total ??
      response?.total_records ??
      response?.count ??
      records.length
    );


  const totalPages =

    Math.max(
      1,

      Number(
        response?.total_pages ??
        Math.ceil(
          total /
          LIVE_PAGE_SIZE
        )
      )
    );


  return {

    records,

    total,

    page:
      Number(
        response?.page ??
        currentLivePage
      ),

    totalPages

  };

}


// ============================================================
// RENDER LIVE TRANSACTIONS
// ============================================================

function renderLiveTransactions() {

  const tbody =
    document.getElementById(
      'live-tx-tbody'
    );


  if (!tbody) {
    return;
  }


  // ==========================================================
  // EMPTY
  // ==========================================================

  if (
    !Array.isArray(
      liveTransactions
    ) ||
    liveTransactions.length === 0
  ) {

    tbody.innerHTML = `

      <tr>

        <td
          colspan="6"
          class="table-message"
        >
          No live stream transactions available.
        </td>

      </tr>

    `;

    renderLivePagination();

    return;

  }


  // ==========================================================
  // TABLE ROWS
  // ==========================================================

  tbody.innerHTML =

    liveTransactions
      .map(
        tx => {

          const riskScore =
            Number(
              tx?.risk_score ??
              0
            );


          const badgeClass =

            riskScore >= 0.8

              ? 'badge-critical'

              : riskScore >= 0.5

                ? 'badge-high'

                : 'badge-low';


          const suspicious =

            tx?.final_prediction ===
              'fraud'

            ||

            riskScore >=
              0.7;


          const statusClass =

            suspicious

              ? 'stream-status suspicious'

              : 'stream-status cleared';


          const transactionId =

            tx?.transaction_id ??

            tx?.id ??

            tx?._id ??

            '-';


          const userId =

            tx?.user_id ??
            '-';


          const amount =

            Number(

              tx?.transaction_amount ??

              tx?.amount ??

              0

            );


          const merchant =

            tx?.merchant_category ??

            tx?.merchant ??

            'General';


          return `

            <tr>

              <td data-label="Tx ID">

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

                $${amount.toFixed(2)}

              </td>


              <td data-label="Merchant">

                ${escapeHtml(
                  merchant
                )}

              </td>


              <td data-label="Risk Score">

                <span
                  class="badge ${badgeClass}"
                >

                  ${(
                    riskScore *
                    100
                  ).toFixed(1)}%

                </span>

              </td>


              <td data-label="Status">

                <span
                  class="${statusClass}"
                >

                  ${
                    suspicious
                      ? 'Suspicious'
                      : 'Cleared'
                  }

                </span>

              </td>

            </tr>

          `;

        }
      )
      .join('');


  renderLivePagination();

}


// ============================================================
// LIVE PAGINATION
// ============================================================

function renderLivePagination() {

  const pagination =
    document.getElementById(
      'live-tx-pagination'
    );


  if (!pagination) {
    return;
  }


  const totalPages =

    Math.max(
      1,
      Number(
        liveTotalPages ||
        1
      )
    );


  const currentPage =

    Math.min(

      Math.max(
        1,
        Number(
          currentLivePage ||
          1
        )
      ),

      totalPages

    );


  currentLivePage =
    currentPage;


  // ==========================================================
  // ONLY ONE PAGE
  // ==========================================================

  if (
    totalPages <= 1 &&
    liveTotalRecords <=
      LIVE_PAGE_SIZE
  ) {

    pagination.innerHTML = `

      <span
        class="pagination-record-count"
      >

        ${liveTotalRecords.toLocaleString()}

        ${
          liveTotalRecords === 1
            ? 'record'
            : 'records'
        }

      </span>

    `;

    return;

  }


  // ==========================================================
  // PAGE NUMBERS
  // ==========================================================

  const pages = [];


  if (
    totalPages <= 7
  ) {

    for (
      let page = 1;
      page <= totalPages;
      page += 1
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
      page += 1
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


  const firstRecord =

    liveTotalRecords === 0

      ? 0

      : (
          (
            currentPage - 1
          ) *
          LIVE_PAGE_SIZE
        ) + 1;


  const lastRecord =

    Math.min(

      currentPage *
      LIVE_PAGE_SIZE,

      liveTotalRecords

    );


  pagination.innerHTML = `

    <div
      class="pagination-controls"
    >


      <button
        type="button"
        class="btn btn-sm btn-outline-secondary"
        data-live-page="prev"
        ${
          currentPage <= 1
            ? 'disabled'
            : ''
        }
      >
        Previous
      </button>


      <div
        class="pagination-pages"
      >

        ${
          pages
            .map(
              page => {

                if (
                  page === '...'
                ) {

                  return `

                    <span
                      class="pagination-ellipsis"
                    >
                      ...
                    </span>

                  `;

                }


                const active =
                  page ===
                  currentPage;


                return `

                  <button
                    type="button"
                    class="btn btn-sm ${
                      active
                        ? 'btn-primary'
                        : 'btn-outline-secondary'
                    }"
                    data-live-page="${page}"
                    ${
                      active
                        ? 'aria-current="page"'
                        : ''
                    }
                  >
                    ${page}
                  </button>

                `;

              }
            )
            .join('')
        }

      </div>


      <button
        type="button"
        class="btn btn-sm btn-outline-secondary"
        data-live-page="next"
        ${
          currentPage >=
          totalPages
            ? 'disabled'
            : ''
        }
      >
        Next
      </button>


    </div>


    <span
      class="pagination-record-count"
    >

      Showing

      ${firstRecord.toLocaleString()}

      -

      ${lastRecord.toLocaleString()}

      of

      ${liveTotalRecords.toLocaleString()}

    </span>

  `;


  // ==========================================================
  // PAGINATION EVENTS
  // ==========================================================

  pagination
    .querySelectorAll(
      '[data-live-page]'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',
          async () => {

            const target =
              button.getAttribute(
                'data-live-page'
              );


            if (
              target ===
              'prev'
            ) {

              if (
                currentLivePage >
                1
              ) {

                currentLivePage -=
                  1;

              }

            } else if (
              target ===
              'next'
            ) {

              if (
                currentLivePage <
                totalPages
              ) {

                currentLivePage +=
                  1;

              }

            } else {

              currentLivePage =
                Number(
                  target
                );

            }


            await loadLiveTransactions();

          }
        );

      }
    );

}


// ============================================================
// LOAD LIVE TRANSACTIONS
// ============================================================

async function loadLiveTransactions() {

  const tbody =
    document.getElementById(
      'live-tx-tbody'
    );


  if (!tbody) {
    return;
  }


  try {

    /*
     * IMPORTANT:
     * Do not clear the existing table before every poll.
     *
     * This prevents the visible loading flicker and
     * contributes to a stable dashboard.
     */

    const response =

      await API.getLiveTransactions(
        currentLivePage,
        LIVE_PAGE_SIZE
      );


    const normalized =

      normalizeLiveResponse(
        response
      );


    liveTransactions =
      normalized.records;


    liveTotalRecords =
      normalized.total;


    liveTotalPages =
      normalized.totalPages;


    if (
      normalized.page >= 1 &&
      normalized.page <=
        liveTotalPages
    ) {

      currentLivePage =
        normalized.page;

    }


    renderLiveTransactions();


    const updated =
      document.getElementById(
        'live-stream-updated'
      );


    if (updated) {

      updated.textContent =

        `Updated ${
          new Date()
            .toLocaleTimeString(
              [],
              {
                hour:
                  '2-digit',

                minute:
                  '2-digit',

                second:
                  '2-digit'
              }
            )
        }`;

    }

  } catch (error) {

    console.error(
      'Live transaction loading error:',
      error
    );


    /*
     * Do not destroy previously loaded
     * transaction data when a poll fails.
     */

    if (
      !liveTransactions.length
    ) {

      tbody.innerHTML = `

        <tr>

          <td
            colspan="6"
            class="table-message table-error"
          >

            Unable to load live stream
            transactions.

          </td>

        </tr>

      `;

    }

    renderLivePagination();

  }

}


// ============================================================
// UPDATE CHARTS
// ============================================================

function updateCharts(
  streamMetrics
) {

  // ==========================================================
  // FRAUD HISTORY
  // ==========================================================

  const now =
    new Date();


  const timeLabel =

    now.toLocaleTimeString(
      [],
      {
        hour:
          '2-digit',

        minute:
          '2-digit',

        second:
          '2-digit'
      }
    );


  const fraudValue =

    Number(
      streamMetrics?.fraud_detected ??
      0
    );


  fraudHistory.push({

    time:
      timeLabel,

    fraud:
      fraudValue

  });


  /*
   * Keep enough points to create a useful
   * graph without continuously growing memory.
   */

  if (
    fraudHistory.length >
    20
  ) {

    fraudHistory =
      fraudHistory.slice(
        -20
      );

  }


  // ==========================================================
  // RISK DISTRIBUTION
  // ==========================================================

  let low =
    0;

  let medium =
    0;

  let high =
    0;

  let critical =
    0;


  liveTransactions.forEach(
    tx => {

      const score =
        Number(
          tx?.risk_score ??
          0
        );


      if (
        score <=
        0.25
      ) {

        low += 1;

      } else if (
        score <=
        0.50
      ) {

        medium += 1;

      } else if (
        score <=
        0.80
      ) {

        high += 1;

      } else {

        critical += 1;

      }

    }
  );


  riskData = [

    low,

    medium,

    high,

    critical

  ];


  if (
    riskData.every(
      value =>
        value === 0
    )
  ) {

    riskData = [
      1,
      0,
      0,
      0
    ];

  }


  // ==========================================================
  // UPDATE FRAUD CHART
  // ==========================================================

  if (
    fraudTrendChart
  ) {

    fraudTrendChart.data.labels =

      fraudHistory.map(
        point =>
          point.time
      );


    fraudTrendChart
      .data
      .datasets[0]
      .data =

      fraudHistory.map(
        point =>
          point.fraud
      );


    /*
     * 'none' means:
     * update immediately without animation.
     *
     * This prevents the jerk effect.
     */

    fraudTrendChart.update(
      'none'
    );

  }


  // ==========================================================
  // UPDATE RISK CHART
  // ==========================================================

  if (
    riskDistributionChart
  ) {

    riskDistributionChart
      .data
      .datasets[0]
      .data =
      riskData;


    riskDistributionChart.update(
      'none'
    );

  }

}


// ============================================================
// REFRESH DASHBOARD
// ============================================================

async function refreshDashboard() {

  if (
    dashboardRefreshing
  ) {

    return;

  }


  dashboardRefreshing =
    true;


  try {

    /*
     * Run independent API calls together.
     * This reduces waiting time.
     */

    const [
      summaryResponse,
      streamResponse
    ] = await Promise.all([

      API.getDashboardSummary(),

      API.getStreamMetrics()

    ]);


    const summary =

      summaryResponse?.data ??

      summaryResponse ??

      {};


    const streamMetrics =

      streamResponse?.metrics ??

      streamResponse ??

      {};


    // ========================================================
    // METRICS
    // ========================================================

    const totalTransactions =

      Number(

        summary?.total_transactions ??

        streamMetrics?.total_ingested ??

        0

      );


    const highRisk =

      Number(

        summary?.high_risk_transactions ??

        0

      );


    const activeAlerts =

      Number(

        summary?.open_alerts ??

        0

      );


    const latency =

      Number(

        streamMetrics?.latency_ms ??

        0

      );


    updateMetric(

      'metric-total-tx',

      totalTransactions.toLocaleString()

    );


    updateMetric(

      'metric-high-risk',

      highRisk.toLocaleString()

    );


    updateMetric(

      'metric-active-alerts',

      activeAlerts.toLocaleString()

    );


    updateMetric(

      'metric-latency',

      `${latency.toFixed(1)} ms`

    );


    // ========================================================
    // LIVE TABLE
    // ========================================================

    /*
     * Only automatically refresh page 1.
     *
     * If the user is reading page 2, 3, 4...
     * the automatic poll does NOT throw them back
     * to page 1.
     */

    if (
      currentLivePage ===
      1
    ) {

      await loadLiveTransactions();

    }


    // ========================================================
    // CHARTS
    // ========================================================

    updateCharts(
      streamMetrics
    );

  } catch (error) {

    console.error(
      'Dashboard refresh error:',
      error
    );

  } finally {

    dashboardRefreshing =
      false;

  }

}


// ============================================================
// CREATE CHARTS
// ============================================================

function createCharts() {

  const fraudCanvas =
    document.getElementById(
      'fraudTrendCanvas'
    );


  const riskCanvas =
    document.getElementById(
      'riskDistributionCanvas'
    );


  if (
    !fraudCanvas ||
    !riskCanvas
  ) {

    return;

  }


  // ==========================================================
  // DESTROY ONLY WHEN ACTUALLY RECREATING
  // ==========================================================

  if (
    fraudTrendChart
  ) {

    fraudTrendChart.destroy();

    fraudTrendChart =
      null;

  }


  if (
    riskDistributionChart
  ) {

    riskDistributionChart.destroy();

    riskDistributionChart =
      null;

  }


  // ==========================================================
  // CREATE FRAUD CHART
  // ==========================================================

  fraudTrendChart =

    renderFraudTrendsChart(

      'fraudTrendCanvas',

      fraudHistory.map(
        point =>
          point.time
      ),

      fraudHistory.map(
        point =>
          point.fraud
      )

    );


  // ==========================================================
  // CREATE RISK CHART
  // ==========================================================

  riskDistributionChart =

    renderRiskDistributionChart(

      'riskDistributionCanvas',

      riskData

    );

}


// ============================================================
// INITIALIZE DASHBOARD
// ============================================================

export async function initDashboardEvents() {

  // ==========================================================
  // STOP OLD POLLER
  // ==========================================================

  if (
    dashboardPoller
  ) {

    clearInterval(
      dashboardPoller
    );

    dashboardPoller =
      null;

  }


  // ==========================================================
  // REMOVE OLD THEME LISTENER
  // ==========================================================

  if (
    themeHandler
  ) {

    window.removeEventListener(

      'fraudshield-theme-changed',

      themeHandler

    );

    themeHandler =
      null;

  }


  // ==========================================================
  // RESET STATE
  // ==========================================================

  currentLivePage =
    1;


  liveTransactions =
    [];


  liveTotalPages =
    1;


  liveTotalRecords =
    0;


  fraudHistory =
    [];


  riskData = [
    1,
    0,
    0,
    0
  ];


  // ==========================================================
  // WAIT FOR LAYOUT
  // ==========================================================

  /*
   * The router inserts the dashboard first.
   *
   * Waiting one browser frame lets the browser calculate
   * the final width/height of the chart containers before
   * Chart.js measures them.
   */

  await new Promise(
    resolve => {

      requestAnimationFrame(
        resolve
      );

    }
  );


  // ==========================================================
  // CREATE CHARTS ONCE
  // ==========================================================

  createCharts();


  // ==========================================================
  // THEME CHANGE
  // ==========================================================

  themeHandler =
    () => {

      createCharts();

    };


  window.addEventListener(

    'fraudshield-theme-changed',

    themeHandler

  );


  // ==========================================================
  // FIRST DATA LOAD
  // ==========================================================

  await refreshDashboard();


  // ==========================================================
  // STABLE POLLING
  // ==========================================================

  /*
   * 5-second polling.
   *
   * The important difference is that polling updates existing
   * DOM/chart objects instead of rebuilding the dashboard.
   */

  dashboardPoller =

    window.setInterval(

      refreshDashboard,

      5000

    );


  window.currentViewPoller =
    dashboardPoller;

}