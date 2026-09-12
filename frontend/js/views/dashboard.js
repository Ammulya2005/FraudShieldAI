import { API } from '../api.js';

import {
  renderRiskDistributionChart,
  renderFraudTrendsChart
} from '../charts.js';


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
// DASHBOARD POLLER
// ============================================================

let dashboardPoller = null;

let dashboardRefreshing = false;


// ============================================================
// CHART HISTORY
// ============================================================

let fraudHistory = [];

let riskData = [
  1,
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


        <!-- ==================================================
             TOTAL TRANSACTIONS
             ================================================== -->

        <div class="card card-metric">

          <div class="metric-card-content">

            <div class="metric-icon">

              <img
                src="assets/images/total-transactions-icon.png"
                alt="Total Transactions"
              />

            </div>

            <div class="metric-info">

              <h3>
                Total Transactions
              </h3>

              <div
                class="metric-val"
                id="metric-total-tx"
              >
                --
              </div>

            </div>

          </div>

        </div>


        <!-- ==================================================
             HIGH RISK VELOCITY
             ================================================== -->

        <div class="card card-metric">

          <div class="metric-card-content">

            <div class="metric-icon">

              <img
                src="assets/images/high-risk-velocity.png"
                alt="High Risk Velocity"
              />

            </div>

            <div class="metric-info">

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

          </div>

        </div>


        <!-- ==================================================
             ACTIVE FRAUD ALERTS
             ================================================== -->

        <div class="card card-metric">

          <div class="metric-card-content">

            <div class="metric-icon">

              <img
                src="assets/images/active-fraud-alerts.png"
                alt="Active Fraud Alerts"
              />

            </div>

            <div class="metric-info">

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

          </div>

        </div>


        <!-- ==================================================
             AVG INFERENCE LATENCY
             ================================================== -->

        <div class="card card-metric">

          <div class="metric-card-content">

            <div class="metric-icon">

              <img
                src="assets/images/avg-inference-latency.png"
                alt="Average Inference Latency"
              />

            </div>

            <div class="metric-info">

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

        </div>


      </div>


      <!-- ==================================================
           CHARTS
           ================================================== -->

      <div class="dashboard-chart-grid">


        <!-- =================================================
             TRANSACTION TREND
             ================================================= -->

        <div class="card chart-card">

          <div class="chart-card-header">

            <div>

              <h3>
                Transaction Trend
              </h3>

              <p>
                Transaction activity and fraud detection trend
              </p>

            </div>

          </div>


          <div class="chart-wrapper chart-wrapper-wide">

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


          <div class="chart-wrapper chart-wrapper-risk">

            <canvas
              id="riskDistributionCanvas"
            ></canvas>

          </div>

        </div>


      </div>


      <!-- ==================================================
           LIVE STREAM ANOMALIES
           ================================================== -->

      <div
        class="card live-stream-card"
        style="
          width:100%;
          max-width:100%;
          margin-top:1.25rem;
          box-sizing:border-box;
        "
      >

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
          style="
            width:100%;
            max-width:100%;
            overflow-x:auto;
          "
        >

          <table
            class="data-table live-stream-table"
            style="
              width:100%;
              min-width:850px;
            "
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
                  style="text-align:center;"
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
// ESCAPE HTML
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
// RENDER LIVE PAGINATION
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
        liveTotalPages || 1
      )
    );


  const currentPage =
    Math.min(

      Math.max(
        1,
        Number(
          currentLivePage || 1
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
    liveTotalRecords <= LIVE_PAGE_SIZE
  ) {

    pagination.innerHTML = `

      <span
        style="
          color:var(--text-muted);
          font-size:0.85rem;
        "
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


  let html = '';


  // ==========================================================
  // PREVIOUS
  // ==========================================================

  html += `

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
      ← Previous
    </button>

  `;


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
      page++
    ) {

      pages.push(
        page
      );

    }

  } else {

    pages.push(
      1
    );


    if (
      currentPage > 4
    ) {

      pages.push(
        '...'
      );

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

      pages.push(
        page
      );

    }


    if (
      currentPage <
      totalPages - 3
    ) {

      pages.push(
        '...'
      );

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
              padding:0 0.3rem;
              color:var(--text-muted);
            "
          >
            ...
          </span>

        `;

        return;

      }


      const active =
        page === currentPage;


      html += `

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
  );


  // ==========================================================
  // NEXT
  // ==========================================================

  html += `

    <button
      type="button"
      class="btn btn-sm btn-outline-secondary"
      data-live-page="next"
      ${
        currentPage >= totalPages
          ? 'disabled'
          : ''
      }
    >
      Next →
    </button>

  `;


  // ==========================================================
  // RECORD INFORMATION
  // ==========================================================

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


  html += `

    <span
      style="
        margin-left:0.75rem;
        color:var(--text-muted);
        font-size:0.85rem;
      "
    >

      Showing
      ${firstRecord.toLocaleString()}-
      ${lastRecord.toLocaleString()}

      of

      ${liveTotalRecords.toLocaleString()}

    </span>

  `;


  pagination.innerHTML =
    html;


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

            const page =
              button.getAttribute(
                'data-live-page'
              );


            if (
              page === 'prev'
            ) {

              if (
                currentLivePage > 1
              ) {

                currentLivePage--;

              }

            } else if (
              page === 'next'
            ) {

              if (
                currentLivePage <
                totalPages
              ) {

                currentLivePage++;

              }

            } else {

              currentLivePage =
                Number(
                  page
                );

            }


            await loadLiveTransactions();

          }
        );

      }
    );

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
          style="
            text-align:center;
            padding:1.5rem;
            color:var(--text-muted);
          "
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


          const riskClass =

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


          const status =

            suspicious

              ? `

                <span
                  style="
                    color:var(--risk-critical);
                  "
                >
                  Suspicious
                </span>

              `

              : `

                <span
                  style="
                    color:var(--risk-low);
                  "
                >
                  Cleared
                </span>

              `;


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

                $
                ${amount.toFixed(2)}

              </td>


              <td data-label="Merchant">

                ${escapeHtml(
                  merchant
                )}

              </td>


              <td data-label="Risk Score">

                <span
                  class="badge ${riskClass}"
                >

                  ${
                    (
                      riskScore *
                      100
                    ).toFixed(1)
                  }%

                </span>

              </td>


              <td data-label="Status">

                ${status}

              </td>

            </tr>

          `;

        }
      )

      .join('');


  renderLivePagination();

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

    tbody.innerHTML = `

      <tr>

        <td
          colspan="6"
          style="text-align:center;"
        >

          Loading stream packets...

        </td>

      </tr>

    `;


    const response =
      await API.getLiveTransactions(

        currentLivePage,

        LIVE_PAGE_SIZE

      );


    // ========================================================
    // NORMALIZE RESPONSE
    // ========================================================

    if (
      Array.isArray(
        response
      )
    ) {

      liveTransactions =
        response;


      liveTotalRecords =
        response.length;


      liveTotalPages =
        1;

    } else {

      liveTransactions =

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


      liveTotalRecords =

        Number(

          response?.total ??

          response?.total_records ??

          response?.count ??

          liveTransactions.length

        );


      liveTotalPages =

        Math.max(

          1,

          Number(

            response?.total_pages ??

            Math.ceil(

              liveTotalRecords /
              LIVE_PAGE_SIZE

            )

          )

        );


      currentLivePage =

        Math.min(

          Math.max(

            1,

            Number(

              response?.page ??
              currentLivePage

            )

          ),

          liveTotalPages

        );

    }


    renderLiveTransactions();

  } catch (
    error
  ) {

    console.error(
      'Live transaction loading error:',
      error
    );


    tbody.innerHTML = `

      <tr>

        <td
          colspan="6"
          style="
            text-align:center;
            padding:1.5rem;
            color:var(--risk-critical);
          "
        >

          Unable to load live stream transactions.

        </td>

      </tr>

    `;


    renderLivePagination();

  }

}


// ============================================================
// UPDATE METRICS
// ============================================================

function updateMetric(
  id,
  value
) {

  const element =
    document.getElementById(
      id
    );


  if (!element) {

    return;

  }


  const nextValue =
    String(
      value
    );


  if (
    element.textContent !==
    nextValue
  ) {

    element.textContent =
      nextValue;

  }

}


// ============================================================
// UPDATE CHART DATA
// ============================================================

function updateCharts(
  streamMetrics,
  summary
) {

  // ==========================================================
  // TIME
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


  // ==========================================================
  // TOTAL TRANSACTIONS
  // ==========================================================

  const totalValue =

  Number(
    summary?.total_transactions ?? 0
  );


  // ==========================================================
  // FRAUD DETECTED
  // ==========================================================

  const fraudValue =

  Number(
    summary?.total_fraud_transactions ?? 0
  );

  // ==========================================================
  // BLOCKED
  //
  // Use a real blocked field when the backend provides one.
  // ==========================================================

  const blockedValue =

    Number(

      streamMetrics?.blocked ??

      streamMetrics?.blocked_count ??

      streamMetrics?.transactions_blocked ??

      0

    );


  // ==========================================================
  // SAVE TREND HISTORY
  // ==========================================================

  fraudHistory.push({

    time:
      timeLabel,

    fraud:
      fraudValue,

    blocked:
      blockedValue,

    total:
      totalValue

  });


  /*
   * Keep only the latest 10 points.
   */

  if (
    fraudHistory.length > 10
  ) {

    fraudHistory =
      fraudHistory.slice(
        -10
      );

  }


  // ==========================================================
  // RISK DISTRIBUTION
  // ==========================================================

  let low = 0;

  let medium = 0;

  let high = 0;

  let critical = 0;


  liveTransactions.forEach(
    tx => {

      const score =
        Number(
          tx?.risk_score ??
          0
        );


      if (
        score <= 0.25
      ) {

        low++;

      } else if (
        score <= 0.50
      ) {

        medium++;

      } else if (
        score <= 0.80
      ) {

        high++;

      } else {

        critical++;

      }

    }
  );


  /*
   * The chart has only three categories:
   *
   * Low Risk
   * Medium Risk
   * High Risk
   *
   * Critical is included inside High Risk.
   */

  riskData = [

    low,

    medium,

    high +
      critical

  ];


  /*
   * When there is no transaction data,
   * show a small Low Risk segment instead
   * of a completely empty doughnut.
   */

  if (
    riskData.every(
      value =>
        value === 0
    )
  ) {

    riskData = [

      1,

      0,

      0

    ];

  }


  // ==========================================================
  // UPDATE TRANSACTION TREND
  // ==========================================================

  if (
    fraudTrendChart
  ) {

    fraudTrendChart.data.labels =

      fraudHistory.map(
        point =>
          point.time
      );


    /*
     * Dataset 0
     * Total Transactions
     */

    if (
      fraudTrendChart
        .data
        .datasets[0]
    ) {

      fraudTrendChart
        .data
        .datasets[0]
        .data =

        fraudHistory.map(
          point =>
            point.total
        );

    }


    /*
     * Dataset 1
     * Fraud Detected
     */

    if (
      fraudTrendChart
        .data
        .datasets[1]
    ) {

      fraudTrendChart
        .data
        .datasets[1]
        .data =

        fraudHistory.map(
          point =>
            point.fraud
        );

    }


    /*
     * Dataset 2
     * Blocked
     */

    if (
      fraudTrendChart
        .data
        .datasets[2]
    ) {

      fraudTrendChart
        .data
        .datasets[2]
        .data =

        fraudHistory.map(
          point =>
            point.blocked
        );

    }


    fraudTrendChart.update(
      'none'
    );

  }


  // ==========================================================
  // UPDATE RISK DISTRIBUTION
  // ==========================================================

  if (
    riskDistributionChart
  ) {

    riskDistributionChart
      .data
      .datasets[0]
      .data =

      riskData;


    /*
     * Update center total.
     */

    const totalElement =
      document.getElementById(
        'metric-total-tx'
      );


    const displayedTotal =

      Number(

        totalElement
          ?.textContent
          ?.replace(
            /,/g,
            ''
          )

      );


    riskDistributionChart
      .$fraudShieldTotal =

      Number.isFinite(
        displayedTotal
      )

        ? displayedTotal

        : totalValueFallback(
            streamMetrics
          );


    riskDistributionChart.update(
      'none'
    );

  }

}


// ============================================================
// TOTAL FALLBACK
// ============================================================

function totalValueFallback(
  streamMetrics
) {

  return Number(

    streamMetrics?.total_ingested ??

    streamMetrics?.processed_count ??

    0

  );

}


// ============================================================
// REFRESH DASHBOARD DATA
// ============================================================

async function refreshDashboard() {
 if (
    dashboardRefreshing
  ) {
    return;
  }

  dashboardRefreshing = true;

  try {

    // ========================================================
    // SUMMARY
    // ========================================================

    const summaryResponse =
      await API.getDashboardSummary();

    const summary =
      summaryResponse?.data ||
      summaryResponse ||
      {};


    // ========================================================
    // UPDATE DAILY DASHBOARD METRICS
    // ========================================================

    const totalTransactions =
      Number(
        summary.total_transactions ?? 0
      );

    const highRisk =
      Number(
        summary.high_risk_transactions ?? 0
      );

    const activeAlerts =
      Number(
        summary.open_alerts ?? 0
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


    // ========================================================
    // STREAM METRICS
    // ========================================================
    // Stream metrics are separate from the daily dashboard
    // counters. If unavailable, the dashboard still works.
    // ========================================================

    let streamMetrics = {};

    try {

      const streamResponse =
        await API.getStreamMetrics();

      streamMetrics =
        streamResponse?.metrics ||
        streamResponse ||
        {};

    } catch (streamError) {

      console.warn(
        'Stream metrics unavailable:',
        streamError
      );

    }


    // ========================================================
    // LATENCY
    // ========================================================

    const latency =
      Number(
        streamMetrics?.latency_ms ?? 0
      );

    updateMetric(
      'metric-latency',
      `${latency.toFixed(1)} ms`
    );


    // ========================================================
    // LIVE TRANSACTIONS
    // ========================================================

    if (
      currentLivePage === 1
    ) {

      await loadLiveTransactions();

    }


    // ========================================================
    // UPDATE CHARTS
    // ========================================================

    updateCharts(
      streamMetrics,
      summary
    );

  } catch (error) {

    console.error(
      'Dashboard refresh error:',
      error
    );

  } finally {

    dashboardRefreshing = false;

  }

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

    0

  ];


  // ==========================================================
  // DESTROY OLD TRANSACTION TREND CHART
  // ==========================================================

  if (
    fraudTrendChart
  ) {

    fraudTrendChart.destroy();


    fraudTrendChart =
      null;

  }


  // ==========================================================
  // DESTROY OLD RISK CHART
  // ==========================================================

  if (
    riskDistributionChart
  ) {

    riskDistributionChart.destroy();


    riskDistributionChart =
      null;

  }


  // ==========================================================
  // CREATE TRANSACTION TREND CHART
  // ==========================================================

  fraudTrendChart =

    renderFraudTrendsChart(

      'fraudTrendCanvas',

      [],

      [],

      [],

      []

    );


  // ==========================================================
  // CREATE RISK DISTRIBUTION CHART
  // ==========================================================

  riskDistributionChart =

    renderRiskDistributionChart(

      'riskDistributionCanvas',

      [

        1,

        0,

        0

      ],

      0

    );


  // ==========================================================
  // THEME CHANGE
  // ==========================================================

  const themeHandler =
    () => {

      // ------------------------------------------------------
      // Destroy old trend chart
      // ------------------------------------------------------

      if (
        fraudTrendChart
      ) {

        fraudTrendChart.destroy();


        fraudTrendChart =
          null;

      }


      // ------------------------------------------------------
      // Destroy old risk chart
      // ------------------------------------------------------

      if (
        riskDistributionChart
      ) {

        riskDistributionChart.destroy();


        riskDistributionChart =
          null;

      }


      // ------------------------------------------------------
      // Re-create trend chart
      // ------------------------------------------------------

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
          ),

          fraudHistory.map(
            point =>
              point.blocked
          ),

          fraudHistory.map(
            point =>
              point.total
          )

        );


      // ------------------------------------------------------
      // Get current total
      // ------------------------------------------------------

      const totalElement =
        document.getElementById(
          'metric-total-tx'
        );


      const totalTransactions =

        Number(

          totalElement
            ?.textContent
            ?.replace(
              /,/g,
              ''
            )

        ) || 0;


      // ------------------------------------------------------
      // Re-create risk chart
      // ------------------------------------------------------

      riskDistributionChart =

        renderRiskDistributionChart(

          'riskDistributionCanvas',

          riskData,

          totalTransactions

        );

    };


  window.addEventListener(

    'fraudshield-theme-changed',

    themeHandler

  );


  // ==========================================================
  // FIRST LOAD
  // ==========================================================

  await refreshDashboard();


  // ==========================================================
  // STABLE REFRESH
  //
  // Refresh every 5 seconds.
  // ==========================================================

  dashboardPoller =

    setInterval(

      refreshDashboard,

      5000

    );


  window.currentViewPoller =
    dashboardPoller;

}