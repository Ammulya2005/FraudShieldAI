/**
 * API Client Engine matching OpenAPI 3.1.0 specifications
 */
const BASE_URL = window.location.origin;

export const API = {
  getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    if (options.isFormData) {
      delete headers['Content-Type'];
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.hash = '#/login';
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail?.[0]?.msg || errorData.detail || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  },

  // Auth Operations
  async login(username, password) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', 'password');

    const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!res.ok) throw new Error('Invalid credentials');
    return await res.json();
  },

  async register(data) {
    return this.request('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(data) });
  },

  async getMe() {
    return this.request('/api/v1/auth/me');
  },

  // Dashboard & Metrics
  async getDashboardSummary() {
    return this.request('/api/v1/dashboard/summary');
  },

  async getLiveTransactions(limit = 10) {
    return this.request(`/api/v1/dashboard/live-transactions?limit=${limit}`);
  },

  async getLiveAlerts(limit = 10) {
    return this.request(`/api/v1/dashboard/live-alerts?limit=${limit}`);
  },

  async getFraudOverview() {
    return this.request('/api/v1/dashboard/fraud-overview');
  },

  async getRiskDistribution() {
    return this.request('/api/v1/dashboard/risk-distribution');
  },

  // Transactions
  async getTransactions() {
    return this.request('/api/v1/transactions');
  },

  async createTransaction(payload) {
    return this.request('/api/v1/transactions', { method: 'POST', body: JSON.stringify(payload) });
  },

  // Alerts
  async getAlerts() {
    return this.request('/api/v1/alerts');
  },

  async resolveAlert(alertId, note) {
    return this.request(`/api/v1/alerts/${alertId}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ resolution_note: note }),
    });
  },

  // Cases
  async getFraudCases() {
    return this.request('/api/v1/fraud-cases');
  },

  async closeCase(caseId, resolution, review_notes) {
    return this.request(`/api/v1/fraud-cases/${caseId}/close`, {
      method: 'PATCH',
      body: JSON.stringify({ resolution, review_notes }),
    });
  },

  // ML Models
  async getModels() {
    return this.request('/api/v1/models');
  },

  async triggerTraining(payload = {}) {
    return this.request('/api/v1/models/train', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Streaming Engine Controls
  async getStreamStatus() {
    return this.request('/api/v1/stream/status');
  },

  async startStream() {
    return this.request('/api/v1/stream/start', { method: 'POST', body: JSON.stringify({}) });
  },

  async stopStream() {
    return this.request('/api/v1/stream/stop', { method: 'POST' });
  },

  // Administration
  async getUsers() {
    return this.request('/api/v1/users/');
  },

  async getAdminMetrics() {
    return this.request('/api/v1/admin/metrics');
  }
};