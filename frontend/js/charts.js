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
 * Dashboard chart design:
 *   Transaction Trend:
 *      Gold  = Total Transactions
 *      Red   = Fraud Detected
 *      Green = Blocked
 *
 *   Risk Distribution:
 *      Green  = Low Risk
 *      Gold   = Medium Risk
 *      Red    = High Risk
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

  const isDark =
    document.documentElement.getAttribute(
      'data-theme'
    ) === 'dark';


  return {

    /*
     * Main chart text.
     */

    text:
      isDark
        ? '#fff8e5'
        : '#4f4637',


    /*
     * Secondary / muted chart text.
     */

    muted:
      isDark
        ? '#a99a74'
        : '#81745f',


    /*
     * Chart grid / border color.
     */

    border:
      getCssVariable(
        '--border-light',
        'rgba(201, 149, 47, 0.18)'
      ),


    /*
     * Primary theme color.
     * Gold in Black & Gold theme.
     */

    primary:
      getCssVariable(
        '--accent-primary',
        '#d6a83a'
      ),


    /*
     * Risk colors.
     *
     * Green = Low
     * Yellow = Medium
     * Orange = High
     * Red = Critical
     */

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


  /*
   * Make sure Chart.js is available.
   */

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

    /*
     * Responsive chart.
     */

    responsive:
      true,


    /*
     * Parent wrapper controls height.
     */

    maintainAspectRatio:
      false,


    /*
     * Disable animation during live updates.
     */

    animation:
      false,


    /*
     * Small resize delay.
     */

    resizeDelay:
      80,


    /*
     * Common interaction.
     */

    interaction: {

      intersect:
        false,

      mode:
        'index'

    },


    /*
     * Common plugins.
     */

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
// FRAUD VELOCITY / TRANSACTION TREND
// ============================================================

export function renderFraudTrendsChart(

  canvasId,

  labels = [],

  data = [],

  blockedData = [],

  totalData = []

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
   * Destroy previous chart instance.
   */

  const existing =
    Chart.getChart(
      canvas
    );


  if (existing) {

    existing.destroy();

  }


  /*
   * Fraud values.
   */

  const fraud =
    Array.isArray(data)
      ? data
      : [];


  /*
   * Blocked values.
   */

  const blocked =
    Array.isArray(blockedData)
      ? blockedData
      : [];


  /*
   * Total transaction values.
   */

  const total =
    Array.isArray(totalData)
      ? totalData
      : [];


  return new Chart(

    canvas,

    {

      type:
        'line',


      data: {

        labels:

          Array.isArray(labels)
            ? labels
            : [],


        datasets: [

          // --------------------------------------------------
          // TOTAL TRANSACTIONS
          // --------------------------------------------------

          {
            label:
              'Total Transactions',

            data:
              total,

            borderColor:
              '#d6a83a',

            backgroundColor:
              'transparent',

            pointBackgroundColor:
              '#d6a83a',

            pointBorderColor:
              '#d6a83a',

            pointRadius:
              3,

            pointHoverRadius:
              5,

            tension:
              0.28,

            borderWidth:
              2

          },


          // --------------------------------------------------
          // FRAUD DETECTED
          // --------------------------------------------------

          {
            label:
              'Fraud Detected',

            data:
              fraud,

            borderColor:
              '#ef4444',

            backgroundColor:
              'transparent',

            pointBackgroundColor:
              '#ef4444',

            pointBorderColor:
              '#ef4444',

            pointRadius:
              3,

            pointHoverRadius:
              5,

            tension:
              0.28,

            borderWidth:
              2

          },


          // --------------------------------------------------
          // BLOCKED
          // --------------------------------------------------

          {
            label:
              'Blocked',

            data:
              blocked,

            borderColor:
              '#10b981',

            backgroundColor:
              'transparent',

            pointBackgroundColor:
              '#10b981',

            pointBorderColor:
              '#10b981',

            pointRadius:
              3,

            pointHoverRadius:
              5,

            tension:
              0.28,

            borderWidth:
              2

          }

        ]

      },


      options: {

        ...baseChartOptions(
          colors
        ),


        plugins: {

          ...baseChartOptions(
            colors
          ).plugins,


          // ------------------------------------------------
          // TRANSACTION TREND LEGEND
          // ------------------------------------------------

          legend: {

            display:
              true,

            position:
              'top',

            align:
              'start',

            labels: {

              color:
                colors.text,

              usePointStyle:
                true,

              pointStyle:
                'circle',

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

        },


        scales: {

          // ------------------------------------------------
          // X AXIS
          // ------------------------------------------------

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


          // ------------------------------------------------
          // Y AXIS
          // ------------------------------------------------

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

  data = [1, 0, 0],

  totalTransactions = null

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
   * Destroy existing chart.
   */

  const existing =
    Chart.getChart(
      canvas
    );


  if (existing) {

    existing.destroy();

  }


  /*
   * Three categories:
   *
   * Low Risk
   * Medium Risk
   * High Risk
   *
   * If old code sends four categories:
   *
   * Low
   * Medium
   * High
   * Critical
   *
   * High + Critical are combined.
   */

  let values =
    Array.isArray(data)
      ? data.map(
          value =>
            Math.max(
              0,
              Number(value) || 0
            )
        )
      : [1, 0, 0];


  /*
   * Backward compatibility:
   * Combine High + Critical.
   */

  if (
    values.length >= 4
  ) {

    values = [

      values[0],

      values[1],

      values[2] +
        values[3]

    ];

  }


  /*
   * Make sure exactly
   * three values exist.
   */

  values = [

    values[0] ?? 0,

    values[1] ?? 0,

    values[2] ?? 0

  ];


  /*
   * Total of risk values.
   */

  const valueTotal =
    values.reduce(

      (sum, value) =>
        sum + value,

      0

    );


  /*
   * Center number.
   */

  const centerTotal =
    Number.isFinite(
      Number(
        totalTransactions
      )
    )

      ? Number(
          totalTransactions
        )

      : valueTotal;


  // ========================================================
  // CENTER TEXT PLUGIN
  // ========================================================

  const centerTextPlugin = {

    id:
      'fraudShieldRiskCenter',


    afterDraw(chart) {

      const {
        ctx,
        chartArea
      } = chart;


      if (!chartArea) {

        return;

      }


      const meta =
        chart.getDatasetMeta(
          0
        );


      if (
        !meta ||
        !meta.data ||
        !meta.data.length
      ) {

        return;

      }


      const x =
        meta.data[0].x;


      const y =
        meta.data[0].y;


      ctx.save();


      ctx.textAlign =
        'center';


      ctx.textBaseline =
        'middle';


      /*
       * Main number.
       */

      ctx.fillStyle =
        colors.text;


      ctx.font =
        '700 18px sans-serif';


      const liveCenterTotal =
        Number.isFinite(
          Number(
            chart.$fraudShieldTotal
          )
        )

          ? Number(
              chart.$fraudShieldTotal
            )

          : centerTotal;


      ctx.fillText(

        liveCenterTotal.toLocaleString(

          'en-US',

          {

            maximumFractionDigits:
              1

          }

        ),

        x,

        y - 7

      );


      /*
       * "Transactions"
       * under the number.
       */

      ctx.fillStyle =
        colors.muted;


      ctx.font =
        '10px sans-serif';


      ctx.fillText(

        'Transactions',

        x,

        y + 10

      );


      ctx.restore();

    }

  };


  // ========================================================
  // CREATE DOUGHNUT
  // ========================================================

  return new Chart(

    canvas,

    {

      type:
        'doughnut',


      data: {

        labels: [

          'Low Risk',

          'Medium Risk',

          'High Risk'

        ],


        datasets: [

          {

            data:
              values,


            /*
             * Reference colors:
             *
             * Green
             * Gold
             * Red
             */

            backgroundColor: [

              colors.low,

              colors.medium,

              colors.critical

            ],


            borderWidth:
              0,


            hoverOffset:
              4

          }

        ]

      },


      plugins: [

        centerTextPlugin

      ],


      options: {

        ...baseChartOptions(
          colors
        ),


        /*
         * Doughnut hole size.
         */

        cutout:
          '62%',


        plugins: {

          ...baseChartOptions(
            colors
          ).plugins,


 // ------------------------------------------------
// RISK LEGEND
// ------------------------------------------------

legend: {

    display: true,

    position: 'right',

    align: 'center',

    labels: {

        // Force legend text to gold
        color: '#d6a83a',

        // Compatibility with older Chart.js versions
        fontColor: '#d6a83a',

        usePointStyle: true,

        pointStyle: 'circle',

        boxWidth: 8,

        padding: 12,

        font: {
            size: 12,
            weight: '600'
        },

        /*
         * Add percentages and FORCE
         * every legend item's text color.
         */

        generateLabels(chart) {

            const chartData =
                chart.data;

            const dataset =
                chartData.datasets[0];

            const total =
                dataset.data.reduce(
                    (sum, value) =>
                        sum + Number(value || 0),
                    0
                );

            return chartData.labels.map(
                (label, index) => {

                    const value =
                        Number(
                            dataset.data[index] || 0
                        );

                    const percentage =
                        total > 0
                            ? (
                                value /
                                total *
                                100
                            ).toFixed(0)
                            : '0';

                    return {

                        text:
                            `${label}   ${percentage}%`,

                        fillStyle:
                            dataset.backgroundColor[index],

                        strokeStyle:
                            dataset.backgroundColor[index],

                        lineWidth: 0,

                        hidden: false,

                        index: index,

                        // FORCE GOLD TEXT
                        color: '#d6a83a',

                        fontColor: '#d6a83a'

                    };

                }
            );

        }

    }

},

          // ------------------------------------------------
          // TOOLTIP
          // ------------------------------------------------

          tooltip: {

            enabled:
              true,


            callbacks: {

              label(context) {

                const values =
                  context
                    .dataset
                    .data;


                const total =
                  values.reduce(

                    (sum, value) =>
                      sum +
                      Number(
                        value || 0
                      ),

                    0

                  );


                const value =
                  Number(
                    context.raw || 0
                  );


                const percentage =

                  total > 0

                    ? (

                        value /
                        total *
                        100

                      ).toFixed(
                        1
                      )

                    : '0.0';


                return (

                  `${context.label}: ` +
                  `${value} ` +
                  `(${percentage}%)`

                );

              }

            }

          }

        }

      }

    }

  );

}