import { API } from './api.js';
import { initTheme } from './theme.js';
import { AuthState } from './auth.js';
import { initGlobalSearch } from './global-search.js';
import { renderLogin, initLoginEvents } from './views/login.js';
import { renderDashboard, initDashboardEvents } from './views/dashboard.js';
import { renderTransactions, initTransactionsEvents } from './views/transactions.js';
import { renderAlerts, initAlertsEvents } from './views/alerts.js';
import { renderCases, initCasesEvents } from './views/cases.js';
import { renderModels, initModelsEvents } from './views/models.js';
import { renderAdmin, initAdminEvents } from './views/admin.js';
import { renderHome, initHomeEvents } from './views/home.js';
import {renderRequests,initRequestsEvents} from './views/requests.js';
const routes = {
  '/home': {
    render: renderHome,
    init: initHomeEvents,
    roles: ['all']
  },
  '/login': {
    render: renderLogin,
    init: initLoginEvents,
    roles: ['all']
  },
  '/dashboard': {
    render: renderDashboard,
    init: initDashboardEvents,
    roles: ['analyst', 'fraud_manager', 'admin', 'super_admin']
  },
  '/transactions': {
    render: renderTransactions,
    init: initTransactionsEvents,
    roles: ['analyst', 'fraud_manager', 'admin', 'super_admin']
  },
  '/alerts': {
    render: renderAlerts,
    init: initAlertsEvents,
    roles: ['analyst', 'fraud_manager', 'admin']
  },
  '/cases': {
    render: renderCases,
    init: initCasesEvents,
    roles: ['analyst', 'fraud_manager', 'admin']
  },
  '/models': {
    render: renderModels,
    init: initModelsEvents,
    roles: ['fraud_manager', 'admin']
  },
  '/admin': {
    render: renderAdmin,
    init: initAdminEvents,
    roles: ['admin']
  },
  '/requests': {
  render: renderRequests,
  init: initRequestsEvents,
  roles: ['admin', 'super_admin']
 },
};

export async function router() {

  // Stop previous page polling
  if (window.currentViewPoller) {
    clearInterval(window.currentViewPoller);
    window.currentViewPoller = null;
  }

  const path = window.location.hash.slice(1) || '/home';

  const authenticated = await AuthState.init();

  if (!authenticated && path !== '/login' && path !== '/home') {
    window.location.hash = '#/login';
    return;
  }

  if (authenticated && path === '/login') {
    window.location.hash = '#/dashboard';
    return;
  }

  const route = routes[path] || routes['/home'];

  // RBAC
  if (authenticated && !AuthState.canAccess(route.roles)) {
    alert('Access Denied: You lack permissions for this dashboard role.');
    window.location.hash = '#/dashboard';
    return;
  }

  // =========================================================
// SIDEBAR / TOPBAR VISIBILITY
// =========================================================

const sidebar =
  document.getElementById('sidebar');

const topbar =
  document.getElementById('topbar');

const publicPage =
  path === '/home' ||
  path === '/login';

if (publicPage) {

  sidebar?.classList.add('hidden');
  topbar?.classList.add('hidden');

  sidebar?.setAttribute('aria-hidden', 'true');
  topbar?.setAttribute('aria-hidden', 'true');

  document
    .getElementById('app')
    ?.classList.add('public-layout');

} else {

  sidebar?.classList.remove('hidden');
  topbar?.classList.remove('hidden');

  sidebar?.removeAttribute('aria-hidden');
  topbar?.removeAttribute('aria-hidden');

  document
    .getElementById('app')
    ?.classList.remove('public-layout');

  updateNavRBAC();
  setupUserWidget();

}

  // Render current page
  const container = document.getElementById('router-view');

  if (!container) {
    console.error('router-view element not found');
    return;
  }

  container.innerHTML = route.render();

  // IMPORTANT:
  // Initialize events AFTER the page has been rendered.
  await route.init((newPath) => {
    window.location.hash = `#${newPath}`;
  });

  // Setup stream button AFTER dashboard is rendered
  if (path === '/dashboard') {
    setupStreamButton();
  }

  setupLogoutButton();
}

function setupStreamButton() {

  const btn = document.getElementById('btn-stream-toggle');
  const label = document.getElementById('kafka-stream-status');

  if (!btn) {
    console.warn('Start Ingestion button not found');
    return;
  }

  // Prevent duplicate listeners
  if (btn.dataset.streamListenerAttached === 'true') {
    return;
  }

  btn.dataset.streamListenerAttached = 'true';

  // Add a dedicated class so responsive.css can control this button
  btn.classList.add('stream-ingestion-btn');

  let isStreaming = false;

  // Check current backend status
  API.getStreamStatus()
    .then(status => {

      console.log('Stream status:', status);

      isStreaming = status.status === 'streaming';

      if (isStreaming) {

        btn.innerText = 'Stop Ingestion';
        btn.className = 'btn btn-sm btn-outline-danger stream-ingestion-btn';

        if (label) {
          label.innerText = 'Engine: Streaming Live';
        }

      } else {

        btn.innerText = 'Start Stream Ingestion';
        btn.className = 'btn btn-sm btn-primary stream-ingestion-btn';

        if (label) {
          label.innerText = 'Engine: Polling';
        }
      }

    })
    .catch(error => {

      console.error(
        'Could not get stream status:',
        error
      );

    });

  btn.addEventListener('click', async () => {

    btn.disabled = true;

    try {

      if (!isStreaming) {

        console.log('Starting stream ingestion...');

        const result = await API.startStream();

        console.log(
          'Start ingestion response:',
          result
        );

        isStreaming = true;

        btn.innerText = 'Stop Ingestion';
        btn.className =
          'btn btn-sm btn-outline-danger stream-ingestion-btn';

        if (label) {
          label.innerText = 'Engine: Streaming Live';
        }

      } else {

        console.log('Stopping stream ingestion...');

        const result = await API.stopStream();

        console.log(
          'Stop ingestion response:',
          result
        );

        isStreaming = false;

        btn.innerText = 'Start Stream Ingestion';
        btn.className =
          'btn btn-sm btn-primary stream-ingestion-btn';

        if (label) {
          label.innerText = 'Engine: Polling';
        }
      }

    } catch (error) {

      console.error(
        'Stream ingestion error:',
        error
      );

      alert(
        'Unable to change stream status.\n\n' +
        (error.message || error)
      );

    } finally {

      btn.disabled = false;
    }
  });
}

function updateNavRBAC() {

  const currentRole = AuthState.getUserRole();

  document.querySelectorAll('.nav-item').forEach(item => {

    const roleData = item.getAttribute('data-role');

    if (!roleData) {
      return;
    }

    const allowed = roleData.split(',');

    if (
      currentRole === 'super_admin' ||
      allowed.includes('all') ||
      allowed.includes(currentRole)
    ) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function setupUserWidget() {

  if (!AuthState.user) {
    return;
  }

  const name = document.getElementById('user-display-name');
  const role = document.getElementById('user-display-role');

  if (name) {
    name.innerText = AuthState.user.username || 'Unnamed user';
  }

  if (role) {
    role.innerText = AuthState.getUserRole().replace('_', ' ');
  }
}

function setupLogoutButton() {

  const logoutBtn = document.getElementById('btn-logout');

  if (!logoutBtn) {
    return;
  }

  if (logoutBtn.dataset.logoutListenerAttached === 'true') {
    return;
  }

  logoutBtn.dataset.logoutListenerAttached = 'true';

  logoutBtn.addEventListener('click', () => {
    AuthState.clear();
    window.location.hash = '#/login';
  });
}

// Global router events
window.addEventListener('hashchange', router);

window.addEventListener('DOMContentLoaded', () => {
  router();
});

function initMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('mobile-menu-toggle');
    const overlay = document.getElementById('mobile-sidebar-overlay');

    if (!sidebar || !toggle || !overlay) {
        return;
    }

    function openSidebar() {
        sidebar.classList.add('mobile-open');
        overlay.classList.add('active');

        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close navigation');
        toggle.textContent = '✕';
    }

    function closeSidebar() {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');

        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
        toggle.textContent = '☰';
    }

    toggle.addEventListener('click', () => {
        if (sidebar.classList.contains('mobile-open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay.addEventListener('click', closeSidebar);

    /* Close menu after selecting a navigation item */
    sidebar.addEventListener('click', event => {
        const link = event.target.closest('a');

        if (link && window.innerWidth <= 768) {
            closeSidebar();
        }
    });

    /* Close sidebar when switching back to desktop */
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
}
initTheme();
initGlobalSearch();
initMobileSidebar();