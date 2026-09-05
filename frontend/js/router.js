import { AuthState } from './auth.js';
import { API } from './api.js';
import { renderLogin, initLoginEvents } from './views/login.js';
import { renderDashboard, initDashboardEvents } from './views/dashboard.js';
import { renderTransactions, initTransactionsEvents } from './views/transactions.js';
import { renderAlerts, initAlertsEvents } from './views/alerts.js';
import { renderCases, initCasesEvents } from './views/cases.js';
import { renderModels, initModelsEvents } from './views/models.js';
import { renderAdmin, initAdminEvents } from './views/admin.js';

const routes = {
  '/login': { render: renderLogin, init: initLoginEvents, roles: ['all'] },
  '/dashboard': { render: renderDashboard, init: initDashboardEvents, roles: ['all'] },
  '/transactions': { render: renderTransactions, init: initTransactionsEvents, roles: ['all'] },
  '/alerts': { render: renderAlerts, init: initAlertsEvents, roles: ['analyst', 'manager', 'admin'] },
  '/cases': { render: renderCases, init: initCasesEvents, roles: ['analyst', 'manager', 'admin'] },
  '/models': { render: renderModels, init: initModelsEvents, roles: ['manager', 'admin'] },
  '/admin': { render: renderAdmin, init: initAdminEvents, roles: ['admin'] },
};

export async function router() {
  if (window.currentViewPoller) {
    clearInterval(window.currentViewPoller);
    window.currentViewPoller = null;
  }

  const path = window.location.hash.slice(1) || '/dashboard';
  const authenticated = await AuthState.init();

  if (!authenticated && path !== '/login') {
    window.location.hash = '#/login';
    return;
  }

  if (authenticated && path === '/login') {
    window.location.hash = '#/dashboard';
    return;
  }

  const route = routes[path] || routes['/dashboard'];

  // RBAC Enforcement
  if (authenticated && !AuthState.canAccess(route.roles)) {
    alert("Access Denied: You lack permissions for this dashboard role.");
    window.location.hash = '#/dashboard';
    return;
  }

  // UI Framework Toggle (Hide sidebar/header on login)
  const sidebar = document.getElementById('sidebar');
  const topbar = document.getElementById('topbar');
  if (path === '/login') {
    sidebar.classList.add('hidden');
    topbar.classList.add('hidden');
  } else {
    sidebar.classList.remove('hidden');
    topbar.classList.remove('hidden');
    updateNavRBAC();
    setupUserWidget();
  }

  const container = document.getElementById('router-view');
  container.innerHTML = route.render();
  route.init((newPath) => { window.location.hash = `#${newPath}`; });
}

function updateNavRBAC() {
  const currentRole = AuthState.getUserRole();
  document.querySelectorAll('.nav-item').forEach(item => {
    const allowed = item.getAttribute('data-role').split(',');
    if (allowed.includes('all') || allowed.includes(currentRole)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function setupUserWidget() {
  if (!AuthState.user) return;
  document.getElementById('user-display-name').innerText = AuthState.user.username || 'Analyst';
  document.getElementById('user-display-role').innerText = AuthState.getUserRole();
}

// Global Event Listeners
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  router();

  // Stream Trigger Button
  let isStreaming = false;
  document.getElementById('btn-stream-toggle')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-stream-toggle');
    const label = document.getElementById('kafka-stream-status');
    if (!isStreaming) {
      await API.startStream().catch(() => {});
      btn.innerText = "Stop Ingestion";
      btn.className = "btn btn-sm btn-outline-danger";
      label.innerText = "Engine: Streaming Live";
      isStreaming = true;
    } else {
      await API.stopStream().catch(() => {});
      btn.innerText = "Start Stream Ingestion";
      btn.className = "btn btn-sm btn-primary";
      label.innerText = "Engine: Polling";
      isStreaming = false;
    }
  });

  document.getElementById('btn-logout')?.addEventListener('click', () => {
    AuthState.clear();
    window.location.hash = '#/login';
  });
});