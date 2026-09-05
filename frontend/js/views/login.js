import { API } from '../api.js';
import { AuthState } from '../auth.js';

export function renderLogin() {
  return `
    <div style="max-width: 420px; margin: 5rem auto;" class="card">
      <div style="text-align: center; margin-bottom: 2rem;">
        <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">FraudShield<span style="color:var(--accent-primary);">AI</span></h2>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Real-Time Financial Anomaly Detection</p>
      </div>
      <form id="login-form">
        <div class="form-group">
          <label for="username">Username or Email</label>
          <input type="text" id="username" class="form-control" placeholder="analyst@fraudshield.ai" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" class="form-control" placeholder="••••••••" required />
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Authenticate</button>
      </form>
    </div>
  `;
}

export function initLoginEvents(navigate) {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    try {
      const tokenData = await API.login(u, p);
      AuthState.setToken(tokenData);
      await AuthState.init();
      navigate('/dashboard');
    } catch (err) {
      alert(`Authentication failed: ${err.message}`);
    }
  });
}