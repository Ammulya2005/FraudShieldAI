import { API } from './api.js';

let searchTimeout = null;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getResultTitle(item, type) {
  if (type === 'transaction') {
    return item.transaction_id || 'Transaction';
  }

  if (type === 'fraud_case') {
    return item.case_id || 'Fraud Case';
  }

  if (type === 'alert') {
    return item.alert_id || 'Alert';
  }

  return 'Result';
}

function getResultSubtitle(item, type) {
  if (type === 'transaction') {
    return [
      item.user_id ? `User: ${item.user_id}` : '',
      item.location ? `Location: ${item.location}` : '',
      item.final_prediction
        ? `Status: ${item.final_prediction}`
        : ''
    ]
      .filter(Boolean)
      .join(' • ');
  }

  if (type === 'fraud_case') {
    return [
      item.transaction_id
        ? `Transaction: ${item.transaction_id}`
        : '',
      item.user_id ? `User: ${item.user_id}` : '',
      item.priority ? `Priority: ${item.priority}` : '',
      item.status ? `Status: ${item.status}` : ''
    ]
      .filter(Boolean)
      .join(' • ');
  }

  if (type === 'alert') {
    return [
      item.transaction_id
        ? `Transaction: ${item.transaction_id}`
        : '',
      item.severity ? `Severity: ${item.severity}` : '',
      item.status ? `Status: ${item.status}` : ''
    ]
      .filter(Boolean)
      .join(' • ');
  }

  return '';
}

function renderResult(item, type) {
  const title = escapeHtml(
    getResultTitle(item, type)
  );

  const subtitle = escapeHtml(
    getResultSubtitle(item, type)
  );

  const labels = {
    transaction: 'Transaction',
    fraud_case: 'Fraud Case',
    alert: 'Alert'
  };

  return `
    <button
      type="button"
      class="global-search-result"
      data-result-type="${type}"
      data-result-id="${escapeHtml(
        getResultTitle(item, type)
      )}"
    >
      <span class="global-search-result-type">
        ${labels[type]}
      </span>

      <span class="global-search-result-content">
        <strong>${title}</strong>

        ${
          subtitle
            ? `<small>${subtitle}</small>`
            : ''
        }
      </span>
    </button>
  `;
}

function renderResults(data) {
  const resultsContainer =
    document.getElementById(
      'global-search-results'
    );

  if (!resultsContainer) return;

  const transactions =
    data.transactions || [];

  const fraudCases =
    data.fraud_cases || [];

  const alerts =
    data.alerts || [];

  const total =
    transactions.length +
    fraudCases.length +
    alerts.length;

  if (!total) {
    resultsContainer.innerHTML = `
      <div class="global-search-empty">
        No results found
      </div>
    `;

    resultsContainer.classList.remove(
      'hidden'
    );

    return;
  }

  let html = '';

  if (transactions.length) {
    html += `
      <div class="global-search-section">
        <div class="global-search-section-title">
          Transactions
        </div>

        ${transactions
          .map(item =>
            renderResult(
              item,
              'transaction'
            )
          )
          .join('')}
      </div>
    `;
  }

  if (fraudCases.length) {
    html += `
      <div class="global-search-section">
        <div class="global-search-section-title">
          Fraud Cases
        </div>

        ${fraudCases
          .map(item =>
            renderResult(
              item,
              'fraud_case'
            )
          )
          .join('')}
      </div>
    `;
  }

  if (alerts.length) {
    html += `
      <div class="global-search-section">
        <div class="global-search-section-title">
          Alerts
        </div>

        ${alerts
          .map(item =>
            renderResult(
              item,
              'alert'
            )
          )
          .join('')}
      </div>
    `;
  }

  resultsContainer.innerHTML = html;

  resultsContainer.classList.remove(
    'hidden'
  );
}

function showLoading(show) {
  const loading =
    document.getElementById(
      'global-search-loading'
    );

  if (!loading) return;

  loading.classList.toggle(
    'hidden',
    !show
  );
}

async function performSearch(query) {
  const trimmedQuery =
    query.trim();

  const resultsContainer =
    document.getElementById(
      'global-search-results'
    );

  if (!resultsContainer) return;

  if (!trimmedQuery) {
    resultsContainer.innerHTML = '';

    resultsContainer.classList.add(
      'hidden'
    );

    showLoading(false);

    return;
  }

  showLoading(true);

  try {
    const data =
      await API.globalSearch(
        trimmedQuery,
        20
      );

    renderResults(data);

  } catch (error) {
    console.error(
      'Global search failed:',
      error
    );

    resultsContainer.innerHTML = `
      <div class="global-search-empty">
        Search failed. Please try again.
      </div>
    `;

    resultsContainer.classList.remove(
      'hidden'
    );

  } finally {
    showLoading(false);
  }
}

function setupSearchEvents() {
  const input =
    document.getElementById(
      'global-search-input'
    );

  const resultsContainer =
    document.getElementById(
      'global-search-results'
    );

  if (!input || !resultsContainer) {
    return;
  }

  input.addEventListener(
    'input',
    () => {
      clearTimeout(searchTimeout);

      searchTimeout = setTimeout(() => {
        performSearch(input.value);
      }, 300);
    }
  );

  input.addEventListener(
    'keydown',
    event => {
      if (event.key === 'Escape') {
        input.value = '';

        resultsContainer.classList.add(
          'hidden'
        );

        input.blur();
      }
    }
  );

  document.addEventListener(
    'click',
    event => {
      const searchBox =
        event.target.closest(
          '.global-search'
        );

      if (!searchBox) {
        resultsContainer.classList.add(
          'hidden'
        );
      }
    }
  );
}

export function initGlobalSearch() {
  setupSearchEvents();
}