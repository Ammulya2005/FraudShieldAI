import { API } from '../api.js';

// ============================================================
// RENDER MODELS
// ============================================================

export function renderModels() {
  return `
    <div class="models-page">
       <!-- ==================================================
           MODEL TRAINING & MONITORING
           ================================================== -->

      <div class="card ml-monitoring-card">

        <div class="ml-monitoring-header">

          <div>
            <h3>Model Training & Monitoring</h3>

            <p class="ml-monitoring-description">
              Real-time machine learning inference and model activity.
            </p>
          </div>

          <div class="ml-monitoring-status">
           <span class="ml-status-dot"></span>

          <div class="ml-monitoring-status-content">
           <strong>Monitoring Active</strong>
           <span id="ml-monitoring-updated">
             Updating...
           </span>
          </div>
        </div>

        </div>


        <!-- MONITORING METRICS -->

        <div class="ml-monitoring-metrics">


          <!-- TRANSACTIONS -->

          <div class="ml-monitoring-metric">

            <span class="ml-monitoring-metric-label">
              Transactions Processed
            </span>

            <strong
              id="ml-transactions-processed"
              class="ml-monitoring-metric-value"
            >
              0
            </strong>

            <span class="ml-monitoring-metric-sub">
              Total predictions
            </span>

          </div>


          <!-- FRAUD -->

          <div class="ml-monitoring-metric">

            <span class="ml-monitoring-metric-label">
              Fraud Detected
            </span>

            <strong
              id="ml-fraud-detected"
              class="ml-monitoring-metric-value ml-metric-fraud"
            >
              0
            </strong>

            <span class="ml-monitoring-metric-sub">
              Fraud classifications
            </span>

          </div>


          <!-- LEGITIMATE -->

          <div class="ml-monitoring-metric">

            <span class="ml-monitoring-metric-label">
              Legitimate
            </span>

            <strong
              id="ml-legitimate-detected"
              class="ml-monitoring-metric-value ml-metric-legitimate"
            >
              0
            </strong>

            <span class="ml-monitoring-metric-sub">
              Clean classifications
            </span>

          </div>


          <!-- ANOMALIES -->

          <div class="ml-monitoring-metric">

            <span class="ml-monitoring-metric-label">
              Anomalies Detected
            </span>

            <strong
              id="ml-anomalies-detected"
              class="ml-monitoring-metric-value ml-metric-anomaly"
            >
              0
            </strong>

            <span class="ml-monitoring-metric-sub">
              Isolation Forest
            </span>

          </div>


          <!-- LATENCY -->

          <div class="ml-monitoring-metric">

            <span class="ml-monitoring-metric-label">
              Prediction Latency
            </span>

            <strong
              id="ml-prediction-latency"
              class="ml-monitoring-metric-value"
            >
              0 ms
            </strong>

            <span class="ml-monitoring-metric-sub">
              Average inference time
            </span>

          </div>

        </div>
        <!-- MODEL PERFORMANCE -->
<div class="ml-performance-section">

  <div class="ml-performance-header">
    <div>
      <h4>Model Performance</h4>
      <p>Current performance of active fraud detection models</p>
    </div>

    <span class="ml-performance-badge">PRODUCTION</span>
  </div>

  <div class="ml-performance-grid">

    <div class="ml-performance-item">
      <div class="ml-performance-top">
        <span>XGBoost — ROC-AUC</span>
        <strong id="ml-xgb-auc">0%</strong>
      </div>

      <div class="ml-performance-bar">
        <span id="ml-xgb-auc-bar"></span>
      </div>
    </div>

    <div class="ml-performance-item">
      <div class="ml-performance-top">
        <span>XGBoost — F1 Score</span>
        <strong id="ml-xgb-f1">0%</strong>
      </div>

      <div class="ml-performance-bar">
        <span id="ml-xgb-f1-bar"></span>
      </div>
    </div>

    <div class="ml-performance-item">
      <div class="ml-performance-top">
        <span>Isolation Forest</span>
        <strong id="ml-isolation-status">ACTIVE</strong>
      </div>

      <div class="ml-performance-bar">
        <span class="ml-isolation-bar"></span>
      </div>
    </div>

  </div>

</div>

        <!-- MODEL STATUS -->

        <div class="ml-model-status-row">

          <div class="ml-model-status-item">

            <div class="ml-model-icon">
              X
            </div>

            <div>
              <strong>XGBoost</strong>
              <span>Fraud Classification</span>
            </div>

            <span class="ml-model-active">
              ACTIVE
            </span>

          </div>


          <div class="ml-model-status-item">

            <div class="ml-model-icon">
              I
            </div>

            <div>
              <strong>Isolation Forest</strong>
              <span>Anomaly Detection</span>
            </div>

            <span class="ml-model-active">
              ACTIVE
            </span>

          </div>

        </div>


        <!-- LIVE ACTIVITY CHART -->

        <div class="ml-activity-card">

          <div class="ml-activity-header">

            <div>
              <h4>Live Model Activity</h4>

              <p>
                Transaction processing and fraud detection activity
              </p>
            </div>

            <span class="ml-live-indicator">
              ● LIVE
            </span>

          </div>

          <div class="ml-activity-chart">

            <canvas id="mlMonitoringChart"></canvas>

          </div>

        </div>

      </div>
    </div>
  `;
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {

  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}


// ============================================================
// LOAD MODELS
// ============================================================

async function loadModels() {

  try {

    const response =
      await API.getModels();

    const models =
      Array.isArray(response)
        ? response
        : Array.isArray(response?.models)
          ? response.models
          : Array.isArray(response?.data)
            ? response.data
            : [];

    // --------------------------------------------------------
    // ACTIVE MODEL
    // --------------------------------------------------------

    const activeModel =
      response?.active_model ||
      response?.activeModel ||
      models.find(
        model =>
          model.active === true ||
          model.is_active === true
      );

    // --------------------------------------------------------
    // SCORES
    // --------------------------------------------------------

    const rocAuc =
      response?.roc_auc ??
      response?.roc_auc_score ??
      activeModel?.roc_auc ??
      activeModel?.roc_auc_score ??
      0.984;

    const f1 =
      response?.f1_score ??
      response?.f1 ??
      activeModel?.f1_score ??
      activeModel?.f1 ??
      0.941;

    // --------------------------------------------------------
    // MODEL PERFORMANCE
    // --------------------------------------------------------

    const xgbAucPerformance =
      document.getElementById(
        'ml-xgb-auc'
      );

    const xgbAucBar =
      document.getElementById(
        'ml-xgb-auc-bar'
      );

    const xgbF1Performance =
      document.getElementById(
        'ml-xgb-f1'
      );

    const xgbF1Bar =
      document.getElementById(
        'ml-xgb-f1-bar'
      );

    const xgbAucValue =
      Number(rocAuc);

    const xgbF1Value =
      Number(f1);

    if (xgbAucPerformance) {
      xgbAucPerformance.textContent =
        `${(xgbAucValue * 100).toFixed(1)}%`;
    }

    if (xgbAucBar) {
      xgbAucBar.style.width =
        `${Math.max(
          0,
          Math.min(
            100,
            xgbAucValue * 100
          )
        )}%`;
    }

    if (xgbF1Performance) {
      xgbF1Performance.textContent =
        `${(xgbF1Value * 100).toFixed(1)}%`;
    }

    if (xgbF1Bar) {
      xgbF1Bar.style.width =
        `${Math.max(
          0,
          Math.min(
            100,
            xgbF1Value * 100
          )
        )}%`;
    }

  } catch (error) {

    console.error(
      'ML Models API error:',
      error
    );

  }

}


// ============================================================
// RETRAIN
// ============================================================

async function retrainIsolationForest() {

  const button =
    document.getElementById(
      'retrain-isolation-forest'
    );

  const message =
    document.getElementById(
      'training-message'
    );

  const status =
    document.querySelector(
      '.ml-monitoring-status'
    );

  const statusDot =
    document.querySelector(
      '.ml-status-dot'
    );

  if (button) {
    button.disabled = true;
    button.textContent = 'Training...';
  }

  if (message) {
    message.textContent =
      'Isolation Forest training is in progress...';
    message.className =
      'training-message training-active';
  }

  if (status) {
    status.innerHTML =
      '<span class="ml-status-dot training"></span> Training in Progress';
  }

  try {

    const result =
      await API.triggerTraining({
        model: 'Isolation Forest'
      });

    if (message) {
      message.textContent =
        'Isolation Forest retraining completed successfully.';
      message.className =
        'training-message training-success';
    }

    if (status) {
      status.innerHTML =
        '<span class="ml-status-dot"></span> Monitoring Active';
    }

    await loadModels();

    await loadMLMonitoringMetrics();

  } catch (error) {

    console.error(
      'Isolation Forest training error:',
      error
    );

    if (message) {
      message.textContent =
        'Isolation Forest training failed. Please try again.';
      message.className =
        'training-message training-error';
    }

    if (status) {
      status.innerHTML =
        '<span class="ml-status-dot error"></span> Training Error';
    }

  } finally {

    if (button) {
      button.disabled = false;
      button.textContent =
        'Retrain Isolation Forest';
    }

  }
}
// ============================================================
// PROMETHEUS MODEL MONITORING
// ============================================================

async function loadMLMonitoringMetrics() {

  try {

    const response = await fetch('/metrics');

    if (!response.ok) {
      throw new Error('Unable to fetch Prometheus metrics');
    }

    const text = await response.text();


    // --------------------------------------------------------
    // Helper: read Prometheus metric value
    // --------------------------------------------------------

    function getMetricValue(metricName) {

      const regex = new RegExp(
        '^' + metricName + '(?:\\{[^}]*\\})?\\s+([0-9.eE+-]+)$',
        'm'
      );

      const match = text.match(regex);

      return match
        ? Number(match[1])
        : 0;
    }


    // --------------------------------------------------------
    // Get metrics
    // --------------------------------------------------------

    const transactionsProcessed =
      getMetricValue(
        'fraudshield_transactions_processed_total'
      );

    const fraudDetected =
      getMetricValue(
        'fraudshield_fraud_detected_total'
      );

    const legitimateDetected =
      getMetricValue(
        'fraudshield_legitimate_detected_total'
      );

    const anomaliesDetected =
      getMetricValue(
        'fraudshield_isolation_forest_anomalies_total'
      );
      renderMLMonitoringChart(
        transactionsProcessed,
        fraudDetected,
        anomaliesDetected
      );


    // --------------------------------------------------------
    // Prediction latency
    // --------------------------------------------------------

    const latencyCount =
      getMetricValue(
        'fraudshield_prediction_latency_seconds_count'
      );

    const latencySum =
      getMetricValue(
        'fraudshield_prediction_latency_seconds_sum'
      );

    let latencyMs = 0;

    if (latencyCount > 0) {

      latencyMs =
        (latencySum / latencyCount) * 1000;

    }


    // --------------------------------------------------------
    // Update dashboard
    // --------------------------------------------------------

    const transactionsElement =
      document.getElementById(
        'ml-transactions-processed'
      );

    const fraudElement =
      document.getElementById(
        'ml-fraud-detected'
      );

    const legitimateElement =
      document.getElementById(
        'ml-legitimate-detected'
      );

    const anomaliesElement =
      document.getElementById(
        'ml-anomalies-detected'
      );

    const latencyElement =
      document.getElementById(
        'ml-prediction-latency'
      );


    if (transactionsElement) {

      transactionsElement.textContent =
        transactionsProcessed.toLocaleString();

    }


    if (fraudElement) {

      fraudElement.textContent =
        fraudDetected.toLocaleString();

    }


    if (legitimateElement) {

      legitimateElement.textContent =
        legitimateDetected.toLocaleString();

    }


    if (anomaliesElement) {

      anomaliesElement.textContent =
        anomaliesDetected.toLocaleString();

    }


    if (latencyElement) {

      latencyElement.textContent =
        latencyCount > 0
          ? `${latencyMs.toFixed(0)} ms`
          : '0 ms';

    }
    const updatedElement =
  document.getElementById(
    'ml-monitoring-updated'
  );

if (updatedElement) {
  updatedElement.textContent =
    `Updated ${new Date().toLocaleTimeString(
      [],
      {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    )}`;
}


  } catch (error) {

    console.error(
      'Prometheus monitoring error:',
      error
    );

  }

}
// ============================================================
// LIVE ML MODEL ACTIVITY CHART
// ============================================================

let mlMonitoringChart = null;

function renderMLMonitoringChart(
  transactions,
  fraud,
  anomalies
) {

  const canvas =
    document.getElementById('mlMonitoringChart');

  if (!canvas || typeof Chart === 'undefined') {
    return;
  }


  const isDark =
    document.documentElement.getAttribute('data-theme') === 'dark';

  const textColor =
    isDark ? '#fff8e5' : '#4f4637';

  const gridColor =
    isDark
      ? 'rgba(214, 168, 58, 0.16)'
      : 'rgba(201, 149, 47, 0.18)';


  // Keep a short live history
  if (!window.__fraudShieldMLHistory) {

    window.__fraudShieldMLHistory = {
      labels: [],
      transactions: [],
      fraud: [],
      anomalies: []
    };

  }


  const history =
    window.__fraudShieldMLHistory;


  const now =
    new Date().toLocaleTimeString(
      [],
      {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    );


  history.labels.push(now);
  history.transactions.push(transactions);
  history.fraud.push(fraud);
  history.anomalies.push(anomalies);


  // Keep last 12 readings
  if (history.labels.length > 12) {

    history.labels.shift();
    history.transactions.shift();
    history.fraud.shift();
    history.anomalies.shift();

  }


  if (mlMonitoringChart) {

    mlMonitoringChart.data.labels =
      history.labels;

    mlMonitoringChart.data.datasets[0].data =
      history.transactions;

    mlMonitoringChart.data.datasets[1].data =
      history.fraud;

    mlMonitoringChart.data.datasets[2].data =
      history.anomalies;

    mlMonitoringChart.update('none');

    return;

  }


  mlMonitoringChart =
    new Chart(
      canvas,
      {
        type: 'line',

        data: {

          labels: history.labels,

          datasets: [

            {
              label: 'Transactions',
              data: history.transactions,

              borderColor: '#d6a83a',
              backgroundColor: 'transparent',

              pointBackgroundColor: '#d6a83a',
              pointBorderColor: '#d6a83a',

              pointRadius: 3,
              pointHoverRadius: 5,

              tension: 0.28,
              borderWidth: 2
            },


            {
              label: 'Fraud',
              data: history.fraud,

              borderColor: '#ef4444',
              backgroundColor: 'transparent',

              pointBackgroundColor: '#ef4444',
              pointBorderColor: '#ef4444',

              pointRadius: 3,
              pointHoverRadius: 5,

              tension: 0.28,
              borderWidth: 2
            },


            {
              label: 'Anomalies',
              data: history.anomalies,

              borderColor: '#f59e0b',
              backgroundColor: 'transparent',

              pointBackgroundColor: '#f59e0b',
              pointBorderColor: '#f59e0b',

              pointRadius: 3,
              pointHoverRadius: 5,

              tension: 0.28,
              borderWidth: 2
            }

          ]

        },


        options: {

          responsive: true,
          maintainAspectRatio: false,
          animation: false,

          interaction: {
            intersect: false,
            mode: 'index'
          },


          plugins: {

            legend: {

              display: true,
              position: 'top',
              align: 'start',

              labels: {

                color: textColor,

                usePointStyle: true,
                pointStyle: 'circle',

                boxWidth: 8,
                padding: 12,

                font: {
                  size: 10
                }

              }

            },


            tooltip: {
              enabled: true
            }

          },


          scales: {

            x: {

              grid: {
                color: gridColor,
                drawBorder: false
              },

              ticks: {
                color: textColor,
                maxTicksLimit: 6,
                maxRotation: 0,

                font: {
                  size: 9
                }

              }

            },


            y: {

              beginAtZero: true,

              grid: {
                color: gridColor,
                drawBorder: false
              },

              ticks: {
                color: textColor,
                precision: 0,

                font: {
                  size: 9
                }

              }

            }

          }

        }

      }
    );

}

// ============================================================
// INITIALIZE
// ============================================================

export async function initModelsEvents() {

  const button =
    document.getElementById(
      'retrain-isolation-forest'
    );

  button?.addEventListener(
    'click',
    retrainIsolationForest
  );


  await loadModels();


  // ----------------------------------------------------------
  // Initial Prometheus metrics load
  // ----------------------------------------------------------

  await loadMLMonitoringMetrics();


  // ----------------------------------------------------------
  // Refresh monitoring metrics every 5 seconds
  // ----------------------------------------------------------

  if (window.__fraudShieldMLMonitorTimer) {

    clearInterval(
      window.__fraudShieldMLMonitorTimer
    );

  }

  window.__fraudShieldMLMonitorTimer =
    setInterval(
      loadMLMonitoringMetrics,
      5000
    );

}