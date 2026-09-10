/**
 * FraudShield AI
 * API Client
 * OpenAPI-compatible frontend API layer
 */

const BASE_URL = window.location.origin;

export const API = {

  // ============================================================
  // AUTH HEADERS
  // ============================================================

  getAuthHeaders() {

    const token =
      localStorage.getItem('access_token');

    return token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {};

  },


  // ============================================================
  // GENERIC REQUEST
  // ============================================================

  async request(
    endpoint,
    options = {}
  ) {

    const headers = {

      'Content-Type':
        'application/json',

      ...this.getAuthHeaders(),

      ...options.headers

    };


    if (options.isFormData) {

      delete headers['Content-Type'];

    }


    try {

      const response =
        await fetch(
          `${BASE_URL}${endpoint}`,
          {
            ...options,
            headers
          }
        );


      // --------------------------------------------------------
      // SESSION EXPIRED
      // --------------------------------------------------------

      if (
        response.status === 401
      ) {

        localStorage.removeItem(
          'access_token'
        );

        localStorage.removeItem(
          'refresh_token'
        );

        window.location.hash =
          '#/login';

        throw new Error(
          'Session expired. Please log in again.'
        );

      }


      // --------------------------------------------------------
      // HTTP ERROR
      // --------------------------------------------------------

      if (!response.ok) {

        const errorData =
          await response
            .json()
            .catch(
              () => ({})
            );


        const detail =
          errorData?.detail;


        let message =
          `HTTP Error: ${response.status}`;


        if (
          Array.isArray(detail)
        ) {

          message =
            detail
              .map(
                item =>
                  item?.msg ||
                  String(item)
              )
              .join(', ');

        } else if (detail) {

          message =
            String(detail);

        } else if (
          errorData?.message
        ) {

          message =
            String(
              errorData.message
            );

        }


        throw new Error(
          message
        );

      }


      // --------------------------------------------------------
      // EMPTY RESPONSE
      // --------------------------------------------------------

      if (
        response.status === 204
      ) {

        return null;

      }


      return await response.json();

    } catch (error) {

      console.error(
        `API Error on ${endpoint}:`,
        error
      );

      throw error;

    }

  },


  // ============================================================
  // AUTH
  // ============================================================

  async login(
    username,
    password
  ) {

    const params =
      new URLSearchParams();

    params.append(
      'username',
      username
    );

    params.append(
      'password',
      password
    );

    params.append(
      'grant_type',
      'password'
    );


    const response =
      await fetch(
        `${BASE_URL}/api/v1/auth/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/x-www-form-urlencoded'
          },

          body:
            params.toString()
        }
      );


    if (!response.ok) {

      throw new Error(
        'Invalid credentials'
      );

    }


    return await response.json();

  },


  async register(data) {

    return this.request(
      '/api/v1/auth/register',
      {
        method: 'POST',
        body:
          JSON.stringify(data)
      }
    );

  },


  async getMe() {

    return this.request(
      '/api/v1/auth/me'
    );

  },


  // ============================================================
  // DASHBOARD
  // ============================================================

  async getDashboardSummary() {

    return this.request(
      '/api/v1/dashboard/summary'
    );

  },


  // ============================================================
  // LIVE STREAM
  // ============================================================

  async getLiveTransactions(
    page = 1,
    pageSize = 5
  ) {

    return this.request(
      `/api/v1/stream/recent?page=${page}&page_size=${pageSize}`
    );

  },


  async getStreamMetrics() {

    return this.request(
      '/api/v1/stream/metrics'
    );

  },


  async getStreamStatus() {

    return this.request(
      '/api/v1/stream/status'
    );

  },


  async startStream(
    config = {}
  ) {

    return this.request(
      '/api/v1/stream/start',
      {
        method: 'POST',
        body:
          JSON.stringify(config)
      }
    );

  },


  async stopStream() {

    return this.request(
      '/api/v1/stream/stop',
      {
        method: 'POST'
      }
    );

  },


  async getLiveAlerts(
    limit = 10
  ) {

    return this.request(
      `/api/v1/dashboard/live-alerts?limit=${limit}`
    );

  },


  async getFraudOverview() {

    return this.request(
      '/api/v1/dashboard/fraud-overview'
    );

  },


  async getRiskDistribution() {

    return this.request(
      '/api/v1/dashboard/risk-distribution'
    );

  },


  // ============================================================
  // TRANSACTIONS
  // ============================================================

  async getTransactions(
    page = 1,
    pageSize = 10
  ) {

    return this.request(
      `/api/v1/transactions?page=${page}&page_size=${pageSize}`
    );

  },


  async globalSearch(
    query,
    limit = 20
  ) {

    return this.request(
      `/api/v1/transactions/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );

  },


  async createTransaction(
    payload
  ) {

    return this.request(
      '/api/v1/transactions',
      {
        method: 'POST',
        body:
          JSON.stringify(payload)
      }
    );

  },


  // ============================================================
  // ALERTS
  // ============================================================

  async getAlerts(
    page = 1,
    pageSize = 10
  ) {

    return this.request(
      `/api/v1/alerts?page=${page}&page_size=${pageSize}`
    );

  },


  async resolveAlert(
    alertId,
    note
  ) {

    return this.request(
      `/api/v1/alerts/${alertId}/resolve`,
      {
        method: 'PATCH',

        body:
          JSON.stringify({
            resolution_note:
              note
          })
      }
    );

  },


  // ============================================================
  // FRAUD CASES
  // ============================================================

  async getFraudCases(
    page = 1,
    pageSize = 10
  ) {

    return this.request(
      `/api/v1/fraud-cases?page=${page}&page_size=${pageSize}`
    );

  },


  async closeCase(
    caseId,
    resolution,
    review_notes
  ) {

    return this.request(
      `/api/v1/fraud-cases/${caseId}/close`,
      {
        method: 'PATCH',

        body:
          JSON.stringify({
            resolution,
            review_notes
          })
      }
    );

  },


  // ============================================================
  // ML MODELS
  // ============================================================

  async getModels() {

    return this.request(
      '/api/v1/models'
    );

  },


  async triggerTraining(
    payload = {}
  ) {

    return this.request(
      '/api/v1/models/train',
      {
        method: 'POST',

        body:
          JSON.stringify(payload)
      }
    );

  },


  // ============================================================
  // ADMINISTRATION
  // ============================================================

  async getUsers(
    page = 1,
    pageSize = 10
  ) {

    return this.request(
      `/api/v1/users/?page=${page}&page_size=${pageSize}`
    );

  },


  async getAdminMetrics() {

    return this.request(
      '/api/v1/admin/metrics'
    );

  }

};