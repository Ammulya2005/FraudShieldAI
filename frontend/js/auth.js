/**
 * Auth State & RBAC Helper
 */
import { API } from './api.js';

export const AuthState = {
  user: null,
  isAuthenticated: false,

  async init() {
    const token = localStorage.getItem('access_token');

    if (!token) {
      this.clear();
      return false;
    }

    try {
      this.user = await API.getMe();
      this.isAuthenticated = true;
      return true;
    } catch {
      this.clear();
      return false;
    }
  },

  setToken(tokenResponse) {
    localStorage.setItem(
      'access_token',
      tokenResponse.access_token
    );

    if (tokenResponse.refresh_token) {
      localStorage.setItem(
        'refresh_token',
        tokenResponse.refresh_token
      );
    }
  },

  clear() {
    this.user = null;
    this.isAuthenticated = false;

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  getUserRole() {

    // Read roles returned by the backend
    if (
      this.user &&
      Array.isArray(this.user.roles) &&
      this.user.roles.length > 0
    ) {
      return this.user.roles[0].toLowerCase();
    }

    // User has no assigned role
    return 'user';
  },

  canAccess(targetRoles) {

    const role = this.getUserRole();

    // Super Admin has complete access
    if (role === 'super_admin') {
      return true;
    }

    // Public/common access
    if (targetRoles.includes('all')) {
      return true;
    }

    return targetRoles.includes(role);
  }
};