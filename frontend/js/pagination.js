/**
 * Reusable pagination component
 *
 * Supports:
 * - 10 records per page
 * - 20 records per page
 * - 50 records per page
 * - Show All
 * - Previous / Next
 * - Page numbers
 * - Clean responsive layout
 */

export function renderPagination({
  containerId,
  page = 1,
  pageSize = 10,
  total = 0,
  pages = 1,
  onPageChange,
  onPageSizeChange,
  onShowAll,
  isShowingAll = false
}) {

  const container =
    document.getElementById(containerId);

  if (!container) return;


  /* =====================================================
     SHOW ALL MODE
     ===================================================== */

  if (isShowingAll) {

    container.innerHTML = `
      <div class="pagination-container">

        <div class="pagination-top">

          <div class="pagination-info">
            Showing all
            <strong>${total.toLocaleString()}</strong>
            records
          </div>

          <button
            type="button"
            class="pagination-show-paginated"
            id="${containerId}-show-paginated"
          >
            Show Paginated
          </button>

        </div>

      </div>
    `;


    document
      .getElementById(
        `${containerId}-show-paginated`
      )
      ?.addEventListener(
        'click',
        () => {
          onShowAll?.(false);
        }
      );

    return;
  }


  /* =====================================================
     EMPTY DATA
     ===================================================== */

  if (total === 0) {

    container.innerHTML = '';

    return;
  }


  /* =====================================================
     CALCULATE RANGE
     ===================================================== */

  const start =
    ((page - 1) * pageSize) + 1;

  const end =
    Math.min(
      page * pageSize,
      total
    );


  /* =====================================================
     PAGE BUTTONS
     ===================================================== */

  let pageButtons = '';

  const maxVisiblePages = 5;

  let startPage =
    Math.max(
      1,
      page - 2
    );

  let endPage =
    Math.min(
      pages,
      startPage + maxVisiblePages - 1
    );


  if (
    endPage - startPage
    < maxVisiblePages - 1
  ) {

    startPage =
      Math.max(
        1,
        endPage - maxVisiblePages + 1
      );
  }


  /* First page */

  if (startPage > 1) {

    pageButtons += `
      <button
        type="button"
        class="pagination-page"
        data-page="1"
        aria-label="Go to page 1"
      >
        1
      </button>
    `;


    if (startPage > 2) {

      pageButtons += `
        <span
          class="pagination-ellipsis"
        >
          …
        </span>
      `;
    }
  }


  /* Middle pages */

  for (
    let i = startPage;
    i <= endPage;
    i++
  ) {

    pageButtons += `
      <button
        type="button"
        class="pagination-page ${
          i === page ? 'active' : ''
        }"
        data-page="${i}"
        ${
          i === page
            ? 'aria-current="page"'
            : ''
        }
      >
        ${i}
      </button>
    `;
  }


  /* Last page */

  if (endPage < pages) {

    if (
      endPage < pages - 1
    ) {

      pageButtons += `
        <span
          class="pagination-ellipsis"
        >
          …
        </span>
      `;
    }


    pageButtons += `
      <button
        type="button"
        class="pagination-page"
        data-page="${pages}"
        aria-label="Go to page ${pages}"
      >
        ${pages}
      </button>
    `;
  }


  /* =====================================================
     MAIN PAGINATION HTML
     ===================================================== */

  container.innerHTML = `

    <div class="pagination-container">

      <!-- TOP ROW -->
      <div class="pagination-top">

        <div class="pagination-info">

          Showing
          <strong>
            ${start.toLocaleString()}–${end.toLocaleString()}
          </strong>

          of

          <strong>
            ${total.toLocaleString()}
          </strong>

        </div>


        <div class="pagination-size">

          <label
            for="${containerId}-page-size"
          >
            Rows per page
          </label>

          <select
            id="${containerId}-page-size"
            aria-label="Rows per page"
          >

            <option
              value="10"
              ${
                pageSize === 10
                  ? 'selected'
                  : ''
              }
            >
              10
            </option>

            <option
              value="20"
              ${
                pageSize === 20
                  ? 'selected'
                  : ''
              }
            >
              20
            </option>

            <option
              value="50"
              ${
                pageSize === 50
                  ? 'selected'
                  : ''
              }
            >
              50
            </option>

          </select>

        </div>

      </div>


      <!-- BOTTOM ROW -->
      <div class="pagination-bottom">

        <button
          type="button"
          class="pagination-nav pagination-prev"
          id="${containerId}-prev"
          ${
            page <= 1
              ? 'disabled'
              : ''
          }
        >
          ‹ Previous
        </button>


        <div class="pagination-pages">

          ${pageButtons}

        </div>


        <button
          type="button"
          class="pagination-nav pagination-next"
          id="${containerId}-next"
          ${
            page >= pages
              ? 'disabled'
              : ''
          }
        >
          Next ›
        </button>


        <button
          type="button"
          class="pagination-show-all"
          id="${containerId}-show-all"
        >
          Show All
        </button>

      </div>

    </div>
  `;


  /* =====================================================
     PAGE SIZE
     ===================================================== */

  document
    .getElementById(
      `${containerId}-page-size`
    )
    ?.addEventListener(
      'change',
      (event) => {

        const newPageSize =
          Number(
            event.target.value
          );

        onPageSizeChange?.(
          newPageSize
        );
      }
    );


  /* =====================================================
     PREVIOUS
     ===================================================== */

  document
    .getElementById(
      `${containerId}-prev`
    )
    ?.addEventListener(
      'click',
      () => {

        if (page > 1) {

          onPageChange?.(
            page - 1
          );
        }
      }
    );


  /* =====================================================
     NEXT
     ===================================================== */

  document
    .getElementById(
      `${containerId}-next`
    )
    ?.addEventListener(
      'click',
      () => {

        if (page < pages) {

          onPageChange?.(
            page + 1
          );
        }
      }
    );


  /* =====================================================
     PAGE NUMBERS
     ===================================================== */

  container
    .querySelectorAll(
      '.pagination-page'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',
          () => {

            const selectedPage =
              Number(
                button.getAttribute(
                  'data-page'
                )
              );

            onPageChange?.(
              selectedPage
            );
          }
        );
      }
    );


  /* =====================================================
     SHOW ALL
     ===================================================== */

  document
    .getElementById(
      `${containerId}-show-all`
    )
    ?.addEventListener(
      'click',
      () => {

        onShowAll?.(
          true
        );
      }
    );
}