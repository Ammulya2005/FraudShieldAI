/*
 * ============================================================
 * FRAUDSHIELD AI
 * CHART.JS RENDERERS
 * ============================================================
 *
 * Stable responsive charts.
 *
 * IMPORTANT:
 * The parent .chart-wrapper controls the height.
 * The canvas fills that complete area.
 *
 * This fixes the problem where Fraud Velocity Trend
 * occupies only the upper portion of its card.
 * ============================================================
 */


// ============================================================
// CSS VARIABLE HELPER
// ============================================================

function getCssVariable(
  name,
  fallback
) {

  const value =

    getComputedStyle(
      document.documentElement
    )
      .getPropertyValue(
        name
      )
      .trim();


  return value ||
    fallback;

}


// ============================================================
// THEME COLORS
// ============================================================

function getThemeColors() {

  return {

    text:

      getCssVariable(
        '--text-secondary',
        '#475569'
      ),


    muted:

      getCssVariable(
        '--text-muted',
        '#64748b'
      ),


    border:

      getCssVariable(
        '--border-color',
        '#dbe2ea'
      ),


    primary:

      getCssVariable(
        '--accent-primary',
        '#3b82f6'
      ),


    low:

      getCssVariable(
        '--risk-low',
        '#10b981'
      ),


    medium:

      getCssVariable(
        '--risk-medium',
        '#f59e0b'
      ),


    high:

      getCssVariable(
        '--risk-high',
        '#f97316'
      ),


    critical:

      getCssVariable(
        '--risk-critical',
        '#ef4444'
      )

  };

}


// ============================================================
// GET CANVAS
// ============================================================

function getCanvas(
  id
) {

  const canvas =
    document.getElementById(
      id
    );


  if (!canvas) {

    console.warn(
      `Chart canvas not found: ${id}`
    );

    return null;

  }


  if (
    typeof Chart ===
    'undefined'
  ) {

    console.error(
      'Chart.js is not loaded. Check index.html.'
    );

    return null;

  }


  return canvas;

}


// ============================================================
// COMMON CHART OPTIONS
// ============================================================

function baseChartOptions(
  colors
) {

  return {

    responsive:
      true,


    /*
     * VERY IMPORTANT
     *
     * The parent wrapper controls chart height.
     *
     * Without this, Chart.js calculates its own
     * aspect ratio and leaves whitespace.
     */

    maintainAspectRatio:
      false,


    /*
     * Disable animation during chart rendering.
     *
     * This removes the visual jerk when ingestion
     * updates the dashboard.
     */

    animation:
      false,


    /*
     * Slight delay when browser resizes.
     * Prevents excessive resize calculations.
     */

    resizeDelay:
      80,


    interaction: {

      intersect:
        false,

      mode:
        'index'

    },


    plugins: {

      legend: {

        labels: {

          color:
            colors.text,

          usePointStyle:
            true,

          boxWidth:
            8,

          padding:
            14,

          font: {

            size:
              11

          }

        }

      },


      tooltip: {

        enabled:
          true

      }

    }

  };

}


// ============================================================
// FRAUD VELOCITY TREND
// ============================================================

export function renderFraudTrendsChart(

  canvasId,

  labels = [],

  data = []

) {

  const canvas =
    getCanvas(
      canvasId
    );


  if (!canvas) {

    return null;

  }


  const colors =
    getThemeColors();


  /*
   * Prevent duplicate Chart.js instances
   * attached to the same canvas.
   */

  const existing =
    Chart.getChart(
      canvas
    );


  if (existing) {

    existing.destroy();

  }


  return new Chart(

    canvas,

    {

      type:
        'line',


      data: {

        labels:

          Array.isArray(
            labels
          )

            ? labels

            : [],


        datasets: [

          {

            label:
              'Anomalous Transaction Volume',


            data:

              Array.isArray(
                data
              )

                ? data

                : [],


            borderColor:
              colors.critical,


            backgroundColor:
              'rgba(239, 68, 68, 0.10)',


            borderWidth:
              2.5,


            pointRadius:
              3,


            pointHoverRadius:
              5,


            pointBackgroundColor:
              colors.critical,


            pointBorderColor:
              colors.critical,


            fill:
              true,


            /*
             * Small curve makes the graph
             * look smooth without excessive animation.
             */

            tension:
              0.28,


            spanGaps:
              true

          }

        ]

      },


      options: {

        ...baseChartOptions(
          colors
        ),


        /*
         * Do not force a tiny chart height here.
         *
         * The .chart-wrapper controls the full
         * available chart rectangle.
         */

        scales: {

          x: {

            grid: {

              color:
                colors.border,

              drawBorder:
                false

            },


            ticks: {

              color:
                colors.muted,

              maxRotation:
                0,

              autoSkip:
                true,

              maxTicksLimit:
                8,

              font: {

                size:
                  10

              }

            }

          },


          y: {

            beginAtZero:
              true,


            grid: {

              color:
                colors.border,

              drawBorder:
                false

            },


            ticks: {

              color:
                colors.muted,

              precision:
                0,

              font: {

                size:
                  10

              }

            }

          }

        }

      }

    }

  );

}


// ============================================================
// RISK DISTRIBUTION
// ============================================================

export function renderRiskDistributionChart(

  canvasId,

  data = [
    1,
    0,
    0,
    0
  ]

) {

  const canvas =
    getCanvas(
      canvasId
    );


  if (!canvas) {

    return null;

  }


  const colors =
    getThemeColors();


  const existing =
    Chart.getChart(
      canvas
    );


  if (existing) {

    existing.destroy();

  }


  return new Chart(

    canvas,

    {

      type:
        'doughnut',


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

              Array.isArray(
                data
              )

                ? data

                : [
                    1,
                    0,
                    0,
                    0
                  ],


            backgroundColor: [

              colors.low,

              colors.medium,

              colors.high,

              colors.critical

            ],


            borderWidth:
              0,


            hoverOffset:
              4

          }

        ]

      },


      options: {

        ...baseChartOptions(
          colors
        ),


        /*
         * Doughnut thickness.
         */

        cutout:
          '62%',


        plugins: {

          legend: {

            position:
              'bottom',


            labels: {

              color:
                colors.text,

              usePointStyle:
                true,

              boxWidth:
                8,

              padding:
                12,

              font: {

                size:
                  10

              }

            }

          }

        }

      }

    }

  );

}