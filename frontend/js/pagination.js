/**
 * Reusable pagination component
 *
 * Supports:
 * - 10 records per page
 * - 20 records per page
 * - Show All
 * - Previous / Next
 * - Page numbers
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
  const container = document.getElementById(containerId);

  if (!container) return;

  if (isShowingAll) {
    container.innerHTML = `
      <div class="pagination-wrapper">
        <div class="pagination-info">
          Showing all <strong>${total}</strong> records
        </div>

        <button
          type="button"
          class="btn btn-sm btn-outline"
          id="${containerId}-show-paginated"
        >
          Show Paginated
        </button>
      </div>
    `;

    document
      .getElementById(`${containerId}-show-paginated`)
      ?.addEventListener('click', () => {
        onShowAll?.(false);
      });

    return;
  }

  if (total === 0) {
    container.innerHTML = '';
    return;
  }

  const start = ((page - 1) * pageSize) + 1;
  const end = Math.min(page * pageSize, total);

  let pageButtons = '';

  const maxVisiblePages = 5;

  let startPage = Math.max(1, page - 2);
  let endPage = Math.min(pages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    pageButtons += `
      <button
        type="button"
        class="pagination-page"
        data-page="1"
      >
        1
      </button>
    `;

    if (startPage > 2) {
      pageButtons += `<span class="pagination-ellipsis">...</span>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageButtons += `
      <button
        type="button"
        class="pagination-page ${i === page ? 'active' : ''}"
        data-page="${i}"
      >
        ${i}
      </button>
    `;
  }

  if (endPage < pages) {
    if (endPage < pages - 1) {
      pageButtons += `<span class="pagination-ellipsis">...</span>`;
    }

    pageButtons += `
      <button
        type="button"
        class="pagination-page"
        data-page="${pages}"
      >
        ${pages}
      </button>
    `;
  }

  container.innerHTML = `
    <div class="pagination-wrapper">

      <div class="pagination-info">
        Showing <strong>${start}–${end}</strong> of
        <strong>${total}</strong>
      </div>

      <div class="pagination-controls">

        <label class="pagination-size">
          Rows:
          <select id="${containerId}-page-size">
            <option value="10" ${pageSize === 10 ? 'selected' : ''}>
              10
            </option>
            <option value="20" ${pageSize === 20 ? 'selected' : ''}>
              20
            </option>
          </select>
        </label>

        <button
          type="button"
          class="pagination-nav"
          id="${containerId}-prev"
          ${page <= 1 ? 'disabled' : ''}
        >
          ‹ Previous
        </button>

        <div class="pagination-pages">
          ${pageButtons}
        </div>

        <button
          type="button"
          class="pagination-nav"
          id="${containerId}-next"
          ${page >= pages ? 'disabled' : ''}
        >
          Next ›
        </button>

        <button
          type="button"
          class="btn btn-sm btn-outline"
          id="${containerId}-show-all"
        >
          Show All
        </button>

      </div>
    </div>
  `;

  document
    .getElementById(`${containerId}-page-size`)
    ?.addEventListener('change', (event) => {
      const newPageSize = Number(event.target.value);
      onPageSizeChange?.(newPageSize);
    });

  document
    .getElementById(`${containerId}-prev`)
    ?.addEventListener('click', () => {
      if (page > 1) {
        onPageChange?.(page - 1);
      }
    });

  document
    .getElementById(`${containerId}-next`)
    ?.addEventListener('click', () => {
      if (page < pages) {
        onPageChange?.(page + 1);
      }
    });

  container
    .querySelectorAll('.pagination-page')
    .forEach(button => {
      button.addEventListener('click', () => {
        const selectedPage = Number(
          button.getAttribute('data-page')
        );

        onPageChange?.(selectedPage);
      });
    });

  document
    .getElementById(`${containerId}-show-all`)
    ?.addEventListener('click', () => {
      onShowAll?.(true);
    });
}