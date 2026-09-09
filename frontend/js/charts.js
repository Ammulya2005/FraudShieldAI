/**
 * Chart.js Factory for FraudShield AI
 *
 * Supports:
 * - Light Mode
 * - Dark Mode
 * - Theme-aware text
 * - Theme-aware grid
 * - Theme-aware legends
 * - Theme-aware tooltips
 */


/* =========================================================
   THEME COLORS
   ========================================================= */

function getChartTheme() {

  const theme =
    document.documentElement.getAttribute(
      'data-theme'
    ) || 'dark';


  if (theme === 'light') {

    return {

      text: '#334155',

      mutedText: '#64748b',

      grid: '#e2e8f0',

      tooltipBackground: '#ffffff',

      tooltipText: '#172033',

      tooltipBorder: '#d9e1ea',

    };

  }


  return {

    text: '#e2e8f0',

    mutedText: '#94a3b8',

    grid: '#334155',

    tooltipBackground: '#111827',

    tooltipText: '#f8fafc',

    tooltipBorder: '#334155',

  };

}



/* =========================================================
   RISK DISTRIBUTION CHART
   ========================================================= */

export function renderRiskDistributionChart(
  canvasId,
  dataPoints
) {

  const canvas =
    document.getElementById(canvasId);


  if (!canvas) {
    return;
  }


  const ctx =
    canvas.getContext('2d');


  if (!ctx) {
    return;
  }


  const theme =
    getChartTheme();


  return new Chart(ctx, {

    type: 'doughnut',


    data: {

      labels: [
        'Low Risk',
        'Medium Risk',
        'High Risk',
        'Critical Anomaly'
      ],


      datasets: [

        {

          data:
            dataPoints ||
            [65, 20, 10, 5],


          backgroundColor: [

            '#10b981',
            '#f59e0b',
            '#f97316',
            '#ef4444'

          ],


          borderWidth: 0,

        }

      ]

    },


    options: {

      responsive: true,

      maintainAspectRatio: true,


      plugins: {

        legend: {

          position: 'bottom',


          labels: {

            color:
              theme.text,

            padding: 18,

            usePointStyle: true,

            pointStyle: 'circle',

            font: {

              size: 12,

            }

          }

        },


        tooltip: {

          backgroundColor:
            theme.tooltipBackground,

          titleColor:
            theme.tooltipText,

          bodyColor:
            theme.tooltipText,

          borderColor:
            theme.tooltipBorder,

          borderWidth: 1,

          padding: 10,

          displayColors: true,

        }

      }

    }

  });

}



/* =========================================================
   FRAUD TREND CHART
   ========================================================= */

export function renderFraudTrendsChart(
  canvasId,
  labels,
  data
) {

  const canvas =
    document.getElementById(canvasId);


  if (!canvas) {
    return;
  }


  const ctx =
    canvas.getContext('2d');


  if (!ctx) {
    return;
  }


  const theme =
    getChartTheme();


  return new Chart(ctx, {

    type: 'line',


    data: {

      labels:
        labels ||
        [
          '00:00',
          '04:00',
          '08:00',
          '12:00',
          '16:00',
          '20:00'
        ],


      datasets: [

        {

          label:
            'Anomalous Transaction Volume',


          data:
            data ||
            [2, 1, 5, 14, 8, 22],


          borderColor:
            '#ef4444',


          backgroundColor:
            'rgba(239, 68, 68, 0.10)',


          tension: 0.4,

          fill: true,

          pointRadius: 3,

          pointHoverRadius: 5,

          pointBackgroundColor:
            '#ef4444',

          pointBorderColor:
            '#ef4444',

        }

      ]

    },


    options: {

      responsive: true,

      maintainAspectRatio: true,


      interaction: {

        intersect: false,

        mode: 'index',

      },


      plugins: {

        legend: {

          labels: {

            color:
              theme.text,

            padding: 18,

            usePointStyle: true,

            font: {

              size: 12,

            }

          }

        },


        tooltip: {

          backgroundColor:
            theme.tooltipBackground,

          titleColor:
            theme.tooltipText,

          bodyColor:
            theme.tooltipText,

          borderColor:
            theme.tooltipBorder,

          borderWidth: 1,

          padding: 10,

        }

      },


      scales: {

        x: {

          grid: {

            color:
              theme.grid,

            drawBorder: false,

          },


          ticks: {

            color:
              theme.mutedText,

            maxRotation: 0,

          }

        },


        y: {

          beginAtZero: true,


          grid: {

            color:
              theme.grid,

            drawBorder: false,

          },


          ticks: {

            color:
              theme.mutedText,

            precision: 0,

          }

        }

      }

    }

  });

}